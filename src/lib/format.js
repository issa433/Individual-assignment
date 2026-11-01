// Small helpers for showing posts. Used by several pages.

// "2026-10-24T09:30:00Z" -> "24 October 2026" (Swedish time zone)
export function formatDate(date) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Europe/Stockholm'
	});
}

// Machine-readable date for the <time datetime="..."> attribute
export function isoDate(date) {
	return new Date(date).toISOString();
}

// A post's section is decided by its author's role
export function sectionName(role) {
	return role === 'host' ? 'From the farm' : 'Guest story';
}

// Split a post body into paragraphs on blank lines
export function paragraphs(body) {
	return body
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph !== '');
}

// The first paragraph, cut at a whole word if it is too long
export function excerpt(body, maxLength = 180) {
	const first = paragraphs(body)[0] ?? '';
	if (first.length <= maxLength) return first;
	return first.slice(0, first.lastIndexOf(' ', maxLength)) + '…';
}
