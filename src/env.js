import { defineEnvVars } from '@sveltejs/kit/env';

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
	}
});
