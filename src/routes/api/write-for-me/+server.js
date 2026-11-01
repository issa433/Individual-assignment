import { json } from '@sveltejs/kit';
import { OPENROUTER_API_KEY, OPENROUTER_MODEL } from '$app/env/private';
// The system prompt lives in its own text file. "?raw" imports the file's text as a string.
import systemPrompt from '#lib/server/prompts/write-for-me.txt?raw';

// "Write it for me", the whole flow:
//   1. browser      -> my server   the user's rough notes          (posts/new/+page.svelte)
//   2. my server                   checks the user and the notes   (this file)
//   3. my server    -> OpenRouter  notes + system prompt + API key (this file)
//   4. OpenRouter   -> my server   the AI's answer                 (this file)
//   5. my server    -> browser     a title and a draft             (this file)
//   6. browser                     puts the draft in the form to edit (posts/new/+page.svelte)
// Nothing is published here: the user reads, edits and publishes the draft themselves.

const MAX_NOTES_LENGTH = 1000;

// Step 2: the browser has sent the notes to us with a POST request
export async function POST({ request, locals }) {
	// Only signed-in users may use the AI (every request costs a little money)
	if (!locals.user) return problem(401, 'Please sign in to use "Write it for me".');
	if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) return problem(503, '"Write it for me" is not set up yet.');

	const { notes } = await request.json().catch(() => ({}));
	const text = String(notes ?? '').trim();

	if (text.length < 10) return problem(400, 'Write a few notes first (at least 10 characters).');
	if (text.length > MAX_NOTES_LENGTH) return problem(400, `Notes can be at most ${MAX_NOTES_LENGTH} characters.`);

	// Step 3: our server asks OpenRouter. The secret API key is added here, on the server,
	// so it never reaches the browser.
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: OPENROUTER_MODEL,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: `I am a ${locals.user.role} at the farm. My notes:\n\n${text}` }
			],
			max_tokens: 1000
		}),
		signal: AbortSignal.timeout(30_000) // give up after 30 seconds
	}).catch(() => null); // no internet, or it took too long

	// Step 4: OpenRouter has answered. Check the answer and pull out the title and the post.
	if (!response?.ok) {
		console.error('OpenRouter request failed:', response?.status, await response?.text());
		return problem(502, 'The AI could not write a draft right now. Please try again.');
	}

	const result = await response.json();
	const draft = readDraft(result.choices?.[0]?.message?.content);
	if (!draft) return problem(502, 'The AI answered in a way we could not read. Please try again.');

	// Step 5: send the draft back to the browser
	return json(draft);
}

// The AI was asked to answer with JSON like {"title": "...", "body": "..."}.
// Some models add extra text around it, so we only read what's between the first { and the last }.
function readDraft(content) {
	try {
		const { title, body } = JSON.parse(content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1));
		if (typeof title !== 'string' || typeof body !== 'string' || !title.trim() || !body.trim()) return null;
		return { title: title.trim().slice(0, 200), body: body.trim() };
	} catch {
		return null;
	}
}

// An error answer the browser can show to the user, e.g. { error: 'Please sign in...' }
function problem(status, message) {
	return json({ error: message }, { status });
}
