<script>
	import { page } from '$app/state';
	import WeatherIcon from './WeatherIcon.svelte';

	// A weather sign hanging in the sky of the farm scene.
	// `weather` is the summary from lib/server/weather.js, or null if SMHI couldn't be reached.
	// `preview` is the weather being previewed with /?weather=..., or null.
	let { weather, preview } = $props();

	const scenes = ['sunny', 'cloudy', 'rainy', 'snowy'];

	// A link to preview a weather, keeping the rest of the URL (search, tab)
	function previewLink(scene) {
		const url = new URL(page.url);
		if (scene) url.searchParams.set('weather', scene);
		else url.searchParams.delete('weather');
		return url.pathname + url.search;
	}

	// "17:15", the time SMHI made the forecast, in Swedish time
	let updated = $derived(
		weather &&
			new Date(weather.updated).toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'Europe/Stockholm'
			})
	);
</script>

<section class="weather-sign" aria-labelledby="weather-title">
	<h2 id="weather-title">Weather at the farm</h2>

	{#if weather}
		<div class="now">
			<div class="big-icon"><WeatherIcon icon={weather.current.icon} /></div>
			<p class="temperature">{weather.current.temperature}°</p>
			<div>
				<p class="description">{weather.current.text}</p>
				<!-- A description list: each <dt> is a label, each <dd> its value -->
				<dl>
					<div>
						<dt>Wind</dt>
						<dd>{weather.current.wind} m/s</dd>
					</div>
					<div>
						<dt>Rain or snow</dt>
						<dd>{weather.current.precipitation} mm/h</dd>
					</div>
				</dl>
			</div>
		</div>

		<ol class="days" aria-label="The coming days">
			{#each weather.days as day (day.date)}
				<li>
					<span class="weekday">{day.weekday}</span>
					<span class="day-icon"><WeatherIcon icon={day.icon} /></span>
					<span class="visually-hidden">{day.text},</span>
					<span class="temps">{day.max}° <span class="small">/ {day.min}°</span></span>
				</li>
			{/each}
		</ol>
	{:else}
		<p class="nap">The weather report is having a nap: we couldn't reach SMHI just now. Please try again later.</p>
	{/if}

	<p class="small">
		{#if preview}
			Showing a <strong>{preview}</strong> preview ·
			<a href={previewLink(null)} data-sveltekit-reset="false">Real weather</a>
		{:else}
			Try:
			{#each scenes as scene, i}
				<a href={previewLink(scene)} data-sveltekit-reset="false">{scene}</a>{i < scenes.length - 1 ? ' · ' : ''}
			{/each}
		{/if}
	</p>

	<p class="small">
		Data from <a href="https://www.smhi.se/en">SMHI</a>{#if weather}, updated {updated}{/if}
	</p>
</section>

<style>
	/* A cream sign in the cartoon style */
	.weather-sign {
		position: relative;
		display: grid;
		gap: 0.6rem;
		width: 100%;
		padding: 1rem 1.25rem;
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
		box-shadow: 5px 5px 0 var(--ink);
	}

	/* Bigger screens: it hangs from the top of the sky on two ropes */
	@media (min-width: 48rem) {
		.weather-sign {
			width: clamp(20rem, 28vw, 24rem);
			transform-origin: 50% -20rem; /* swing around a point high up the ropes */
		}

		.weather-sign::before,
		.weather-sign::after {
			content: '';
			position: absolute;
			bottom: 100%;
			width: 3px;
			height: 100vh; /* long enough to reach the top; the hero cuts off the rest */
			background: var(--ink);
		}

		.weather-sign::before {
			left: 20%;
		}

		.weather-sign::after {
			right: 20%;
		}
	}

	@media (min-width: 48rem) and (prefers-reduced-motion: no-preference) {
		.weather-sign {
			animation: sway 5s ease-in-out infinite alternate;
		}
	}

	@keyframes sway {
		from {
			rotate: -1deg;
		}
		to {
			rotate: 1deg;
		}
	}

	h2 {
		font-size: var(--step-0);
	}

	p {
		margin: 0;
	}

	.small {
		font-size: var(--step--1);
		color: var(--ink-soft);
	}

	.now {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.big-icon {
		width: 3.25rem;
		flex: none;
	}

	.temperature {
		font-family: var(--font-display);
		font-size: var(--step-3);
		font-weight: 700;
		line-height: 1;
	}

	.description {
		font-family: var(--font-display);
		font-weight: 600;
		line-height: 1.2;
	}

	dl {
		margin: 0.15rem 0 0;
		font-size: var(--step--1);
		line-height: 1.4;
	}

	dl div {
		display: flex;
		gap: 0.3rem;
	}

	dt {
		font-weight: 800;
	}

	dt::after {
		content: ':';
	}

	dd {
		margin: 0;
	}

	.days {
		display: flex;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.days li {
		display: grid;
		justify-items: center;
		flex: 1 1 0; /* the days share the width evenly */
		min-width: 0;
		padding: 0.35rem 0.25rem;
		border: 2px solid var(--ink);
		border-radius: 0.8rem;
		background: var(--wool);
		font-size: var(--step--1);
		font-weight: 700;
	}

	.weekday {
		font-family: var(--font-display);
	}

	.day-icon {
		width: 2rem;
	}

	.temps {
		white-space: nowrap; /* keep "10° / 2°" on one line */
	}

	.nap {
		font-weight: 700;
	}

	/* Phones: a more compact sign, so the sheep still fits on the first screen */
	@media (max-width: 30rem) {
		.weather-sign {
			gap: 0.4rem;
			padding: 0.75rem 1rem;
		}

		.days li {
			grid-template-columns: auto auto;
			column-gap: 0.25rem;
			align-items: center;
		}

		.day-icon {
			width: 1.5rem;
		}

		.temps {
			grid-column: 1 / -1;
		}
	}
</style>
