<script>
	import { formatDate, isoDate, paragraphs, sectionName } from '#lib/format.js';

	// `form` is what the comment action returned if something was wrong
	let { data, form } = $props();
	let post = $derived(data.post);

	// Go back to the section the post belongs to on the homepage
	let backLink = $derived(post.author_role === 'host' ? '/#farm' : '/#guests');
</script>

<svelte:head>
	<title>{post.title} · Nissamåla Farm</title>
</svelte:head>

<div class="page">
	<div class="column">
		<a class="pill back" href={backLink}><span aria-hidden="true">←</span> Back to the farm</a>

		<article class="post">
			<header>
				<p class="kicker">{sectionName(post.author_role)}</p>
				<h1>{post.title}</h1>
				<p class="byline">
					By {post.author_name} ·
					<time datetime={isoDate(post.created_at)}>{formatDate(post.created_at)}</time>
				</p>
			</header>

			<!-- {paragraph} is escaped by Svelte, so any HTML a user writes is shown as plain text -->
			{#each paragraphs(post.body) as paragraph}
				<p>{paragraph}</p>
			{/each}

			{#if data.canDelete}
				<!-- Asks "are you sure?" first. Clicking Cancel stops the form from being sent. -->
				<form
					class="delete-form"
					method="POST"
					action="?/delete"
					onsubmit={(event) => {
						if (!confirm('Delete this post and its comments? This cannot be undone.')) event.preventDefault();
					}}
				>
					<button class="pill pill-danger">Delete post</button>
				</form>
			{/if}
		</article>

		<section id="comments" class="comments" aria-labelledby="comments-title">
			<h2 id="comments-title">Comments ({data.comments.length})</h2>

			{#each data.comments as comment (comment.id)}
				<article class="comment">
					<p class="byline">
						<strong>{comment.author_name}</strong> ·
						<time datetime={isoDate(comment.created_at)}>{formatDate(comment.created_at)}</time>
					</p>
					<p>{comment.body}</p>
				</article>
			{:else}
				<p>No comments yet.</p>
			{/each}

			{#if data.user}
				<!-- "?/comment" runs the action called `comment` in +page.server.js -->
				<form class="comment-form" method="POST" action="?/comment">
					{#if form?.error}
						<p class="form-error" role="alert">{form.error}</p>
					{/if}
					<label for="comment-body">Write a comment as {data.user.display_name}</label>
					<textarea id="comment-body" name="body" rows="3" maxlength="2000" required>{form?.body ?? ''}</textarea>
					<button class="pill pill-primary">Post comment</button>
				</form>
			{:else}
				<p class="byline sign-in-note">
					<a href="/login?redirectTo=/posts/{post.id}">Sign in</a> to leave a comment.
				</p>
			{/if}
		</section>
	</div>
</div>

<style>
	/* Post pages: a cream sheet on a light green field, one readable column */
	.page {
		flex: 1; /* fill the space down to the footer (main is a flex column) */
		padding: clamp(1.5rem, 4vw, 3rem) var(--gutter) 5rem;
		background: var(--hill-far);
	}

	.column {
		width: min(var(--measure), 100%);
		margin-inline: auto;
	}

	.back {
		margin-bottom: 1.5rem;
	}

	.post {
		padding: clamp(1.5rem, 5vw, 3.5rem);
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
		box-shadow: 8px 8px 0 var(--ink);
		line-height: 1.75;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin-bottom: 1rem;
		font-size: var(--step-3);
		font-weight: 700;
	}

	.delete-form {
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 2px dashed var(--ink-soft);
	}

	/* Red button for an action that can't be undone (cream on barn red is 5.2:1) */
	.pill-danger {
		background: var(--barn);
		color: var(--cream);
		font-size: var(--step--1);
	}

	.pill-danger:hover {
		background: #962f20;
		color: var(--cream);
	}

	.comments {
		margin-top: 3.5rem;
	}

	.comments h2 {
		margin-bottom: 1.25rem;
		font-size: var(--step-2);
	}

	/* Each comment is a small speech bubble */
	.comment {
		margin-bottom: 1rem;
		padding: 0.9rem 1.25rem;
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
	}

	.comment p {
		margin: 0;
		white-space: pre-line; /* keep the line breaks the writer typed */
	}

	.comment-form {
		display: grid;
		gap: 0.5rem;
		justify-items: start;
		margin-top: 1.5rem;
	}

	.comment-form label {
		font-weight: 800;
	}

	.comment-form textarea {
		resize: vertical;
	}

	.comment .byline {
		margin-bottom: 0.25rem;
	}

	.comment .byline strong {
		color: var(--ink);
	}

	.sign-in-note {
		margin-top: 1.5rem;
		font-weight: 700;
	}
</style>
