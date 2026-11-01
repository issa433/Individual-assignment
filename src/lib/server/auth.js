import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { db } from './db.js';

// Everything about accounts and signing in lives in this file.

export const SESSION_COOKIE = 'session';
const SESSION_DAYS = 30;

// ---------- Passwords ----------

// bcrypt turns a password into a one-way hash. We store the hash, never the password.
// 12 is the "cost": higher is slower to compute, which makes guessing passwords slow too.
export function hashPassword(password) {
	return bcrypt.hash(password, 12);
}

// Hashes the typed password the same way and compares it with the stored hash
export function checkPassword(password, passwordHash) {
	return bcrypt.compare(password, passwordHash);
}

// ---------- Users ----------

export async function createUser(username, displayName, passwordHash, role) {
	const result = await db.query(
		`INSERT INTO users (username, display_name, password_hash, role)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id`,
		[username, displayName, passwordHash, role]
	);
	return result.rows[0].id;
}

export async function getUserByUsername(username) {
	const result = await db.query('SELECT id, password_hash FROM users WHERE username = $1', [username]);
	return result.rows[0];
}

// ---------- Sessions ----------

// A session is a long random id that we store both in the database and in a cookie.
// When the browser sends the cookie back, we look up which user it belongs to.
export async function createSession(userId) {
	const id = randomBytes(32).toString('hex'); // 64 random characters, impossible to guess
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

	await db.query('INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)', [id, userId, expiresAt]);

	return { id, expiresAt };
}

// The signed-in user for a session id, or null if the session is missing or has expired
export async function getSessionUser(sessionId) {
	const result = await db.query(
		`SELECT users.id, users.username, users.display_name, users.role
		 FROM sessions
		 JOIN users ON users.id = sessions.user_id
		 WHERE sessions.id = $1 AND sessions.expires_at > now()`,
		[sessionId]
	);
	return result.rows[0] ?? null;
}

export async function deleteSession(sessionId) {
	await db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}

// ---------- The cookie ----------

export function setSessionCookie(cookies, session) {
	cookies.set(SESSION_COOKIE, session.id, {
		path: '/', // sent with every page on the site
		httpOnly: true, // JavaScript in the browser can't read it, so a script can't steal it
		sameSite: 'lax', // not sent along when another website posts a form to us
		secure: !dev, // only sent over HTTPS in production (localhost is plain HTTP)
		expires: session.expiresAt
	});
}
