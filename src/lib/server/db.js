import pg from 'pg';
import { DATABASE_URL } from '$app/env/private';

// A pool keeps a few connections to Neon open and reuses them,
// so each page request doesn't have to connect from scratch.
export const db = new pg.Pool({ connectionString: DATABASE_URL });

// Neon closes idle connections when the database goes to sleep.
// Without this handler that would crash the server; now we just log it,
// and the pool opens a new connection the next time it's needed.
db.on('error', (error) => {
	console.error('Database connection closed:', error.message);
});
