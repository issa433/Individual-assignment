import { fail, redirect } from '@sveltejs/kit';
import { GUEST_INVITE_CODE, HOST_INVITE_CODE } from '$app/env/private';
import {
	createSession,
	createUser,
	getUserByUsername,
	hashPassword,
	setSessionCookie
} from '#lib/server/auth.js';

// Already signed in? Then there is nothing to register.
export function load({ locals }) {
	if (locals.user) redirect(303, '/');
}

export const actions = {
	// Runs when the register form is submitted (method="POST")
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const inviteCode = String(form.get('inviteCode') ?? '').trim();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();
		const displayName = String(form.get('displayName') ?? '').trim();
		const password = String(form.get('password') ?? '');

		// Sent back with any error so the form keeps what was typed (never the password)
		const values = { username, displayName };

		if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
			return fail(400, { ...values, error: 'Username: 3–30 characters, only letters, numbers, - and _.' });
		}
		if (displayName.length < 1 || displayName.length > 50) {
			return fail(400, { ...values, error: 'Please write a name of 1–50 characters.' });
		}
		// bcrypt only uses the first 72 bytes of a password, so we cap the length there
		if (password.length < 8 || password.length > 72) {
			return fail(400, { ...values, error: 'The password needs 8–72 characters.' });
		}

		// The invite code decides the role
		let role;
		if (inviteCode === HOST_INVITE_CODE) role = 'host';
		else if (inviteCode === GUEST_INVITE_CODE) role = 'guest';
		else return fail(400, { ...values, error: 'That invite code is not valid.' });

		if (await getUserByUsername(username)) {
			return fail(400, { ...values, error: 'That username is already taken.' });
		}

		// Create the account, then sign the new user in straight away
		const userId = await createUser(username, displayName, await hashPassword(password), role);
		const session = await createSession(userId);
		setSessionCookie(cookies, session);

		redirect(303, '/');
	}
};
