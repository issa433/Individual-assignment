// Sample content that `npm run seed` puts into the database.
// Posts and comments point at their author by username,
// and comments point at their post by a short `key`.

export const users = [
	{ username: 'per', display_name: 'Per', role: 'host' },
	{ username: 'maria', display_name: 'Maria', role: 'host' },
	{ username: 'sofie', display_name: 'Sofie', role: 'guest' },
	{ username: 'jonas', display_name: 'Jonas', role: 'guest' },
	{ username: 'hanna', display_name: 'Hanna', role: 'guest' }
];

export const posts = [
	{
		key: 'apples',
		author: 'per',
		title: 'Apple harvest week is here',
		body: `The old trees behind the barn have outdone themselves this year. The branches are so heavy that we have propped some of them up with planks, and the grass underneath is a carpet of windfalls.

If you are staying with us this week, you are very welcome to pick. Baskets hang inside the barn door. Take what you can eat, and a few more for the road.

On Saturday we will press juice in the yard from about ten o'clock. Bring a bottle, or borrow one of ours, and help us turn the handle.`,
		created_at: '2026-10-24T08:15:00Z'
	},
	{
		key: 'walk',
		author: 'sofie',
		title: 'A misty morning walk along the old stone walls',
		body: `We set off just after sunrise, when the fields were still white with mist. The path starts behind the cottages and follows the stone walls into the forest.

It is an easy loop of about four kilometres. The ground is soft with moss and pine needles, and in one clearing we stood completely still while two deer crossed in front of us.

Tip for other guests: wear proper boots, the low part near the stream gets wet after rain. And bring a thermos, there is a flat rock by the edge of the lake that is perfect for a coffee break.`,
		created_at: '2026-10-26T14:40:00Z'
	},
	{
		key: 'practical',
		author: 'maria',
		title: 'Practical notes for your stay',
		body: `A few things that make arriving easier.

Check-in is from three in the afternoon and check-out by eleven. If you arrive late, the key will be in the small box by your cottage door, and the code comes by text message on the day.

Firewood is stacked in the shed next to the parking area. Please help yourself, but use the dry wood at the front first.

The farm is quietest between ten at night and seven in the morning, for the sake of other guests and the animals.`,
		created_at: '2026-10-18T10:00:00Z'
	},
	{
		key: 'nothing',
		author: 'jonas',
		title: 'Three days of doing nothing, and it was perfect',
		body: `I came here with a pile of books and a plan to be productive. I read half of one book.

The rest of the time I watched the weather move across the fields, walked to the lake, cooked slow dinners and slept better than I have in months. There is no traffic noise at all, just wind and the occasional sheep.

If you are thinking about booking a few days off-season: do it. Autumn here is quiet in the best possible way.`,
		created_at: '2026-10-20T19:05:00Z'
	},
	{
		key: 'animals',
		author: 'per',
		title: 'Meet the animals this autumn',
		body: `The sheep are back from the far pasture and now graze in the field closest to the cottages, so you will see them from your window most mornings.

The hens have slowed down a little now that the days are shorter, but there are usually a few eggs in the basket by the barn. Guests are welcome to take some for breakfast.

Please don't feed the animals bread. If the children want to help, ask us and we will show them when and what to feed.`,
		created_at: '2026-10-29T07:30:00Z'
	},
	{
		key: 'hens',
		author: 'hanna',
		title: 'Kids vs. hens: a report from our family week',
		body: `Our two kids decided on day one that their job this week was to find every single egg on the farm. They took the job very seriously.

Score after five days: kids 23 eggs, hens 1 very offended look. The hosts showed them how to collect them gently, and by the end of the week they were the ones explaining it to us.

We also loved the rainy afternoon in the cottage with board games and the fire going. Thank you for a lovely week, we hope to be back in the spring.`,
		created_at: '2026-10-30T16:20:00Z'
	}
];

export const comments = [
	{
		post: 'apples',
		author: 'sofie',
		body: 'We picked a whole basket yesterday. The red ones by the fence are the sweetest!',
		created_at: '2026-10-25T09:12:00Z'
	},
	{
		post: 'apples',
		author: 'jonas',
		body: 'Sounds lovely. See you at the juice press on Saturday.',
		created_at: '2026-10-25T17:48:00Z'
	},
	{
		post: 'walk',
		author: 'maria',
		body: 'Thank you for walking it and sharing! The rock by the lake is our favourite spot too.',
		created_at: '2026-10-27T08:05:00Z'
	}
];
