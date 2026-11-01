import { getPosts } from '#lib/server/posts.js';

// Runs on the server before the homepage renders.
// The search and the chosen tab come from the URL, e.g. /?q=apple&show=farm
export async function load({ url }) {
	const search = (url.searchParams.get('q') ?? '').trim().slice(0, 100);

	// Which tab is chosen: 'all', 'farm' or 'guests'. Anything else counts as 'all'.
	const showParam = url.searchParams.get('show');
	const show = showParam === 'farm' || showParam === 'guests' ? showParam : 'all';

	// Ask the database for both lists at the same time, but skip a list whose tab isn't shown
	const [hostPosts, guestPosts] = await Promise.all([
		show === 'guests' ? [] : getPosts('host', search),
		show === 'farm' ? [] : getPosts('guest', search)
	]);

	return { search, show, hostPosts, guestPosts };
}
