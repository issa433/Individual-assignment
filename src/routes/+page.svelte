<script>
	import FarmScene from '#lib/components/FarmScene.svelte';
	import PostSign from '#lib/components/PostSign.svelte';
	import GuestBubble from '#lib/components/GuestBubble.svelte';

	// `data` comes from the load function in +page.server.js
	let { data } = $props();
</script>

<svelte:head>
	<title>Nissamåla Farm</title>
	<meta
		name="description"
		content="News from the hosts and stories from the guests of Nissamåla gård, a farm outside Karlskrona."
	/>
</svelte:head>

<FarmScene>
	<div class="intro">
		<div>
			<p class="kicker">Nissamåla gård · outside Karlskrona</p>
			<h1 id="hero-title">Nissamåla</h1>
			<p class="lead">
				News from the farm and stories from our guests: sheep, apples, forest walks and slow days.
			</p>
			<p class="actions">
				<a class="pill" href="#farm">From the farm</a>
				<a class="pill" href="#guests">Guest stories</a>
			</p>
		</div>

		<figure class="polaroid">
			<img
				src="/images/sheep-meadow.avif"
				alt="A flock of sheep walking in single file through tall summer grass, with a line of trees behind them."
				width="720"
				height="960"
			/>
			<figcaption>The real flock!</figcaption>
		</figure>
	</div>
</FarmScene>

<section id="farm" class="farm" aria-labelledby="farm-title">
	<div class="wrap">
		<header class="section-head">
			<h2 id="farm-title">From the farm</h2>
			<p>News, practical notes and what's happening this season, from the hosts.</p>
		</header>

		<div class="signs">
			{#each data.hostPosts as post, i (post.id)}
				<PostSign {post} featured={i === 0} />
			{:else}
				<p>No news from the farm yet.</p>
			{/each}
		</div>
	</div>
</section>

<section id="guests" class="guests" aria-labelledby="guests-title">
	<!-- A wavy hilltop where the light green meets the dark green -->
	<svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
		<path d="M0 30 C240 0 480 0 720 25 C960 50 1200 55 1440 20 V60 H0Z" />
	</svg>

	<div class="wrap">
		<header class="section-head">
			<h2 id="guests-title">Guest stories</h2>
			<p>Walks, finds and slow days, written by the people who stayed with us.</p>
		</header>

		<div class="bubbles">
			{#each data.guestPosts as post (post.id)}
				<GuestBubble {post} />
			{:else}
				<p>No guest stories yet.</p>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ---------- Hero text ---------- */

	.intro {
		display: grid;
		gap: var(--gutter);
		align-items: center;
	}

	@media (min-width: 48rem) {
		.intro {
			grid-template-columns: 1fr auto;
		}
	}

	h1 {
		font-size: clamp(3.5rem, 2rem + 8vw, 8rem);
		font-weight: 700;
		line-height: 0.95;
		color: var(--ink);
	}

	.lead {
		max-width: 34ch;
		margin-top: 1rem;
		font-size: var(--step-1);
		line-height: 1.45;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	/* The real photo, like a polaroid pinned in the sky */
	.polaroid {
		display: none;
		width: clamp(11rem, 18vw, 15rem);
		margin: 0;
		padding: 0.6rem 0.6rem 0;
		border: var(--outline);
		background: var(--wool);
		box-shadow: 6px 6px 0 var(--ink);
		rotate: 4deg;
	}

	@media (min-width: 48rem) {
		.polaroid {
			display: block;
		}
	}

	.polaroid img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.polaroid figcaption {
		padding: 0.5rem 0 0.6rem;
		font-family: var(--font-display);
		font-weight: 500;
		text-align: center;
	}

	/* ---------- Sections ---------- */

	.wrap {
		max-width: 80rem;
		margin-inline: auto;
		padding: clamp(2.5rem, 6vw, 5rem) var(--gutter) clamp(4rem, 8vw, 6rem);
	}

	.section-head {
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	.section-head h2 {
		font-size: var(--step-3);
		font-weight: 700;
	}

	.section-head p {
		max-width: 40ch;
		margin: 0.5rem 0 0;
	}

	.farm {
		background: var(--grass);
	}

	.signs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
		gap: 2rem;
	}

	/* The newest post gets a double-width sign on bigger screens */
	@media (min-width: 48rem) {
		.signs :global(.featured) {
			grid-column: span 2;
		}
	}

	.guests {
		position: relative;
		background: var(--meadow);
		color: var(--cream);
	}

	.wave {
		position: absolute;
		bottom: calc(100% - 1px); /* overlap by 1px so no thin gap shows */
		left: 0;
		width: 100%;
		height: clamp(1.5rem, 4vw, 3.5rem);
		fill: var(--meadow);
	}

	.guests :focus-visible {
		outline-color: var(--sun);
	}

	.bubbles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		gap: 2.5rem 2rem;
	}
</style>
