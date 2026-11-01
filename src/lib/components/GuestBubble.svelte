<script>
	import { excerpt, formatDate, isoDate } from '#lib/format.js';

	// A guest story shown as a speech bubble, as if the guest is telling it
	let { post } = $props();

	// A few cheerful colours for the round avatar, picked by post id
	const avatarColours = ['var(--sun)', '#f2a09a', 'var(--sky)', 'var(--hill-mid)'];
	let avatarColour = $derived(avatarColours[post.id % avatarColours.length]);
</script>

<article class="story">
	<div class="bubble">
		<!-- The link covers the whole bubble (see a::after below) -->
		<h3><a href="/posts/{post.id}">{post.title}</a></h3>
		<p class="excerpt">{excerpt(post.body, 140)}</p>
	</div>
	<p class="teller">
		<span class="avatar" style="background: {avatarColour}" aria-hidden="true">{post.author_name[0]}</span>
		<span>
			<strong>{post.author_name}</strong> ·
			<time datetime={isoDate(post.created_at)}>{formatDate(post.created_at)}</time>
		</span>
	</p>
</article>

<style>
	.bubble {
		position: relative;
		padding: 1.25rem 1.5rem;
		border: var(--outline);
		border-radius: 1.75rem;
		background: var(--cream);
		color: var(--ink);
		box-shadow: 6px 6px 0 var(--ink);
		transition: translate 0.2s;
	}

	/* The tail of the speech bubble, pointing down at the avatar */
	.bubble::after {
		content: '';
		position: absolute;
		left: 1.6rem;
		bottom: -13px;
		width: 22px;
		height: 22px;
		background: var(--cream);
		border-right: var(--outline);
		border-bottom: var(--outline);
		rotate: 45deg;
	}

	.story:hover .bubble,
	.story:focus-within .bubble {
		translate: 0 -4px;
	}

	h3 {
		margin-bottom: 0.5rem;
		font-size: var(--step-1);
	}

	h3 a {
		text-decoration: none;
	}

	h3 a:hover {
		color: var(--barn);
	}

	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		border-radius: 1.75rem;
	}

	.story:hover h3 a {
		text-decoration: underline;
	}

	.excerpt {
		margin: 0;
	}

	.teller {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 1.1rem 0 0 0.6rem;
		font-size: var(--step--1);
	}

	.avatar {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.4rem;
		height: 2.4rem;
		border: var(--outline);
		border-radius: 50%;
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.1rem;
	}
</style>
