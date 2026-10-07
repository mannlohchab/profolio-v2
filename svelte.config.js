import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import vitesseDark from '@shikijs/themes/vitesse-dark';

const highlighter = await createHighlighter({
	themes: [vitesseDark],
	langs: ['zig', 'js', 'ts', 'bash', 'json']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.mdx'],

	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.mdx'],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' });
					return `{@html \`${html}\`}`;
				}
			}
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
