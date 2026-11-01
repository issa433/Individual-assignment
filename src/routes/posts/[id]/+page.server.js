import { error, fail, redirect } from '@sveltejs/kit';
import { createComment, deletePost, getComments, getPost } from '#lib/server/posts.js';

// Finds the post for the [id] in the URL, or shows the 404 page.
// Only a plain whole number (max 9 digits fits the database's integer column) can be a post id.
async function findPost(id) {
	if (!/^\d{1,9}$/.test(id)) error(404, 'We could not find that story.');

	const post = await getPost(Number(id));
	if (!post) error(404, 'We could not find that story.');

	return post;
}

// Who may delete a post: the person who wrote it, or any host
function canDelete(user, post) {
	return user !== null && (user.id === post.author_id || user.role === 'host');
}

// `params.id` is the [id] part of the URL, e.g. "3" in /posts/3.
export async function load({ params, locals }) {
	const post = await findPost(params.id);
	const comments = await getComments(post.id);

	// The page uses this to decide whether to show the "Delete post" button
	return { post, comments, canDelete: canDelete(locals.user, post) };
}

export const actions = {
	// Runs when the comment form is submitted (action="?/comment")
	comment: async ({ params, request, locals }) => {
		if (!locals.user) redirect(303, `/login?redirectTo=/posts/${params.id}`);

		const post = await findPost(params.id);
		const form = await request.formData();
		const body = String(form.get('body') ?? '').trim();

		if (body.length < 1 || body.length > 2000) {
			return fail(400, { body, error: 'A comment needs 1–2000 characters.' });
		}

		await createComment(post.id, locals.user.id, body);

		// Load the page again with the new comment. Redirecting (instead of just showing the page)
		// means a browser refresh won't send the same comment twice.
		redirect(303, `/posts/${post.id}#comments`);
	},

	// Runs when the "Delete post" button is clicked (action="?/delete")
	delete: async ({ params, locals }) => {
		if (!locals.user) redirect(303, `/login?redirectTo=/posts/${params.id}`);

		const post = await findPost(params.id);

		// Hiding the button isn't enough: anyone can send this form by hand,
		// so the server checks the rule again before deleting anything
		if (!canDelete(locals.user, post)) error(403, 'You can only delete your own posts.');

		await deletePost(post.id);

		// Back to the section the post was in
		redirect(303, post.author_role === 'host' ? '/#farm' : '/#guests');
	}
};
