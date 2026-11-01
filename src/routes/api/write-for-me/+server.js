import { json } from '@sveltejs/kit';
import { OPENROUTER_API_KEY, OPENROUTER_MODEL } from '$app/env/private';
// The system prompt lives in its own text file. "?raw" imports the file's text as a string.
import systemPrompt from '#lib/server/prompts/write-for-me.txt?raw';
import { DRAFTS_PER_USER_PER_DAY, useDraftAllowance } from '#lib/server/ai-limit.js';

// "Write it for me", the whole flow:
//   1. browser      -> my server   the user's rough notes          (posts/new/+page.svelte)
//   2. my server                   checks the user and the notes   (this file)
//   3. my server    -> OpenRouter  notes + system prompt + API key (this file)
//   4. OpenRouter   -> my server   the AI's answer                 (this file)
//   5. my server    -> browser     a title and a draft             (this file)
//   6. browser                     puts the draft in the form to edit (posts/new/+page.svelte)
// Nothing is published here: the user reads, edits and publishes the draft themselves.

const MAX_NOTES_LENGTH = 1000;

// Safety switch: only use OpenRouter's free models (their id ends in ":free"), so the AI
// can never cost anything. Set this to false only if you really want to use paid models.
const ONLY_FREE_MODELS = true;

// OPENROUTER_MODEL can be one model or a comma-separated list, e.g.
// "google/gemma-4-31b-it:free,nvidia/nemotron-3.5-lightning:free".
// If the first model is busy, OpenRouter tries the next one.
const models = (OPENROUTER_MODEL ?? '')
	.split(',')
	.map((model) => model.trim())
	.filter((model) => model !== '');

// Step 2: the browser has sent the notes to us with a POST request
export async function POST({ request, locals }) {
	// Only signed-in users may use the AI
	if (!locals.user) return problem(401, 'Please sign in to use "Write it for me".');
	if (!OPENROUTER_API_KEY || models.length === 0) return problem(503, '"Write it for me" is not set up yet.');
	if (ONLY_FREE_MODELS && !models.every((model) => model.endsWith(':free'))) {
		return problem(503, '"Write it for me" is set to free models only, but OPENROUTER_MODEL has a paid model.');
	}

	const { notes } = await request.json().catch(() => ({}));
	const text = String(notes ?? '').trim();

	if (text.length < 10) return problem(400, 'Write a few notes first (at least 10 characters).');
	if (text.length > MAX_NOTES_LENGTH) return problem(400, `Notes can be at most ${MAX_NOTES_LENGTH} characters.`);

	// A daily limit, so nobody can use up the free AI quota for everyone (see lib/server/ai-limit.js)
	const allowance = await useDraftAllowance(locals.user.id);
	if (allowance === 'user-limit') {
		return problem(429, `You can use "Write it for me" ${DRAFTS_PER_USER_PER_DAY} times a day. Try again tomorrow!`);
	}
	if (allowance === 'site-limit') {
		return problem(429, '"Write it for me" has been used a lot today. Please try again tomorrow!');
	}

	// Step 3: our server asks OpenRouter. The secret API key is added here, on the server,
	// so it never reaches the browser.
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			models, // the models to try, in order
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: `I am a ${locals.user.role} at the farm. My notes:\n\n${text}` }
			],
			max_tokens: 1000,
			// Some models "think" before answering. Turning that off makes them answer
			// straight away, instead of using up all 1000 tokens on thinking.
			reasoning: { enabled: false }
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
