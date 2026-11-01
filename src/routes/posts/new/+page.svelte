<script>
	// `data.user` is the signed-in user (from +layout.server.js).
	// `form` is what the action returned if something was wrong: an error and the text typed so far.
	let { data, form } = $props();

	// Tell the writer where the post will show up, based on their role
	let section = $derived(data.user.role === 'host' ? 'From the farm' : 'Guest stories');
</script>

<svelte:head>
	<title>Write a post · Nissamåla Farm</title>
</svelte:head>

<div class="form-page">
	<form class="form-card wide" method="POST">
		<h1>Write a post</h1>
		<p class="intro">Your post will be shown under <strong>{section}</strong>.</p>

		{#if form?.error}
			<p class="form-error" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label for="title">Title</label>
			<input id="title" name="title" value={form?.title ?? ''} maxlength="200" required />
		</div>

		<div class="field">
			<label for="body">Your story</label>
			<textarea id="body" name="body" rows="14" maxlength="20000" required>{form?.body ?? ''}</textarea>
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
</style>
