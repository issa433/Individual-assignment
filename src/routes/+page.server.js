import { samplePosts } from '#lib/sample-posts.js';

// Runs on the server before the homepage renders.
// Whatever we return here becomes `data` in +page.svelte.
export function load() {
	// Newest first (in phase 3 this becomes ORDER BY created_at DESC in SQL)
	const posts = [...samplePosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

	return {
		hostPosts: posts.filter((post) => post.author_role === 'host'),
		guestPosts: posts.filter((post) => post.author_role === 'guest')
	};
}
