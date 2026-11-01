import { redirect } from '@sveltejs/kit';
import { deleteSession, SESSION_COOKIE } from '#lib/server/auth.js';

// Visiting /logout in the address bar just goes home. Signing out needs the POST form
// in the header, so another website can't sign you out with a simple link.
export function load() {
	redirect(303, '/');
}

export const actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get(SESSION_COOKIE);

		// Delete the session in the database, so the old cookie can never work again
		if (sessionId) await deleteSession(sessionId);
		cookies.delete(SESSION_COOKIE, { path: '/' });

		redirect(303, '/');
	}
};
