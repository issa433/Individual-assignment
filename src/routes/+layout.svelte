<script>
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';

	// `children` is the current page, rendered inside this shared layout.
	// `data.user` comes from +layout.server.js: the signed-in user, or null.
	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Lets keyboard users jump past the header straight to the content -->
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header">
	<a class="wordmark" href="/">
		<img src={favicon} alt="" width="40" height="40" />
		Nissamåla
	</a>
	<nav aria-label="Main">
		<ul>
			<li><a class="pill" href="/#farm">From the farm</a></li>
			<li><a class="pill" href="/#guests">Guest stories</a></li>
			{#if data.user}
				<li><a class="pill pill-primary" href="/posts/new">Write a post</a></li>
				<li class="hello">Hi, {data.user.display_name}!</li>
				<li>
					<!-- Signing out is a POST form, not a link (see routes/logout) -->
					<form method="POST" action="/logout">
						<button class="pill">Sign out</button>
					</form>
				</li>
			{:else}
				<li><a class="pill pill-primary" href="/login">Sign in</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main id="main">
	{@render children()}
</main>

<footer class="site-footer">
	<!-- Wavy soil edge on top of the footer -->
	<svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
		<path d="M0 35 C300 5 560 50 860 30 C1100 15 1300 45 1440 25 V60 H0Z" />
	</svg>
	<p class="footer-name">Nissamåla gård</p>
	<p>A farm with cottages, sheep and hens in the forests outside Karlskrona, Blekinge.</p>
	<p>Written by the hosts and guests of the farm.</p>
</footer>

<style>
	/* main fills the space between header and footer, and is itself a column
	   so a page inside it can stretch down to the footer too */
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.skip-link {
		position: absolute;
		top: -10rem;
		left: var(--gutter);
		z-index: 20;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--cream);
	}

	.skip-link:focus {
		top: 0.5rem;
	}

	/* Phone: logo on top, links below */
	.site-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		padding: 0.75rem var(--gutter);
		background: var(--cream);
		border-bottom: var(--outline);
	}

	.wordmark {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	nav .pill {
		padding: 0.25rem 0.9rem;
		font-size: var(--step--1);
	}

	.hello {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
	}

	/* Bigger screens: one row */
	@media (min-width: 40rem) {
		.site-header {
			flex-direction: row;
			justify-content: space-between;
		}
	}

	.site-footer {
		position: relative;
		padding: 2rem var(--gutter) 3rem;
		background: var(--soil);
		color: var(--cream);
		font-size: var(--step--1);
	}

	.wave {
		position: absolute;
		bottom: calc(100% - 1px); /* overlap by 1px so no thin gap shows */
		left: 0;
		width: 100%;
		height: clamp(1rem, 3vw, 2.5rem);
		fill: var(--soil);
	}

	.site-footer p {
		max-width: 80rem;
		margin-inline: auto;
		margin-bottom: 0.25rem;
	}

	.footer-name {
		font-family: var(--font-display);
		font-size: var(--step-2);
		font-weight: 600;
	}
</style>
