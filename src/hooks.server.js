import { getSessionUser, SESSION_COOKIE } from '#lib/server/auth.js';

// Runs on the server for every request, before any page, load function or form action.
// It finds out who is signed in and puts the user in event.locals.user,
// so every other server file can simply check `locals.user`.
export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get(SESSION_COOKIE);

	event.locals.user = sessionId ? await getSessionUser(sessionId) : null;

	// The cookie points to a session that is gone or expired: remove the cookie
	if (sessionId && !event.locals.user) {
		event.cookies.delete(SESSION_COOKIE, { path: '/' });
	}

	return resolve(event);
}
