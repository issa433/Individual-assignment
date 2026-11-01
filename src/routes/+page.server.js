import { getPosts } from '#lib/server/posts.js';
import { getWeather } from '#lib/server/weather.js';

const SCENES = ['sunny', 'cloudy', 'rainy', 'snowy'];

// Runs on the server before the homepage renders.
// The search and the chosen tab come from the URL, e.g. /?q=apple&show=farm
export async function load({ url }) {
	const search = (url.searchParams.get('q') ?? '').trim().slice(0, 100);

	// Which tab is chosen: 'all', 'farm' or 'guests'. Anything else counts as 'all'.
	const showParam = url.searchParams.get('show');
	const show = showParam === 'farm' || showParam === 'guests' ? showParam : 'all';

	// Ask the database and SMHI at the same time, but skip a list whose tab isn't shown
	const [hostPosts, guestPosts, weather] = await Promise.all([
		show === 'guests' ? [] : getPosts('host', search),
		show === 'farm' ? [] : getPosts('guest', search),
		getWeather()
	]);

	// /?weather=snowy previews another weather (handy for showing every scene in class).
	// Otherwise the scene follows the real weather, or is sunny if SMHI couldn't be reached.
	const weatherParam = url.searchParams.get('weather');
	const preview = SCENES.includes(weatherParam) ? weatherParam : null;
	const scene = preview ?? weather?.current.scene ?? 'sunny';

	return { search, show, hostPosts, guestPosts, weather, scene, preview };
}
