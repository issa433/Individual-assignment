<script>
	// `page` holds info about the current page, including the error status and message
	import { page } from '$app/state';
	import Sheep from '#lib/components/Sheep.svelte';
</script>

<svelte:head>
	<title>{page.status} · Nissamåla Farm</title>
</svelte:head>

<section class="error">
	<div class="lost-sheep">
		<Sheep />
	</div>
	<div>
		<p class="kicker">Error {page.status}</p>
		<h1>{page.status === 404 ? 'Baa? This page has wandered off.' : 'Something went wrong.'}</h1>
		<p>{page.error?.message}</p>
		<a class="pill" href="/">Back to the farm</a>
	</div>
</section>

<style>
	.error {
		display: grid;
		gap: 2rem;
		align-items: center;
		max-width: 60rem;
		margin: 0 auto;
		padding: clamp(3rem, 10vh, 7rem) var(--gutter);
	}

	@media (min-width: 40rem) {
		.error {
			grid-template-columns: 14rem 1fr;
		}
	}

	.lost-sheep {
		width: 12rem;
		rotate: -8deg; /* a slightly confused tilt */
	}

	h1 {
		margin-bottom: 1rem;
		font-size: var(--step-3);
		font-weight: 700;
	}
</style>
