<script>
	// A round cartoon sheep, drawn with plain SVG shapes. It blinks and gently bobs.
	//
	// The outline trick: every wool circle is drawn twice. First a bit bigger in dark ink,
	// then in white on top. Where circles overlap, the white covers the dark,
	// so only the outer edge of the fluffy shape gets an outline.

	// [x, y, radius] for each puff of wool
	const wool = [
		[95, 78, 26],
		[125, 68, 28],
		[156, 78, 26],
		[174, 102, 22],
		[161, 126, 24],
		[128, 133, 26],
		[96, 127, 24],
		[82, 104, 22],
		[125, 102, 38],
		[194, 96, 10] // the tail
	];

	// The tuft of wool on top of the head
	const tuft = [
		[50, 70, 10],
		[62, 64, 11],
		[75, 70, 10]
	];
</script>

<svg class="sheep" viewBox="0 0 220 180" aria-hidden="true">
	<!-- Legs, drawn first so the body covers their tops -->
	<g fill="var(--ink)">
		<rect x="92" y="125" width="13" height="44" rx="6.5" />
		<rect x="114" y="128" width="13" height="42" rx="6.5" />
		<rect x="142" y="128" width="13" height="42" rx="6.5" />
		<rect x="162" y="125" width="13" height="44" rx="6.5" />
	</g>

	<!-- Wool: dark outline circles first, then white circles on top -->
	<g fill="var(--ink)">
		{#each wool as [cx, cy, r]}
			<circle {cx} {cy} r={r + 4} />
		{/each}
	</g>
	<g fill="var(--wool)">
		{#each wool as [cx, cy, r]}
			<circle {cx} {cy} {r} />
		{/each}
	</g>

	<!-- Head -->
	<g stroke="var(--ink)" stroke-width="4">
		<ellipse cx="32" cy="94" rx="16" ry="8" fill="#5b4d47" transform="rotate(-20 32 94)" />
		<ellipse cx="94" cy="90" rx="16" ry="8" fill="#5b4d47" transform="rotate(20 94 90)" />
		<ellipse cx="62" cy="102" rx="28" ry="31" fill="#5b4d47" />
	</g>

	<g fill="var(--ink)">
		{#each tuft as [cx, cy, r]}
			<circle {cx} {cy} r={r + 4} />
		{/each}
	</g>
	<g fill="var(--wool)">
		{#each tuft as [cx, cy, r]}
			<circle {cx} {cy} {r} />
		{/each}
	</g>

	<!-- Eyes (this group is squashed for a moment to blink) -->
	<g class="eyes">
		<circle cx="51" cy="100" r="7.5" fill="var(--wool)" />
		<circle cx="73" cy="100" r="7.5" fill="var(--wool)" />
		<circle cx="52.5" cy="101" r="4" fill="var(--ink)" />
		<circle cx="74.5" cy="101" r="4" fill="var(--ink)" />
		<circle cx="54" cy="99.5" r="1.4" fill="var(--wool)" />
		<circle cx="76" cy="99.5" r="1.4" fill="var(--wool)" />
	</g>

	<!-- Rosy cheeks and a small smile -->
	<ellipse cx="42" cy="114" rx="5.5" ry="3.5" fill="#f2a09a" />
	<ellipse cx="82" cy="114" rx="5.5" ry="3.5" fill="#f2a09a" />
	<path d="M55 116 q7 6 14 0" fill="none" stroke="var(--cream)" stroke-width="2.5" stroke-linecap="round" />
</svg>

<style>
	.sheep {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* transform-box makes the eyes squash around their own centre */
	.eyes {
		transform-box: fill-box;
		transform-origin: center;
	}

	@media (prefers-reduced-motion: no-preference) {
		.sheep {
			animation: bob 2.4s ease-in-out infinite;
		}

		.eyes {
			animation: blink 5s infinite;
		}
	}

	@keyframes bob {
		50% {
			translate: 0 -4%;
		}
	}

	/* Eyes open almost all the time, then close and open quickly */
	@keyframes blink {
		0%,
		92%,
		100% {
			scale: 1 1;
		}
		95% {
			scale: 1 0.1;
		}
	}
</style>
