import { error } from '@sveltejs/kit';
import { samplePosts, sampleComments } from '#lib/sample-posts.js';

// `params.id` is the [id] part of the URL, e.g. "3" in /posts/3.
// URL params are always strings, so we turn it into a number before comparing.
export function load({ params }) {
	const post = samplePosts.find((post) => post.id === Number(params.id));

	// No such post: show the 404 error page instead
	if (!post) error(404, 'We could not find that story.');

	const comments = sampleComments.filter((comment) => comment.post_id === post.id);

	return { post, comments };
}
