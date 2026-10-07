<script lang="ts">
	export let data: {
		content: string;
		headings: { id: string; text: string }[];
		metadata: {
			title: string;
			description: string;
			date: string;
			cover: string | null;
			author: string;
		};
	};
</script>

<svelte:head>
	<title>{data.metadata.title} | Mann Lohchab</title>
	<meta name="description" content={data.metadata.description} />
	{#if data.metadata.cover}
		<meta property="og:image" content={data.metadata.cover} />
	{/if}
</svelte:head>

<article class="blog-post">
	<div class="top-bar">
		<a href="/blogs" class="back-link" aria-label="Back to blogs">←</a>
	</div>

	{#if data.metadata.cover}
		<figure class="hero">
			<img
				src={data.metadata.cover}
				alt=""
				class="hero-img"
				width="2000"
				height="1125"
				fetchpriority="high"
			/>
		</figure>
	{/if}

	<header class="post-header">
		<div class="meta-row">
			<span class="meta-badge">Blog</span>
			<span class="date">{data.metadata.date}</span>
		</div>
		<h1 class="title">{data.metadata.title}</h1>
		{#if data.metadata.description}
			<p class="description">{data.metadata.description}</p>
		{/if}
		<div class="author-row">
			<span class="author-avatar" aria-hidden="true">{data.metadata.author.slice(0, 1)}</span>
			<span class="author-name">{data.metadata.author}</span>
		</div>
	</header>

	<div class="body-grid" class:has-toc={data.headings.length > 1}>
		<div class="content">
			{@html data.content}
		</div>

		{#if data.headings.length > 1}
			<aside class="toc" aria-label="Table of contents">
				<p class="toc-label">Table of contents</p>
				<nav class="toc-nav">
					{#each data.headings as heading}
						<a href={`#${heading.id}`}>{heading.text}</a>
					{/each}
				</nav>
			</aside>
		{/if}
	</div>
</article>

<style>
	.blog-post {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.25rem 0 4rem;
	}

	.top-bar {
		padding: 0 1.25rem;
		margin-bottom: 0.75rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 1.1rem;
		border-radius: 999px;
		transition:
			color 0.2s ease,
			background 0.2s ease;
	}

	.back-link:hover {
		color: var(--text);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.hero {
		margin: 0 0 1.75rem;
		border-radius: 0;
		overflow: hidden;
		border: none;
		background: #0a0a0a;
		width: 100%;
	}

	.hero-img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		max-width: none;
	}

	.post-header {
		max-width: 720px;
		margin: 0 auto 2.5rem;
		padding: 0 1.25rem;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.9rem;
		color: var(--text-muted);
		font-size: 0.82rem;
	}

	.meta-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 600;
		color: var(--text);
	}

	.meta-badge::before {
		content: '';
		width: 0.55rem;
		height: 0.55rem;
		background: currentColor;
		border-radius: 2px;
	}

	.title {
		margin: 0 0 0.85rem;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-weight: 600;
		font-size: clamp(1.85rem, 5vw, 2.75rem);
		line-height: 1.18;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.description {
		margin: 0 0 1.35rem;
		color: var(--text-muted);
		font-size: 1.05rem;
		line-height: 1.65;
		max-width: 42rem;
	}

	.author-row {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.author-avatar {
		width: 28px;
		height: 28px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--text) 12%, transparent);
		color: var(--text);
		font-size: 0.75rem;
		font-weight: 700;
	}

	.author-name {
		font-size: 0.92rem;
		color: var(--text);
		font-weight: 500;
	}

	.body-grid {
		display: block;
		padding: 0 1.25rem;
	}

	.body-grid.has-toc {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.toc {
		order: 1;
	}

	.toc-label {
		margin: 0 0 0.75rem;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 600;
	}

	.toc-nav {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		border-left: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
		padding-left: 0.85rem;
	}

	.toc-nav a {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.9rem;
		line-height: 1.4;
		transition: color 0.15s ease;
	}

	.toc-nav a:hover {
		color: var(--text);
	}

	.content {
		color: var(--text);
		font-size: clamp(0.98rem, 2.6vw, 1.05rem);
		overflow-wrap: anywhere;
		max-width: 42rem;
		order: 0;
	}

	.content :global(h2) {
		margin-top: 2.4rem;
		margin-bottom: 0.85rem;
		scroll-margin-top: 5rem;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 3vw, 1.55rem);
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--text);
	}

	.content :global(h3) {
		margin-top: 1.8rem;
		margin-bottom: 0.55rem;
		font-size: 1.1rem;
		color: var(--text);
	}

	.content :global(p) {
		margin: 1rem 0;
		line-height: 1.8;
		color: color-mix(in srgb, var(--text) 88%, var(--text-muted));
	}

	.content :global(a) {
		color: var(--text);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.content :global(ul),
	.content :global(ol) {
		margin: 1rem 0 1rem 1.25rem;
		padding: 0;
		color: color-mix(in srgb, var(--text) 88%, var(--text-muted));
	}

	.content :global(li) {
		margin: 0.35rem 0;
		line-height: 1.7;
	}

	.content :global(strong) {
		color: var(--text);
		font-weight: 650;
	}

	.content :global(pre) {
		padding: 1.15rem 1.2rem;
		border-radius: 10px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		font-size: clamp(0.78rem, 2.4vw, 0.88rem);
		margin: 1.4rem 0;
		border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
		background: #0f1115;
	}

	.content :global(p > code),
	.content :global(li > code),
	.content :global(h2 > code),
	.content :global(h3 > code) {
		background: color-mix(in srgb, var(--text) 8%, transparent);
		color: var(--text);
		padding: 0.12rem 0.35rem;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.content :global(blockquote) {
		border-left: 2px solid color-mix(in srgb, var(--text) 25%, transparent);
		padding-left: 1.1rem;
		color: var(--text-muted);
		font-style: italic;
		margin: 1.6rem 0;
	}

	.content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.92rem;
		overflow-x: auto;
		display: block;
	}

	.content :global(thead) {
		border-bottom: 1px solid color-mix(in srgb, var(--text) 18%, transparent);
	}

	.content :global(th),
	.content :global(td) {
		padding: 0.65rem 0.85rem;
		text-align: left;
		line-height: 1.45;
		white-space: nowrap;
	}

	.content :global(th) {
		color: var(--text);
		font-weight: 600;
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.content :global(td) {
		color: color-mix(in srgb, var(--text) 88%, var(--text-muted));
		border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
		font-variant-numeric: tabular-nums;
	}

	.content :global(tbody tr:last-child td) {
		border-bottom: none;
	}

	@media (min-width: 960px) {
		.blog-post {
			padding: 1.5rem 0 5rem;
		}

		.top-bar,
		.post-header,
		.body-grid {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}

		.body-grid.has-toc {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 220px;
			gap: 3rem;
			align-items: start;
		}

		.toc {
			order: 0;
			position: sticky;
			top: 5.5rem;
			justify-self: stretch;
		}

		.content {
			order: 0;
			max-width: none;
		}

		.hero {
			border-radius: 12px;
			margin-left: 1.5rem;
			margin-right: 1.5rem;
			width: auto;
		}
	}

	@media (max-width: 768px) {
		.hero {
			margin-bottom: 1.25rem;
		}

		.title {
			font-size: clamp(1.55rem, 7vw, 2rem);
		}

		.description {
			font-size: 0.98rem;
		}
	}
</style>
