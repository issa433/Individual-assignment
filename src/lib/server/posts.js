import { db } from './db.js';

// All SQL for reading posts and comments lives here.
// Values are never glued into the SQL text. They are sent separately as $1, $2...
// so the database always treats them as data, which prevents SQL injection.

// All posts by hosts or by guests, newest first.
// JOIN users gives us the author's name, and their role decides the section.
export async function getPostsByRole(role) {
	const result = await db.query(
		`SELECT posts.id, posts.title, posts.body, posts.created_at,
		        users.display_name AS author_name, users.role AS author_role
		 FROM posts
		 JOIN users ON users.id = posts.author_id
		 WHERE users.role = $1
		 ORDER BY posts.created_at DESC`,
		[role]
	);
	return result.rows;
}

// One post, or undefined if there is no post with that id
export async function getPost(id) {
	const result = await db.query(
		`SELECT posts.id, posts.title, posts.body, posts.created_at,
		        users.display_name AS author_name, users.role AS author_role
		 FROM posts
		 JOIN users ON users.id = posts.author_id
		 WHERE posts.id = $1`,
		[id]
	);
	return result.rows[0];
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
