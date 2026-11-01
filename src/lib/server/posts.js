import { db } from './db.js';

// All SQL for reading posts and comments lives here.
// Values are never glued into the SQL text. They are sent separately as $1, $2...
// so the database always treats them as data, which prevents SQL injection.

// All posts by hosts or by guests, newest first, optionally only those matching a search.
// JOIN users gives us the author's name, and their role decides the section.
//
// ILIKE is a case-insensitive LIKE: '%apple%' matches any text containing "apple" or "Apple".
// When there is no search we send NULL as $2, and "$2 IS NULL" makes the search part always true.
export async function getPosts(role, search) {
	const pattern = search ? `%${escapeLike(search)}%` : null;

	const result = await db.query(
		`SELECT posts.id, posts.title, posts.body, posts.created_at,
		        users.display_name AS author_name, users.role AS author_role
		 FROM posts
		 JOIN users ON users.id = posts.author_id
		 WHERE users.role = $1
		   AND ($2::text IS NULL OR posts.title ILIKE $2 OR posts.body ILIKE $2)
		 ORDER BY posts.created_at DESC`,
		[role, pattern]
	);
	return result.rows;
}

// In LIKE patterns, % means "anything" and _ means "any one character".
// We put a backslash in front of them, so searching for "100%" looks for a real % sign.
function escapeLike(text) {
	return text.replace(/[\\%_]/g, '\\$&');
}

// One post, or undefined if there is no post with that id.
// author_id is included so we can check who is allowed to delete it.
export async function getPost(id) {
	const result = await db.query(
		`SELECT posts.id, posts.author_id, posts.title, posts.body, posts.created_at,
		        users.display_name AS author_name, users.role AS author_role
		 FROM posts
		 JOIN users ON users.id = posts.author_id
		 WHERE posts.id = $1`,
		[id]
	);
	return result.rows[0];
}

// Saves a new post and returns its id, so we can send the writer straight to it
export async function createPost(authorId, title, body) {
	const result = await db.query(
		`INSERT INTO posts (author_id, title, body)
		 VALUES ($1, $2, $3)
		 RETURNING id`,
		[authorId, title, body]
	);
	return result.rows[0].id;
}

// Deletes a post. Its comments are deleted too, because of ON DELETE CASCADE in schema.sql.
export async function deletePost(id) {
	await db.query('DELETE FROM posts WHERE id = $1', [id]);
}

export async function createComment(postId, authorId, body) {
	await db.query(
		`INSERT INTO comments (post_id, author_id, body)
		 VALUES ($1, $2, $3)`,
		[postId, authorId, body]
	);
}

// The comments on one post, oldest first so they read like a conversation
export async function getComments(postId) {
	const result = await db.query(
		`SELECT comments.id, comments.body, comments.created_at,
		        users.display_name AS author_name
		 FROM comments
		 JOIN users ON users.id = comments.author_id
		 WHERE comments.post_id = $1
		 ORDER BY comments.created_at ASC`,
		[postId]
	);
	return result.rows;
}
