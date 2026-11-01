<script>
	import { page } from '$app/state';
	import WeatherIcon from './WeatherIcon.svelte';

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

<section class="weather" aria-labelledby="weather-title">
	<div class="card">
		<header>
			<h2 id="weather-title">Weather at the farm</h2>
			{#if weather}
				<p class="small">Forecast updated {updated}</p>
			{/if}
		</header>

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
							<dd>{weather.current.wind} m/s <span class="small">(gusts {weather.current.gusts})</span></dd>
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
						<span>{day.max}° <span class="small">/ {day.min}°</span></span>
					</li>
				{/each}
			</ol>
		{:else}
			<p class="nap">
				The weather report is having a nap: we couldn't reach SMHI just now. Please try again in a little
				while.
			</p>
		{/if}

		<p class="preview small">
			{#if preview}
				Showing a <strong>{preview}</strong> preview ·
				<a href={previewLink(null)} data-sveltekit-reset="false">Back to the real weather</a>
			{:else}
				Dress the sheep for:
				{#each scenes as scene, i}
					<a href={previewLink(scene)} data-sveltekit-reset="false">{scene}</a>{i < scenes.length - 1 ? ' · ' : ''}
				{/each}
			{/if}
		</p>

		<p class="credit small">
			Weather data from <a href="https://www.smhi.se/en">SMHI</a>, the Swedish Meteorological and Hydrological
			Institute.
		</p>
	</div>
</section>

<style>
	.weather {
		padding: clamp(1.5rem, 4vw, 2.5rem) var(--gutter) 0;
		background: var(--grass);
	}

	/* A little newspaper weather column, in the cartoon style */
	.card {
		display: grid;
		gap: 1rem;
		max-width: 80rem;
		margin-inline: auto;
		padding: 1.25rem 1.5rem;
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
		box-shadow: 6px 6px 0 var(--ink);
	}

	@media (min-width: 60rem) {
		.card {
			grid-template-columns: auto 1fr auto;
			align-items: center;
			column-gap: 2.5rem;
		}

		header,
		.preview,
		.credit {
			grid-column: 1 / -1;
		}
	}

	header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 1rem;
	}

	h2 {
		font-size: var(--step-1);
	}

	p {
		margin: 0;
	}

	.small {
		font-size: var(--step--1);
		color: var(--ink-soft);
	}

	/* Icon and temperature side by side; the description moves below them on narrow screens */
	.now {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
	}

	.now > div:last-child {
		flex: 1 1 13rem;
	}

	.big-icon {
		width: 4.5rem;
		flex: none;
	}

	.temperature {
		font-family: var(--font-display);
		font-size: var(--step-4);
		font-weight: 700;
		line-height: 1;
	}

	.description {
		font-family: var(--font-display);
		font-size: var(--step-1);
		font-weight: 600;
	}

	dl {
		margin: 0.25rem 0 0;
	}

	dl div {
		display: flex;
		gap: 0.4rem;
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
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.days li {
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		min-width: 4.5rem;
		padding: 0.5rem 0.6rem;
		border: 2px solid var(--ink);
		border-radius: 0.9rem;
		background: var(--wool);
		font-weight: 700;
	}

	.weekday {
		font-family: var(--font-display);
	}

	.day-icon {
		width: 2.5rem;
	}

	.nap {
		font-weight: 700;
	}
</style>
