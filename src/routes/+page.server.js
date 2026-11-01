import { getPostsByRole } from '#lib/server/posts.js';

// Runs on the server before the homepage renders.
// Whatever we return here becomes `data` in +page.svelte.
export async function load() {
	// Ask the database for both lists at the same time, and wait until both are done
	const [hostPosts, guestPosts] = await Promise.all([getPostsByRole('host'), getPostsByRole('guest')]);

	return { hostPosts, guestPosts };
}
