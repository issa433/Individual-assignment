<script>
	import { excerpt, formatDate, isoDate } from '#lib/format.js';

	// A host post shown as a wooden signboard on the farm.
	// `featured` makes it bigger, for the newest post.
	let { post, featured = false } = $props();

	// Tilt every other sign a little, so they look hand-placed
	let tilt = $derived(post.id % 2 === 0 ? '1deg' : '-1.2deg');
</script>

<article class="sign" class:featured style="--tilt: {tilt}">
	<p class="kicker">
		<time datetime={isoDate(post.created_at)}>{formatDate(post.created_at)}</time>
	</p>
	<!-- The link covers the whole sign (see a::after below), so the sign is easy to click -->
	<h3><a href="/posts/{post.id}">{post.title}</a></h3>
	<p class="excerpt">{excerpt(post.body, featured ? 220 : 120)}</p>
	<p class="byline">By {post.author_name}</p>
</article>

<style>
	.sign {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 2rem 1.5rem 1.25rem;
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
		box-shadow: 6px 6px 0 var(--ink);
		rotate: var(--tilt);
		transition:
			rotate 0.2s,
			translate 0.2s;
	}

	/* Two nails holding the sign up */
	.sign::before {
		content: '';
		position: absolute;
		top: 0.7rem;
		left: 1rem;
		right: 1rem;
		height: 0.5rem;
		background:
			radial-gradient(circle, var(--ink-soft) 0.22rem, transparent 0.25rem) left / 0.5rem no-repeat,
			radial-gradient(circle, var(--ink-soft) 0.22rem, transparent 0.25rem) right / 0.5rem no-repeat;
	}

	/* Straighten up and lift a little when hovered or focused */
	.sign:hover,
	.sign:focus-within {
		rotate: 0deg;
		translate: 0 -4px;
	}

	h3 {
		margin-bottom: 0.6rem;
		font-size: var(--step-1);
	}

	.featured h3 {
		font-size: var(--step-2);
	}

	h3 a {
		text-decoration: none;
	}

	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius);
	}

	.sign:hover h3 a {
		text-decoration: underline;
	}

	.excerpt {
		flex: 1;
	}

	.byline {
		margin: 0;
		font-weight: 700;
	}
</style>
