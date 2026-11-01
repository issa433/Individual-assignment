-- Nissamåla Farm database schema (PostgreSQL).
--
-- WARNING: running this file deletes all tables and their data, then creates them again.
-- It is run by `npm run seed` (scripts/seed.js).

DROP TABLE IF EXISTS ai_drafts, comments, posts, sessions, users;

-- Everyone who can sign in. The role decides where their posts are shown:
-- 'host' posts go under "From the farm", 'guest' posts under "Guest stories".
CREATE TABLE users (
	id            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- the database picks the next number
	username      text NOT NULL UNIQUE,
	display_name  text NOT NULL,
	password_hash text NOT NULL, -- never the password itself, only a hash of it
	role          text NOT NULL CHECK (role IN ('host', 'guest')),
	created_at    timestamptz NOT NULL DEFAULT now()
);

-- One row per signed-in browser. The id is a long random string that is also stored
-- in the browser's cookie, so the server can look up who is signed in.
CREATE TABLE sessions (
	id         text PRIMARY KEY,
	user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	expires_at timestamptz NOT NULL
);

CREATE TABLE posts (
	id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	author_id  integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	title      text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
	body       text NOT NULL CHECK (length(body) BETWEEN 1 AND 20000),
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE comments (
	id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	post_id    integer NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
	author_id  integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	body       text NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
	created_at timestamptz NOT NULL DEFAULT now()
);

-- One row every time someone uses "Write it for me", so we can limit how often
-- the AI is used per day (every AI request costs a little money).
CREATE TABLE ai_drafts (
	id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes make the most common lookups fast:
-- listing posts newest first, and finding the comments for one post.
CREATE INDEX posts_created_at_idx ON posts (created_at DESC);
CREATE INDEX comments_post_id_idx ON comments (post_id);
