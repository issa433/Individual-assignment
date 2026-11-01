import { db } from './db.js';

// Limits for "Write it for me", so the AI can never cost much money.
export const DRAFTS_PER_USER_PER_DAY = 10;
const DRAFTS_PER_DAY_FOR_EVERYONE = 100; // in case someone creates many accounts

// Checks the limits and, if the user is allowed, counts this draft.
// Returns 'ok', 'user-limit' or 'site-limit'.
export async function useDraftAllowance(userId) {
	// How many drafts in the last 24 hours: by this user, and by everyone together.
	// COUNT(*) FILTER (WHERE ...) counts only the rows that match the condition.
	const result = await db.query(
		`SELECT COUNT(*) FILTER (WHERE user_id = $1) AS by_user,
		        COUNT(*) AS by_everyone
		 FROM ai_drafts
		 WHERE created_at > now() - interval '24 hours'`,
		[userId]
	);
	const { by_user, by_everyone } = result.rows[0];

	if (Number(by_user) >= DRAFTS_PER_USER_PER_DAY) return 'user-limit';
	if (Number(by_everyone) >= DRAFTS_PER_DAY_FOR_EVERYONE) return 'site-limit';

	await db.query('INSERT INTO ai_drafts (user_id) VALUES ($1)', [userId]);
	return 'ok';
}
