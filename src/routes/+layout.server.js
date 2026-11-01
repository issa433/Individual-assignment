// Makes the signed-in user (or null) available to every page as `data.user`.
// Only safe fields are sent to the browser: id, username, display_name and role.
export function load({ locals }) {
	return { user: locals.user };
}
