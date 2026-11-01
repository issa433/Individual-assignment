import { defineEnvVars } from '@sveltejs/kit/env';

// Invite codes must never be empty, otherwise an empty form field would match them
function requiredCode(value) {
	if (!value) throw new Error('Set GUEST_INVITE_CODE and HOST_INVITE_CODE in .env');
	return value;
}

// Every environment variable the app uses is declared here.
// The values come from the .env file (never committed to git).
// Private variables can only be imported in server code, from '$app/env/private'.
export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Neon PostgreSQL connection string',
		// Stop with a clear message if .env still has the placeholder from .env.example
		schema: (value) => {
			if (!value || value.includes('USER:PASSWORD@HOST')) {
				throw new Error('Set DATABASE_URL in .env to your Neon connection string');
			}
			return value;
		}
	},
	GUEST_INVITE_CODE: {
		description: 'Invite code that creates a guest account',
		schema: requiredCode
	},
	HOST_INVITE_CODE: {
		description: 'Invite code that creates a host account',
		schema: requiredCode
	}
});
