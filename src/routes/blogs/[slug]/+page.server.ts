import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import { createHighlighter } from 'shiki';
import vitesseDark from '@shikijs/themes/vitesse-dark';
import { formatPostDate, getPost } from '$lib/server/posts';

const highlighter = await createHighlighter({
	themes: [vitesseDark],
	langs: ['zig', 'js', 'ts', 'bash', 'json', 'html', 'css', 'svelte', 'c', 'rust']
});

export const load: ServerLoad = async ({ params }: { params: Record<string, string> }) => {
	const slug = params.slug;
	const post = await getPost(slug, async (rawMd) => {
		const compiled = await compile(rawMd, {
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const validLang =
						lang && highlighter.getLoadedLanguages().includes(lang as any) ? lang : 'text';
					return highlighter.codeToHtml(code, {
						lang: validLang as any,
						theme: 'vitesse-dark'
					});
				}
			}
		});
		if (!compiled) throw error(500, 'Failed to compile markdown');
		const htmlContent = compiled.code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim();
		const fm = (compiled.data?.fm as Record<string, any>) || {};
		return { html: htmlContent, fm };
	});

	if (!post) throw error(404, 'Post not found');

	return {
		content: post.content,
		headings: post.headings,
		metadata: {
			title: post.title,
			description: post.description,
			date: formatPostDate(post.date),
			cover: post.cover || null,
			author: post.author || 'Mann Lohchab'
		}
	};
};
