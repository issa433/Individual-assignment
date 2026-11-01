# Nissamåla Farm

A cheerful community journal for **Nissamåla gård**, a small farm with holiday cottages, sheep and hens outside Karlskrona, Sweden.

The hosts publish news and practical information under **From the farm**, and guests write about their stay under **Guest stories**. Anyone can read. Signed-in users can write posts and comment. The homepage is a 2D cartoon farm whose weather follows the real forecast from SMHI, and a sheep mascot dresses for it.

An individual school project for *Programming & Methods* at Berghs School of Communication.

## Features

- **Two kinds of posts:** host posts ("From the farm") and guest posts ("Guest stories") are shown separately. Which section a post goes in is decided by the author's role.
- **Posts and comments:** a listing on the homepage, a page for each post, and a link back to the right section.
- **Accounts with invite codes:** register with a guest or host invite code, sign in and sign out. You must be signed in to write posts and comments.
- **Deleting posts:** you can delete your own posts. Hosts can delete any post. Comments are deleted together with their post.
- **Search and filter tabs:** server-side search in titles and texts, plus the tabs *All*, *From the farm* and *Guest stories*. Search and tab are part of the URL (`/?q=apple&show=farm`), so they can be shared.
- **Real weather from SMHI:** the current temperature, wind, precipitation, a weather symbol and the next three days. The cartoon scene changes with the weather:
  - **Sunny:** the sheep wears sunglasses, lounges in a sun chair and has a glass of apple juice.
  - **Cloudy:** grey sky and more clouds.
  - **Rainy:** falling rain, and the sheep holds an umbrella.
  - **Snowy:** falling snow and white hills, and the sheep wears a jacket and hat next to a snowman.
- **"Write it for me" (AI):** in the new-post form, type a few rough notes and the AI (through OpenRouter) writes a suggested title and post. The draft is put in the form so you can edit it. It is never published automatically.
- **A talking sheep:** click it and it says something that fits the weather.
- **Works on phones and desktops,** with keyboard support and screen reader labels.

## Tech stack

| Part | Choice |
|---|---|
| Framework | [SvelteKit 3](https://svelte.dev/docs/kit) with Svelte 5, plain JavaScript (no TypeScript) |
| Database | PostgreSQL on [Neon](https://neon.tech), with the `pg` driver and plain parameterized SQL (no ORM) |
| Passwords | `bcryptjs` |
| Sessions | Own implementation: a `sessions` table and an `httpOnly` cookie |
| Weather | [SMHI open data](https://opendata.smhi.se/), point forecast `snow1g` version 1 |
| AI | [OpenRouter](https://openrouter.ai) chat completions API |
| Fonts | Fredoka (headlines) and Nunito (text) from Google Fonts |
| Illustrations | Hand-written SVG in Svelte components |
| Hosting | [Vercel](https://vercel.com) (`@sveltejs/adapter-vercel`), in Frankfurt next to the Neon database |

## Running it locally

You need **Node.js 22.17 or newer** and a free **Neon** account.

```bash
npm install
cp .env.example .env      # then fill in the values, see "Configuration" below
npm run seed              # creates the tables and adds sample posts
npm run dev -- --open     # starts the site at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds the production version |
| `npm run preview` | Runs the production build locally |
| `npm run seed` | **Deletes all data**, creates the tables again from `schema.sql`, and adds sample users, posts and comments |

## Putting it online (Vercel)

1. Push the code to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository.
3. Under **Environment Variables**, add `DATABASE_URL`, `GUEST_INVITE_CODE`, `HOST_INVITE_CODE`, `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` with the same values as in `.env`.
4. Click **Deploy**. Every later push to GitHub deploys the new version automatically.

The adapter settings are in `vite.config.js`. The site runs in Vercel's Frankfurt region (`fra1`), close to the Neon database in `aws-eu-central-1`.

## Configuration

All secrets live in `.env`, which is ignored by git. `.env.example` lists every variable with placeholders. [src/env.js](src/env.js) declares and checks them when the app starts, and the server reads them from `$app/env/private`.

### Neon (the database)

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Click **Connect** on the project dashboard and copy the connection string.
3. Paste it into `.env` as `DATABASE_URL`. The pooled string, whose host name contains `-pooler`, is best for the website.
4. Optional: add the direct (non-pooled) string as `DATABASE_URL_UNPOOLED`. The seed script uses it for creating tables.
5. Run `npm run seed`.

With the [Neon CLI](https://neon.com/docs/cli/install), `neon link` followed by `neon env pull` writes both connection strings into `.env` for you. `neon.ts` and `.neon` are the CLI's config files.

### Invite codes

```
GUEST_INVITE_CODE="something-for-guests"
HOST_INVITE_CODE="something-for-the-hosts"
```

Anyone who registers with the guest code becomes a **guest**, and anyone with the host code becomes a **host**. Several people can be hosts. Both codes must be set. Use two different codes, because if they are the same, everyone who registers becomes a host.

### OpenRouter ("Write it for me")

```
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_MODEL="google/gemma-4-31b-it:free,nvidia/nemotron-3.5-lightning:free"
```

Create a key at [openrouter.ai/keys](https://openrouter.ai/keys).

- **Free models only.** The site only uses OpenRouter's free models, whose id ends in `:free`, so "Write it for me" never costs anything. A safety switch (`ONLY_FREE_MODELS` in the endpoint) refuses paid models.
- **Several models:** separate them with commas. If the first one is busy, OpenRouter tries the next.
- **Comparing models:** find free models at [openrouter.ai/models](https://openrouter.ai/models). Change the list and restart the dev server.
- **Daily limits:** free models have a daily limit on OpenRouter's side. The site also allows each user 10 drafts per day and everyone together 100 per day ([src/lib/server/ai-limit.js](src/lib/server/ai-limit.js)), so one person can't use up the quota.
- **Optional:** both values can be left out. The rest of the site works, and "Write it for me" shows that it isn't set up.

### The farm's coordinates

The weather is fetched for the coordinates in [src/lib/config.js](src/lib/config.js) (decimal degrees, at most 6 decimals). They aren't secret, so they live in the code.

## How it works

### Data

[schema.sql](schema.sql) has four tables:
- `users`: username, display name, password hash and role (`host` or `guest`)
- `sessions`
- `posts`
- `comments`

Foreign keys with `ON DELETE CASCADE` remove a post's comments when the post is deleted. `CHECK` rules keep roles and text lengths valid. All SQL is in [src/lib/server/posts.js](src/lib/server/posts.js) and [src/lib/server/auth.js](src/lib/server/auth.js). Every value is sent separately as `$1`, `$2`... and never pasted into the SQL text, which prevents SQL injection.

The sample authors created by `npm run seed` (Richard, Eva, Sofie, Jonas and Hanna) **cannot sign in**. Their password hash never matches anything. Create your own accounts by registering.

### Sign-in

1. **Registering** checks the invite code, hashes the password with bcrypt and creates the user.
2. **Signing in** creates a random 64-character session id. It is stored in the `sessions` table and in a cookie that is `httpOnly`, `sameSite=lax`, and `secure` in production.
3. **[src/hooks.server.js](src/hooks.server.js)** runs on every request. It reads the cookie, looks up the user, and puts them in `event.locals.user`.
4. **Signing out** deletes the session from the database.

### Search

`getPosts(role, search)` filters with `title ILIKE $2 OR body ILIKE $2`. `ILIKE` ignores upper and lower case. The `%` and `_` characters in the search text are escaped, so they are searched for literally instead of acting as wildcards.

### Weather

[src/lib/server/weather.js](src/lib/server/weather.js) fetches the SMHI forecast **on the server** and caches it for 30 minutes.
- SMHI's `symbol_code` (1–27) is turned into a description, an icon and one of four scenes: sunny, cloudy, rainy or snowy.
- The homepage puts a class like `weather-rainy` on a wrapper, which changes the colour variables. The sheep gets an `outfit`.
- If SMHI can't be reached, the page still works and shows a friendly message.
- To preview any weather, add `?weather=sunny`, `cloudy`, `rainy` or `snowy` to the address, or use the links in the weather column.

### "Write it for me"

```
1. browser    → my server    the user's rough notes
2. my server                 checks sign-in, the notes' length (10–1000) and the daily limit
3. my server  → OpenRouter   notes + system prompt + the secret API key
4. OpenRouter → my server    the AI's answer
5. my server  → browser      { title, body }
6. browser                   fills in the form, the user edits and publishes
```

- The endpoint is [src/routes/api/write-for-me/+server.js](src/routes/api/write-for-me/+server.js).
- The system prompt is a plain text file, [src/lib/server/prompts/write-for-me.txt](src/lib/server/prompts/write-for-me.txt).
- The API key only exists on the server and never reaches the browser.

## Security

- Secrets live only in `.env`, and `.env.example` contains placeholders only.
- Every SQL query is parameterized.
- User text is always shown with Svelte's `{...}`, which escapes HTML. `{@html}` is never used, so HTML in a post shows up as plain text.
- Passwords are stored as bcrypt hashes. Sign-in errors don't reveal whether a username exists.
- Every form action and endpoint checks sign-in and permissions on the server. Hiding a button isn't enough.
- SvelteKit blocks form submissions from other websites (CSRF) in the production build.
- After signing in, `redirectTo` only accepts paths on this site.

## Accessibility

- Semantic HTML with a heading on every section, plus a *Skip to content* link.
- A visible focus outline for keyboard users.
- Labels on all form fields. Errors and status messages are read out by screen readers (`role="alert"` and `aria-live`).
- Colour contrast meets WCAG AA. The sheep is a real `<button>` with a label.
- All animations (clouds, rain, snow, the bobbing sheep, smooth scrolling) are turned off for people who ask for reduced motion.
- Checked with axe-core on every page (signed out, signed in, and the different weathers) with no issues, and with no sideways scrolling from 320px to 1440px wide.

## Left out on purpose

- **Image uploads** (the only photo is part of the site's design).
- **Moderation tools** beyond deleting posts: no reporting, banning, or deleting comments.
- **Editing** posts or comments after publishing.
- **Password reset, email and account settings.**
- **Rate limiting** for sign-in attempts. AI requests do have a daily limit.
- **Pagination.** All posts are listed, which is fine at a farm journal's scale.
- **A night version** of the scene. The sun shows for clear skies even at night.

## Credits

- Weather data from [SMHI](https://www.smhi.se/en), the Swedish Meteorological and Hydrological Institute.
- AI drafts through [OpenRouter](https://openrouter.ai).
- The photo of the flock is from Nissamåla gård.
- The sheep, the farm and the weather icons are SVG drawings made for this project.
