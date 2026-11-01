import { fail, redirect } from '@sveltejs/kit';
import { createPost } from '#lib/server/posts.js';

// Only signed-in users may write. Others are sent to sign in, and come back here afterwards.
export function load({ locals }) {
	if (!locals.user) redirect(303, '/login?redirectTo=/posts/new');
}

export const actions = {
	// Runs when the "Publish" form is submitted
	default: async ({ request, locals }) => {
		// Check again here: someone could send the form without ever loading the page
		if (!locals.user) redirect(303, '/login?redirectTo=/posts/new');

		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();

		if (title.length < 1 || title.length > 200) {
			return fail(400, { title, body, error: 'The title needs 1–200 characters.' });
		}
		if (body.length < 1 || body.length > 20000) {
			return fail(400, { title, body, error: 'The post needs some text (at most 20,000 characters).' });
		}

		// The author is always the signed-in user, never something sent in the form
		const postId = await createPost(locals.user.id, title, body);

		redirect(303, `/posts/${postId}`);
	}
};
