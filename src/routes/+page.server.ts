import type { ServerLoad } from '@sveltejs/kit';
import { formatPostDate, listPosts } from '$lib/server/posts';

export const load: ServerLoad = async () => {
	const posts = await listPosts();
	return {
		posts: posts.slice(0, 2).map((post) => ({
			...post,
			date: formatPostDate(post.date)
		}))
	};
};
