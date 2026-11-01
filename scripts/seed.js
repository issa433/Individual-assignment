// Resets the database and fills it with sample users, posts and comments.
//
// Run with:  npm run seed
// WARNING: this deletes everything in the database first (see schema.sql).

import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { users, posts, comments } from './seed-data.js';

// Sample authors get a "hash" that no password can ever match,
// so nobody can sign in as them. Real accounts are created by registering.
const CANNOT_SIGN_IN = 'sample-user-cannot-sign-in';

// Schema changes (DROP/CREATE TABLE) should use Neon's direct connection.
// The app itself uses the pooled one (DATABASE_URL), which is better for many short requests.
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('USER:PASSWORD@HOST')) {
	console.error('Set DATABASE_URL in .env to your Neon connection string first.');
	process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

// 1. Delete all tables and create them again from schema.sql
const schema = await readFile(new URL('../schema.sql', import.meta.url), 'utf8');
await client.query(schema);

// 2. Users. `RETURNING id` hands back the id the database picked for each new row,
//    and we remember it by username so posts and comments can point at the right user.
const userIds = {};
for (const user of users) {
	const result = await client.query(
		`INSERT INTO users (username, display_name, password_hash, role)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id`,
		[user.username, user.display_name, CANNOT_SIGN_IN, user.role]
	);
	userIds[user.username] = result.rows[0].id;
}

// 3. Posts, remembered by their key so comments can point at them
const postIds = {};
for (const post of posts) {
	const result = await client.query(
		`INSERT INTO posts (author_id, title, body, created_at)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id`,
		[userIds[post.author], post.title, post.body, post.created_at]
	);
	postIds[post.key] = result.rows[0].id;
}

// 4. Comments
for (const comment of comments) {
	await client.query(
		`INSERT INTO comments (post_id, author_id, body, created_at)
		 VALUES ($1, $2, $3, $4)`,
		[postIds[comment.post], userIds[comment.author], comment.body, comment.created_at]
	);
}

console.log(`Done: ${users.length} users, ${posts.length} posts and ${comments.length} comments.`);
await client.end();
