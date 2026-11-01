import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, createSession, getUserByUsername, setSessionCookie } from '#lib/server/auth.js';

// Where to go after signing in, e.g. /login?redirectTo=/posts/3 goes back to post 3.
// Only paths on our own site are allowed (one leading /), so a link with
// redirectTo=https://evil.example can't send people to another website.
function safeRedirect(url) {
	const target = url.searchParams.get('redirectTo') ?? '/';
	const isOwnSite = target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/\\');
	return isOwnSite ? target : '/';
}

// Already signed in? Go straight on.
export function load({ locals, url }) {
	if (locals.user) redirect(303, safeRedirect(url));
}

export const actions = {
	// Runs when the sign-in form is submitted
	default: async ({ request, cookies, url }) => {
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

		redirect(303, safeRedirect(url));
	}
};
