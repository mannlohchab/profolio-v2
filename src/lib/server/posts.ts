import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compile } from 'mdsvex';

export type PostMeta = {
	slug: string;
	title: string;
	description: string;
	date: string;
	cover?: string;
	author?: string;
};

export type LoadedPost = PostMeta & {
	content: string;
	headings: { id: string; text: string }[];
};

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

function extractHeadings(markdown: string) {
	const headings: { id: string; text: string }[] = [];
	for (const line of markdown.split('\n')) {
		const m = /^(#{2})\s+(.+)$/.exec(line.trim());
		if (!m) continue;
		const text = m[2].replace(/[*_`#]/g, '').trim();
		headings.push({ id: slugify(text), text });
	}
	return headings;
}

function injectHeadingIds(html: string, headings: { id: string; text: string }[]) {
	let index = 0;
	return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_full, attrs, inner) => {
		const heading = headings[index++];
		const id = heading?.id || slugify(String(inner).replace(/<[^>]+>/g, ''));
		if (/\sid=/.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
		return `<h2${attrs} id="${id}">${inner}</h2>`;
	});
}

async function loadLocalRawPosts() {
	const dir = join(process.cwd(), 'src/lib/posts');
	let names: string[] = [];
	try {
		names = (await readdir(dir)).filter((n) => n.endsWith('.md'));
	} catch {
		return [] as { slug: string; raw: string }[];
	}

	const posts = await Promise.all(
		names.map(async (name) => ({
			slug: name.replace(/\.md$/, ''),
			raw: await readFile(join(dir, name), 'utf8')
		}))
	);
	return posts;
}

async function loadGithubRawPosts() {
	try {
		const res = await fetch('https://api.github.com/repos/mannlohchab/blogs/contents/');
		if (!res.ok) return [] as { slug: string; raw: string }[];
		const files = (await res.json()) as { name: string; download_url: string; type: string }[];
		const mdFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
		return await Promise.all(
			mdFiles.map(async (file) => {
				const contentRes = await fetch(file.download_url);
				return {
					slug: file.name.replace(/\.md$/, ''),
					raw: await contentRes.text()
				};
			})
		);
	} catch {
		return [] as { slug: string; raw: string }[];
	}
}

/** Local posts win on slug collision; GitHub posts fill the rest. */
export async function listPosts(): Promise<PostMeta[]> {
	const local = await loadLocalRawPosts();
	const remote = await loadGithubRawPosts();
	const bySlug = new Map<string, string>();
	for (const post of remote) bySlug.set(post.slug, post.raw);
	for (const post of local) bySlug.set(post.slug, post.raw);

	const posts: PostMeta[] = [];
	for (const [slug, raw] of bySlug) {
		const compiled = await compile(raw);
		const fm = (compiled?.data?.fm as Record<string, any>) || {};
		// Local scratch posts can opt out with draft: true / published: false
		if (fm.draft === true || fm.published === false) continue;
		// Local files without published flag that look like old experiments
		if (local.some((p) => p.slug === slug) && fm.published !== true && !remote.some((p) => p.slug === slug)) {
			if (!fm.title || !fm.date) continue;
			if (fm.published !== true) continue;
		}
		posts.push({
			slug,
			title: fm.title || slug,
			description: fm.description || '',
			date: fm.date || new Date().toISOString(),
			cover: fm.cover,
			author: fm.author
		});
	}

	posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
	return posts;
}

export async function getPost(
	slug: string,
	compileMarkdown: (raw: string) => Promise<{ html: string; fm: Record<string, any> }>
): Promise<LoadedPost | null> {
	const local = await loadLocalRawPosts();
	const hitLocal = local.find((p) => p.slug === slug);
	let raw = hitLocal?.raw;
	if (!raw) {
		const remote = await loadGithubRawPosts();
		raw = remote.find((p) => p.slug === slug)?.raw;
	}
	if (!raw) return null;

	const headings = extractHeadings(raw);
	const { html, fm } = await compileMarkdown(raw);
	return {
		slug,
		title: fm.title || slug,
		description: fm.description || '',
		date: fm.date || new Date().toISOString(),
		cover: fm.cover,
		author: fm.author || 'Mann Lohchab',
		content: injectHeadingIds(html, headings),
		headings
	};
}

export function formatPostDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
