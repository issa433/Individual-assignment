import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, createSession, getUserByUsername, setSessionCookie } from '#lib/server/auth.js';

// Already signed in? Go to the homepage.
export function load({ locals }) {
	if (locals.user) redirect(303, '/');
}

export const actions = {
	// Runs when the sign-in form is submitted
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');

		const user = await getUserByUsername(username);

		// The same message whether the username or the password is wrong,
		// so nobody can use this form to find out which usernames exist
		if (!user || !(await checkPassword(password, user.password_hash))) {
			return fail(400, { username, error: 'Wrong username or password.' });
		}

		const session = await createSession(user.id);
		setSessionCookie(cookies, session);

		redirect(303, '/');
	}
};
