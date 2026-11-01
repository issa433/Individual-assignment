<script>
	import Sheep from './Sheep.svelte';

	// The homepage hero: a 2D farm landscape with a sheep you can talk to.
	// `children` is the text that the page puts on top of the sky.
	let { children } = $props();

	const phrases = [
		'Baa! Welcome to Nissamåla!',
		'Have you tried the apples yet?',
		'Mind the wet path by the stream.',
		'I like guests. And grass. Mostly grass.',
		'Baa-ck soon!'
	];

	// -1 means the sheep hasn't said anything yet
	let phraseIndex = $state(-1);

	// Clicking the sheep shows the next phrase (and starts over after the last one)
	function talk() {
		phraseIndex = (phraseIndex + 1) % phrases.length;
	}
</script>

<section class="hero" aria-labelledby="hero-title">
	<!-- Decorative clouds drifting across the sky -->
	<div class="clouds" aria-hidden="true">
		{#each [1, 2, 3] as n}
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
		<div class="sun" aria-hidden="true"></div>

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

		<!-- The sheep is a real button, so it works with keyboard and screen readers too -->
		<div class="sheep-spot">
			<p class="bubble" class:visible={phraseIndex >= 0} aria-live="polite">
				{phraseIndex >= 0 ? phrases[phraseIndex] : ''}
			</p>
			<button class="sheep-button" onclick={talk} aria-label="Say hello to the sheep">
				<!-- {#key} re-creates the element when phraseIndex changes, which restarts the jump -->
				{#key phraseIndex}
					<span class="jumper" class:jump={phraseIndex >= 0}><Sheep /></span>
				{/key}
			</button>
		</div>
	</div>
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

	.cloud {
		position: absolute;
		fill: var(--wool);
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

	.hills {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
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

	/* ---------- The sheep and its speech bubble ---------- */

	.sheep-spot {
		position: absolute;
		left: 56%;
		bottom: 8%;
		width: clamp(8rem, 17vw, 14rem);
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

	@keyframes jump {
		40% {
			translate: 0 -18%;
		}
	}
</style>
