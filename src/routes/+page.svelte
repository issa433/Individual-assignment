<script>
	import FarmScene from '#lib/components/FarmScene.svelte';
	import PostSign from '#lib/components/PostSign.svelte';
	import GuestBubble from '#lib/components/GuestBubble.svelte';

	// `data` comes from the load function in +page.server.js
	let { data } = $props();

	const tabs = [
		{ show: 'all', label: 'All' },
		{ show: 'farm', label: 'From the farm' },
		{ show: 'guests', label: 'Guest stories' }
	];

	// The link for a tab keeps the current search, e.g. /?q=apple&show=farm
	function tabLink(show) {
		const params = new URLSearchParams();
		if (data.search) params.set('q', data.search);
		if (show !== 'all') params.set('show', show);
		return params.size > 0 ? `/?${params}` : '/';
	}

	let resultCount = $derived(data.hostPosts.length + data.guestPosts.length);
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
				<a class="pill" href="/#farm">From the farm</a>
				<a class="pill" href="/#guests">Guest stories</a>
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

<section class="finder" aria-label="Find a story">
	<!-- A normal GET form: submitting it goes to /?q=..., so the search is part of the URL.
	     data-sveltekit-reset="false" keeps the scroll position and focus instead of jumping to the top. -->
	<form method="GET" action="/" role="search" data-sveltekit-reset="false">
		<label for="search" class="visually-hidden">Search stories</label>
		<input
			id="search"
			type="search"
			name="q"
			value={data.search}
			placeholder="Search stories, e.g. apples"
			maxlength="100"
		/>
		<!-- Keep the chosen tab when searching -->
		{#if data.show !== 'all'}
			<input type="hidden" name="show" value={data.show} />
		{/if}
		<button class="pill pill-primary">Search</button>
	</form>

	<!-- aria-current tells screen readers which tab is chosen; CSS uses it to colour that tab -->
	<nav class="tabs" aria-label="Show stories from">
		{#each tabs as tab}
			<a
				class="pill"
				href={tabLink(tab.show)}
				aria-current={data.show === tab.show ? 'page' : undefined}
				data-sveltekit-reset="false"
			>
				{tab.label}
			</a>
		{/each}
	</nav>

	<!-- aria-live reads the result count aloud to screen reader users when it changes -->
	<p class="result-count" aria-live="polite">
		{#if data.search}
			{resultCount}
			{resultCount === 1 ? 'story' : 'stories'} found for “{data.search}” ·
			<a href={data.show === 'all' ? '/' : `/?show=${data.show}`} data-sveltekit-reset="false">Clear search</a>
		{/if}
	</p>
</section>

{#if data.show !== 'guests'}
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
					<p>{data.search ? 'No news from the farm matches your search.' : 'No news from the farm yet.'}</p>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.show !== 'farm'}
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
					<p>{data.search ? 'No guest stories match your search.' : 'No guest stories yet.'}</p>
				{/each}
			</div>
		</div>
	</section>
{/if}

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

	/* ---------- Search and tabs ---------- */

	.finder {
		display: grid;
		gap: 1rem;
		padding: clamp(1.5rem, 4vw, 2.5rem) var(--gutter) 0;
		background: var(--grass);
	}

	.finder > * {
		width: 100%;
		max-width: 80rem;
		margin-inline: auto;
	}

	form {
		display: flex;
		gap: 0.6rem;
	}

	form input {
		max-width: 30rem;
		border-radius: 999px;
		padding-inline: 1.1rem;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.tabs .pill {
		font-size: var(--step--1);
	}

	/* The chosen tab is sunny yellow */
	.tabs [aria-current='page'] {
		background: var(--sun);
	}

	.result-count {
		margin: 0;
		font-weight: 700;
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

	/* "No stories..." messages use the full width instead of one grid column */
	.signs > p,
	.bubbles > p {
		grid-column: 1 / -1;
		font-weight: 700;
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
