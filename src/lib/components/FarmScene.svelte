<script>
	import Sheep from './Sheep.svelte';

	// The homepage hero: a 2D farm landscape with a sheep you can talk to.
	// `children` is the text that the page puts on top of the sky.
	// `scene` follows the real weather: 'sunny', 'cloudy', 'rainy' or 'snowy'.
	let { children, scene = 'sunny' } = $props();

	// What the sheep says, depending on the weather
	const phrasesByScene = {
		sunny: [
			'Baa! Perfect weather for lounging.',
			'Apple juice and sunshine. Living the dream.',
			"Don't forget sunscreen. Wool burns too!",
			'Welcome to Nissamåla!'
		],
		cloudy: [
			'A grey day, but the grass is still tasty.',
			'Clouds are just sheep in the sky.',
			'Perfect weather for a forest walk.',
			'Welcome to Nissamåla!'
		],
		rainy: [
			'Good thing I brought my umbrella!',
			'Wet wool smells... interesting.',
			'Puddles! My favourite.',
			'Welcome to Nissamåla! Mind the mud.'
		],
		snowy: [
			'Brr! Good thing I have my jacket.',
			"Meet my friend. He's very cool.",
			'Snow day! Who wants hot chocolate?',
			'Welcome to winter at Nissamåla!'
		]
	};

	let phrases = $derived(phrasesByScene[scene]);

	// -1 means the sheep hasn't said anything yet
	let phraseIndex = $state(-1);

	// Clicking the sheep shows the next phrase (and starts over after the last one)
	function talk() {
		phraseIndex = (phraseIndex + 1) % phrases.length;
	}

	// More clouds when it isn't sunny
	let cloudCount = $derived(scene === 'sunny' ? 3 : 6);

	// Positions for raindrops and snowflakes. They are calculated from the number i instead of
	// Math.random(), so the server and the browser draw them in exactly the same places.
	const drops = Array.from({ length: 50 }, (_, i) => ({
		x: (i * 37) % 100,
		y: (i * 53) % 100,
		delay: -((i * 0.137) % 1).toFixed(2),
		duration: (0.7 + (i % 5) * 0.08).toFixed(2)
	}));
</script>

<section class="hero" aria-labelledby="hero-title">
	<!-- Decorative clouds drifting across the sky -->
	<div class="clouds" aria-hidden="true">
		{#each { length: cloudCount }, i}
			{@const n = i + 1}
			<svg class="cloud cloud-{n}" viewBox="0 0 120 60">
				<circle cx="35" cy="38" r="20" />
				<circle cx="60" cy="28" r="26" />
				<circle cx="88" cy="38" r="20" />
				<rect x="35" y="30" width="55" height="28" rx="14" />
			</svg>
		{/each}
	</div>

	<div class="hero-content">
		{@render children()}
	</div>

	<div class="landscape">
		{#if scene === 'sunny'}
			<div class="sun" aria-hidden="true"></div>
		{/if}

		<!-- Three hills. preserveAspectRatio="none" lets them stretch to any screen width -->
		<svg class="hills" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
			<path fill="var(--hill-far)" d="M0 150 C200 60 420 60 640 130 C860 200 1080 70 1440 110 V320 H0Z" />
			<path fill="var(--hill-mid)" d="M0 215 C260 145 520 170 760 200 C1000 230 1200 150 1440 170 V320 H0Z" />
			<path fill="var(--grass)" d="M0 275 C300 235 600 255 900 268 C1150 280 1300 245 1440 255 V320 H0Z" />
		</svg>

		<!-- A red Swedish cottage with white trim -->
		<svg class="cottage" viewBox="0 0 140 110" aria-hidden="true">
			<g class="smoke" fill="var(--wool)">
				<circle cx="101" cy="8" r="5" />
				<circle cx="106" cy="0" r="4" />
			</g>
			<g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round">
				<rect x="94" y="14" width="13" height="26" fill="#7a3b2e" />
				<rect x="20" y="46" width="100" height="58" fill="var(--barn)" />
				<polygon points="8,50 70,10 132,50" fill="#4a423c" />
				<rect x="32" y="60" width="24" height="20" fill="#fff1c1" />
				<rect x="80" y="66" width="22" height="38" fill="var(--cream)" />
			</g>
			<path d="M44 60 V80 M32 70 H56" stroke="var(--cream)" stroke-width="3" />
		</svg>

		<!-- A little wooden fence -->
		<svg class="fence" viewBox="0 0 300 70" aria-hidden="true">
			<g fill="var(--cream)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round">
				<rect x="4" y="24" width="292" height="10" rx="4" />
				<rect x="4" y="46" width="292" height="10" rx="4" />
				{#each [10, 70, 130, 190, 250] as x}
					<path d="M{x} 66 V14 L{x + 10} 4 L{x + 20} 14 V66 Z" />
				{/each}
			</g>
		</svg>

		{#if scene === 'sunny'}
			<!-- A little table with a glass of the farm's own apple juice -->
			<svg class="drink" viewBox="0 0 60 90" aria-hidden="true">
				<g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round">
					<path d="M36 14 L44 -8" stroke="var(--barn)" stroke-linecap="round" />
					<path d="M18 10 H42 L39 38 H21 Z" fill="var(--wool)" />
					<path d="M19.6 20 H40.4 L39 38 H21 Z" fill="#f2b134" stroke-width="2" />
					<circle cx="19" cy="11" r="5" fill="var(--hill-mid)" stroke-width="2" />
					<rect x="4" y="38" width="52" height="7" rx="3.5" fill="var(--soil)" />
					<rect x="27" y="45" width="6" height="36" fill="var(--soil)" />
					<rect x="16" y="80" width="28" height="6" rx="3" fill="var(--soil)" />
				</g>
			</svg>
		{/if}

		{#if scene === 'snowy'}
			<!-- The sheep's friend: a snowman with a carrot nose and a scarf -->
			<svg class="snowman" viewBox="0 0 100 150" aria-hidden="true">
				<g stroke="var(--soil)" stroke-width="4" stroke-linecap="round" fill="none">
					<path d="M30 66 L8 48 M16 55 L10 62 M70 66 L92 46 M84 53 L92 58" />
				</g>
				<g fill="var(--wool)" stroke="var(--ink)" stroke-width="4">
					<circle cx="50" cy="115" r="32" />
					<circle cx="50" cy="68" r="24" />
					<circle cx="50" cy="30" r="18" />
				</g>
				<g fill="var(--ink)">
					<circle cx="44" cy="26" r="2.5" />
					<circle cx="56" cy="26" r="2.5" />
					<circle cx="50" cy="62" r="2.5" />
					<circle cx="50" cy="74" r="2.5" />
					<circle cx="50" cy="106" r="2.5" />
				</g>
				<path d="M50 32 L66 36 L50 38 Z" fill="#f08c2a" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" />
				<g fill="var(--barn)" stroke="var(--ink)" stroke-width="2.5">
					<rect x="56" y="46" width="9" height="20" rx="3" />
					<rect x="33" y="43" width="34" height="9" rx="4.5" />
				</g>
			</svg>
		{/if}

		<!-- The sheep is a real button, so it works with keyboard and screen readers too -->
		<div class="sheep-spot">
			{#if scene === 'sunny'}
				<!-- A striped sun chair behind the sheep (same size and coordinates as the sheep drawing) -->
				<svg class="chair" viewBox="0 0 220 180" aria-hidden="true">
					<defs>
						<pattern id="chair-stripes" width="18" height="18" patternUnits="userSpaceOnUse">
							<rect width="9" height="18" fill="var(--barn)" />
							<rect x="9" width="9" height="18" fill="var(--cream)" />
						</pattern>
					</defs>
					<g stroke="var(--ink)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
						<path d="M122 12 L206 2 L214 148 L130 156 Z" fill="url(#chair-stripes)" />
						<path d="M118 6 L128 166 L112 180 M210 -4 L216 150 L226 180" fill="none" stroke="var(--soil)" stroke-width="6" />
					</g>
				</svg>
			{/if}

			<p class="bubble" class:visible={phraseIndex >= 0} aria-live="polite">
				{phraseIndex >= 0 ? phrases[phraseIndex] : ''}
			</p>
			<button class="sheep-button" onclick={talk} aria-label="Say hello to the sheep">
				<!-- {#key} re-creates the element when phraseIndex changes, which restarts the jump -->
				{#key phraseIndex}
					<span class="jumper" class:jump={phraseIndex >= 0}><Sheep outfit={scene} /></span>
				{/key}
			</button>
		</div>
	</div>

	<!-- Falling rain or snow over the whole scene (decorative, and clicks go straight through it) -->
	{#if scene === 'rainy' || scene === 'snowy'}
		<div class="weather-fall {scene}" aria-hidden="true">
			{#each drops as drop}
				<span
					class="drop"
					style="--x: {drop.x}%; --y: {drop.y}%; --delay: {drop.delay}s; --duration: {drop.duration}s"
				></span>
			{/each}
		</div>
	{/if}
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		background: var(--sky);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		padding: clamp(2rem, 6vw, 5rem) var(--gutter) 0;
		max-width: 80rem;
		margin-inline: auto;
	}

	/* ---------- Clouds ---------- */

	/* --cloud is set by the page for each weather (grey when it rains), white by default */
	.cloud {
		position: absolute;
		fill: var(--cloud, var(--wool));
	}

	.cloud-1 {
		top: 6%;
		width: 9rem;
		left: 8%;
	}

	.cloud-2 {
		top: 18%;
		width: 6rem;
		left: 55%;
		opacity: 0.85;
	}

	.cloud-3 {
		top: 34%;
		width: 7rem;
		left: 80%;
	}

	/* Extra clouds for cloudy, rainy and snowy weather */
	.cloud-4 {
		top: 2%;
		width: 11rem;
		left: 35%;
	}

	.cloud-5 {
		top: 26%;
		width: 10rem;
		left: 65%;
	}

	.cloud-6 {
		top: 44%;
		width: 8rem;
		left: 20%;
	}

	/* ---------- The landscape strip ---------- */

	.landscape {
		position: relative;
		height: clamp(15rem, 34vw, 28rem);
		margin-top: -2rem;
	}

	/* The sun is placed before the hills in the HTML, so the far hill covers its lower half */
	.sun {
		position: absolute;
		top: 20%;
		right: 20%;
		width: clamp(4rem, 8vw, 7rem);
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--sun);
		box-shadow: 0 0 0 clamp(0.6rem, 1.2vw, 1rem) rgb(255 209 102 / 0.35);
	}

	/* 1px taller than the landscape, so no thin gap shows above the section below */
	.hills {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100% + 1px);
	}

	.cottage {
		position: absolute;
		left: 12%;
		bottom: 50%;
		width: clamp(5.5rem, 11vw, 10rem);
	}

	.fence {
		position: absolute;
		left: -1%;
		bottom: 6%;
		width: clamp(9rem, 22vw, 19rem);
	}

	/* ---------- Weather extras ---------- */

	.drink {
		position: absolute;
		left: 48%;
		bottom: 9%;
		width: clamp(2.5rem, 4.5vw, 4rem);
	}

	.snowman {
		position: absolute;
		right: 8%;
		bottom: 7%;
		width: clamp(4rem, 8vw, 7rem);
	}

	/* Phones: move the juice a bit to the left (the sheep moves too, see .sheep-spot below) */
	@media (max-width: 40rem) {
		.drink {
			left: 26%;
		}

		.snowman {
			right: 3%;
		}
	}

	/* The chair covers exactly the same box as the sheep, behind it */
	.chair {
		position: absolute;
		inset: 0;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* The layer with falling rain or snow covers the whole hero */
	.weather-fall {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none; /* clicks go through to the sheep and the links */
	}

	.drop {
		position: absolute;
		left: var(--x);
		top: var(--y);
	}

	.rainy .drop {
		width: 2px;
		height: 1.1rem;
		border-radius: 2px;
		background: rgb(59 111 182 / 0.6);
		rotate: 10deg;
	}

	.snowy .drop {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--wool);
		box-shadow: 0 0 0 1px rgb(51 41 31 / 0.25);
	}

	/* ---------- The sheep and its speech bubble ---------- */

	.sheep-spot {
		position: absolute;
		left: 56%;
		bottom: 8%;
		width: clamp(8rem, 17vw, 14rem);
	}

	/* Phones: more to the left, so there's room for the snowman */
	@media (max-width: 40rem) {
		.sheep-spot {
			left: 40%;
		}
	}

	.sheep-button {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}

	.bubble {
		position: absolute;
		bottom: 100%;
		left: -10%;
		width: max-content;
		max-width: 14rem;
		margin: 0;
		padding: 0.6rem 1rem;
		border: var(--outline);
		border-radius: var(--radius);
		background: var(--cream);
		font-family: var(--font-display);
		font-weight: 500;
		line-height: 1.3;
		opacity: 0;
		scale: 0.6;
		transform-origin: bottom left;
		transition:
			opacity 0.2s,
			scale 0.2s;
	}

	.bubble.visible {
		opacity: 1;
		scale: 1;
	}

	/* The little tail pointing down at the sheep */
	.bubble::after {
		content: '';
		position: absolute;
		left: 2rem;
		bottom: -11px;
		width: 18px;
		height: 18px;
		background: var(--cream);
		border-right: var(--outline);
		border-bottom: var(--outline);
		rotate: 45deg;
	}

	.jumper {
		display: block;
	}

	/* ---------- Motion (skipped if the user prefers reduced motion) ---------- */

	@media (prefers-reduced-motion: no-preference) {
		/* Moving clouds all start from the left edge. The negative delays start
		   each animation part-way through, so the clouds are spread across the sky. */
		.cloud {
			left: 0;
		}

		.cloud-1 {
			animation: drift 70s linear infinite -20s;
		}

		.cloud-2 {
			animation: drift 95s linear infinite -40s;
		}

		.cloud-3 {
			animation: drift 80s linear infinite -60s;
		}

		.cloud-4 {
			animation: drift 110s linear infinite -10s;
		}

		.cloud-5 {
			animation: drift 90s linear infinite -70s;
		}

		.cloud-6 {
			animation: drift 100s linear infinite -45s;
		}

		/* Each drop starts above the top and falls past the bottom. The negative delays
		   start them part-way, so the sky is full of drops right away. */
		.drop {
			top: -1.5rem;
			animation: fall var(--duration) linear var(--delay) infinite;
		}

		/* Snow falls 12 times slower and sways from side to side */
		.snowy .drop {
			animation-name: snowfall;
			animation-duration: calc(var(--duration) * 12);
			animation-delay: calc(var(--delay) * 12);
		}

		.smoke circle {
			animation: puff 3s ease-out infinite;
		}

		.smoke circle:nth-child(2) {
			animation-delay: -1.5s;
		}

		.jump {
			animation: jump 0.5s ease-out;
		}

		.sheep-button:hover .jumper {
			rotate: -4deg;
			transition: rotate 0.2s;
		}
	}

	/* Clouds float from the left edge to the right edge, then start over */
	@keyframes drift {
		from {
			translate: -30vw 0;
		}
		to {
			translate: 110vw 0;
		}
	}

	@keyframes puff {
		from {
			opacity: 0.9;
			translate: 0 6px;
		}
		to {
			opacity: 0;
			translate: 6px -14px;
		}
	}

	@keyframes fall {
		to {
			translate: -4rem 60rem;
		}
	}

	@keyframes snowfall {
		33% {
			translate: 1rem 20rem;
		}
		66% {
			translate: -1rem 40rem;
		}
		to {
			translate: 0.5rem 60rem;
		}
	}

	@keyframes jump {
		40% {
			translate: 0 -18%;
		}
	}
</style>
