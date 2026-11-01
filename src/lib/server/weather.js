import { FARM_LOCATION } from '#lib/config.js';

// The weather at the farm, from SMHI's open forecast API (snow1g, version 1).
// It runs on the server only, so visitors' browsers never talk to SMHI directly.

const SMHI_URL =
	'https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point' +
	`/lon/${FARM_LOCATION.lon}/lat/${FARM_LOCATION.lat}/data.json`;

const CACHE_MINUTES = 30;
const TIME_ZONE = 'Europe/Stockholm';

// What each SMHI `symbol_code` (1–27) means, from SMHI's documentation.
// `icon` picks the little picture, `scene` picks how the farm and the sheep look.
const SYMBOLS = {
	1: { text: 'Clear sky', icon: 'clear', scene: 'sunny' },
	2: { text: 'Nearly clear sky', icon: 'clear', scene: 'sunny' },
	3: { text: 'Variable cloudiness', icon: 'partly', scene: 'sunny' },
	4: { text: 'Half clear sky', icon: 'partly', scene: 'cloudy' },
	5: { text: 'Cloudy sky', icon: 'cloudy', scene: 'cloudy' },
	6: { text: 'Overcast', icon: 'cloudy', scene: 'cloudy' },
	7: { text: 'Fog', icon: 'fog', scene: 'cloudy' },
	8: { text: 'Light rain showers', icon: 'rain', scene: 'rainy' },
	9: { text: 'Moderate rain showers', icon: 'rain', scene: 'rainy' },
	10: { text: 'Heavy rain showers', icon: 'rain', scene: 'rainy' },
	11: { text: 'Thunderstorm', icon: 'thunder', scene: 'rainy' },
	12: { text: 'Light sleet showers', icon: 'sleet', scene: 'rainy' },
	13: { text: 'Moderate sleet showers', icon: 'sleet', scene: 'rainy' },
	14: { text: 'Heavy sleet showers', icon: 'sleet', scene: 'rainy' },
	15: { text: 'Light snow showers', icon: 'snow', scene: 'snowy' },
	16: { text: 'Moderate snow showers', icon: 'snow', scene: 'snowy' },
	17: { text: 'Heavy snow showers', icon: 'snow', scene: 'snowy' },
	18: { text: 'Light rain', icon: 'rain', scene: 'rainy' },
	19: { text: 'Moderate rain', icon: 'rain', scene: 'rainy' },
	20: { text: 'Heavy rain', icon: 'rain', scene: 'rainy' },
	21: { text: 'Thunder', icon: 'thunder', scene: 'rainy' },
	22: { text: 'Light sleet', icon: 'sleet', scene: 'rainy' },
	23: { text: 'Moderate sleet', icon: 'sleet', scene: 'rainy' },
	24: { text: 'Heavy sleet', icon: 'sleet', scene: 'rainy' },
	25: { text: 'Light snowfall', icon: 'snow', scene: 'snowy' },
	26: { text: 'Moderate snowfall', icon: 'snow', scene: 'snowy' },
	27: { text: 'Heavy snowfall', icon: 'snow', scene: 'snowy' }
};

// The last weather we got from SMHI, and when we got it
let cache = null;

// Returns the weather summary, or null if SMHI can't be reached (and we have nothing saved).
// We only ask SMHI again when our saved copy is older than 30 minutes.
export async function getWeather() {
	const cacheIsFresh = cache && Date.now() - cache.fetchedAt < CACHE_MINUTES * 60 * 1000;
	if (cacheIsFresh) return cache.weather;

	try {
		// Give up after 5 seconds, so a slow SMHI never makes our page slow
		const response = await fetch(SMHI_URL, { signal: AbortSignal.timeout(5000) });
		if (!response.ok) throw new Error(`SMHI answered with status ${response.status}`);

		const forecast = await response.json();
		const weather = summarize(forecast);

		cache = { weather, fetchedAt: Date.now() };
		return weather;
	} catch (error) {
		console.error('Could not get the weather from SMHI:', error.message);
		// An older forecast is better than none
		return cache?.weather ?? null;
	}
}

// Turns SMHI's big forecast (one entry per hour, then every few hours, ~10 days ahead)
// into just what the page shows: the weather right now and a few days ahead.
function summarize(forecast) {
	const now = forecast.timeSeries[0].data; // the first entry is the coming hour

	return {
		updated: forecast.referenceTime,
		current: {
			temperature: Math.round(now.air_temperature),
			wind: Math.round(now.wind_speed),
			gusts: Math.round(now.wind_speed_of_gust),
			precipitation: now.precipitation_amount_mean, // millimetres in the coming hour
			...describe(now.symbol_code)
		},
		days: nextDays(forecast.timeSeries, 3)
	};
}

// Text, icon and scene for an SMHI symbol code (cloudy if the code is ever unknown)
function describe(symbolCode) {
	return SYMBOLS[symbolCode] ?? SYMBOLS[6];
}

// The coming days (not today): highest and lowest temperature, and the weather around noon
function nextDays(timeSeries, count) {
	const today = swedishDate(new Date());
	const days = new Map();

	// Group the forecast entries by date, in Swedish time
	for (const entry of timeSeries) {
		const date = swedishDate(new Date(entry.time));
		if (date === today) continue;
		if (!days.has(date)) days.set(date, []);
		days.get(date).push(entry);
	}

	return [...days.entries()].slice(0, count).map(([date, entries]) => {
		const temperatures = entries.map((entry) => entry.data.air_temperature);

		// The entry closest to 12 o'clock describes the day best
		const noon = entries.reduce((best, entry) =>
			Math.abs(swedishHour(entry.time) - 12) < Math.abs(swedishHour(best.time) - 12) ? entry : best
		);

		return {
			date,
			weekday: new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short' }),
			max: Math.round(Math.max(...temperatures)),
			min: Math.round(Math.min(...temperatures)),
			...describe(noon.data.symbol_code)
		};
	});
}

// "2026-11-02" for a moment in time, as a date in Sweden
function swedishDate(date) {
	return date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE });
}

// The hour (0–23) in Sweden for an SMHI time like "2026-11-02T11:00:00Z"
function swedishHour(time) {
	return Number(new Date(time).toLocaleString('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: TIME_ZONE }));
}
