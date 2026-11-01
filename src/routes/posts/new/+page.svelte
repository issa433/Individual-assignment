<script>
	// `data.user` is the signed-in user (from +layout.server.js).
	// `form` is what the action returned if something was wrong: an error and the text typed so far.
	let { data, form } = $props();

	// Tell the writer where the post will show up, based on their role
	let section = $derived(data.user.role === 'host' ? 'From the farm' : 'Guest stories');

	// The form fields. bind:value below keeps these and the inputs in sync,
	// so "Write it for me" can fill them in. They start with what was typed before an error.
	// Svelte warns that this only reads `form` once. That's what we want: after a failed
	// submit the whole page loads again, so these start over with the new values.
	// svelte-ignore state_referenced_locally
	let title = $state(form?.title ?? '');
	// svelte-ignore state_referenced_locally
	let body = $state(form?.body ?? '');

	// ---------- "Write it for me" ----------
	const MAX_NOTES_LENGTH = 1000;
	let notes = $state('');
	let writing = $state(false); // true while we wait for the AI
	let aiError = $state('');

	// Step 1: send the notes to OUR server (not to OpenRouter directly, so the API key stays secret).
	// See routes/api/write-for-me/+server.js for steps 2–5.
	async function writeForMe() {
		if ((title || body) && !confirm('Replace your title and text with a new draft?')) return;

		writing = true;
		aiError = '';

		try {
			const response = await fetch('/api/write-for-me', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notes })
			});
			const result = await response.json();

			if (!response.ok) {
				aiError = result.error;
				return;
			}

			// Step 6: put the draft in the form. The user edits it and decides when to publish.
			title = result.title;
			body = result.body;
		} catch {
			aiError = 'Could not reach the server. Check your connection and try again.';
		} finally {
			writing = false;
		}
	}
</script>

<svelte:head>
	<title>Write a post · Nissamåla Farm</title>
</svelte:head>

<div class="form-page">
	<form class="form-card wide" method="POST">
		<h1>Write a post</h1>
		<p class="intro">Your post will be shown under <strong>{section}</strong>.</p>

		<!-- The AI helper. The notes field has no name, so it's never sent when you publish. -->
		<section class="helper" aria-labelledby="helper-title">
			<h2 id="helper-title">Write it for me</h2>
			<p class="hint">
				Jot down a few notes or bullet points. The AI writes a draft below, which you can change before you
				publish. Nothing is published automatically.
			</p>

			<label for="notes" class="visually-hidden">Your notes</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="4"
				maxlength={MAX_NOTES_LENGTH}
				placeholder="e.g. walked to the lake, saw two deer, coffee on the big rock, rain in the afternoon"
			></textarea>

			<div class="helper-row">
				<button
					type="button"
					class="pill"
					onclick={writeForMe}
					disabled={writing || notes.trim().length < 10}
				>
					{writing ? 'Writing…' : 'Write it for me'}
				</button>
				<span class="hint">{notes.length} / {MAX_NOTES_LENGTH}</span>
			</div>

			<!-- aria-live reads these messages aloud to screen reader users -->
			<p class="status" aria-live="polite">
				{#if writing}The sheep is chewing on your notes… this can take a few seconds.{/if}
			</p>
			{#if aiError}
				<p class="form-error" role="alert">{aiError}</p>
			{/if}
		</section>

		{#if form?.error}
			<p class="form-error" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label for="title">Title</label>
			<input id="title" name="title" bind:value={title} maxlength="200" required />
		</div>

		<div class="field">
			<label for="body">Your story</label>
			<textarea id="body" name="body" bind:value={body} rows="14" maxlength="20000" required></textarea>
			<p class="hint">Leave an empty line between paragraphs.</p>
		</div>

		<button class="pill pill-primary">Publish</button>
	</form>
</div>

<style>
	.wide {
		width: min(44rem, 100%);
	}

	textarea {
		resize: vertical;
		line-height: 1.6;
	}

	/* The helper box: a dashed "note paper" inside the card */
	.helper {
		display: grid;
		gap: 0.6rem;
		margin: 1.5rem 0 2rem;
		padding: 1.25rem;
		border: 3px dashed var(--ink-soft);
		border-radius: var(--radius);
		background: #fff3c4;
	}

	.helper h2 {
		font-size: var(--step-1);
	}

	.helper-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.status {
		margin: 0;
		font-weight: 700;
	}
</style>
