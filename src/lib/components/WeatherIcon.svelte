<script>
	// A small cartoon weather picture. `icon` is one of:
	// clear, partly, cloudy, fog, rain, sleet, snow, thunder
	let { icon } = $props();

	// The cloud is built like the sheep's wool: dark circles first, white circles on top
	const cloud = [
		[17, 28, 7],
		[26, 22, 10],
		[35, 28, 7]
	];
</script>

<svg class="weather-icon" viewBox="0 0 48 48" aria-hidden="true">
	{#if icon === 'clear' || icon === 'partly'}
		<!-- The sun: small and in the corner when it's partly cloudy -->
		<g transform={icon === 'partly' ? 'translate(-6 -6) scale(0.8)' : ''}>
			{#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
				<line x1="24" y1="7" x2="24" y2="11" transform="rotate({angle} 24 24)" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" />
			{/each}
			<circle cx="24" cy="24" r="9" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5" />
		</g>
	{/if}

	{#if icon !== 'clear'}
		<g transform={icon === 'partly' ? 'translate(5 6)' : ''}>
			{#each cloud as [cx, cy, r]}
				<circle {cx} {cy} r={r + 2.5} fill="var(--ink)" />
			{/each}
			<rect x="14.5" y="25.5" width="23" height="12.5" rx="5" fill="var(--ink)" />
			{#each cloud as [cx, cy, r]}
				<circle {cx} {cy} {r} fill="var(--wool)" />
			{/each}
			<rect x="17" y="28" width="18" height="7.5" rx="3" fill="var(--wool)" />
		</g>
	{/if}

	{#if icon === 'rain' || icon === 'sleet'}
		<g stroke="#3b6fb6" stroke-width="2.5" stroke-linecap="round">
			<line x1="18" y1="40" x2="16" y2="45" />
			<line x1="30" y1="40" x2="28" y2="45" />
			{#if icon === 'rain'}<line x1="24" y1="40" x2="22" y2="45" />{/if}
		</g>
	{/if}

	{#if icon === 'snow' || icon === 'sleet'}
		<g fill="var(--wool)" stroke="var(--ink)" stroke-width="1.5">
			<circle cx="24" cy="43" r="2.5" />
			{#if icon === 'snow'}
				<circle cx="16" cy="42" r="2.5" />
				<circle cx="32" cy="42" r="2.5" />
			{/if}
		</g>
	{/if}

	{#if icon === 'thunder'}
		<path d="M26 36 L21 43 H26 L23 48 L31 40 H26 L29 36 Z" fill="var(--sun)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round" />
	{/if}

	{#if icon === 'fog'}
		<g stroke="var(--ink-soft)" stroke-width="2.5" stroke-linecap="round">
			<line x1="12" y1="41" x2="36" y2="41" />
			<line x1="16" y1="46" x2="32" y2="46" />
		</g>
	{/if}
</svg>

<style>
	.weather-icon {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
</style>
