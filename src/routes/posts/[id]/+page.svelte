<script>
	import { formatDate, isoDate, paragraphs, sectionName } from '#lib/format.js';

	let { data } = $props();
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
		</article>

		<section class="comments" aria-labelledby="comments-title">
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

			<p class="byline sign-in-note">Sign in to leave a comment.</p>
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
