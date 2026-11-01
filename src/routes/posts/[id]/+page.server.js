import { error } from '@sveltejs/kit';
import { getPost, getComments } from '#lib/server/posts.js';

// `params.id` is the [id] part of the URL, e.g. "3" in /posts/3.
export async function load({ params }) {
	// Only accept a plain whole number (max 9 digits fits the database's integer column).
	// Anything else, like /posts/abc, can't be a post.
	if (!/^\d{1,9}$/.test(params.id)) error(404, 'We could not find that story.');

	const post = await getPost(Number(params.id));
	if (!post) error(404, 'We could not find that story.');

	const comments = await getComments(post.id);

	return { post, comments };
}
