<script lang="ts">
	export let data: {
		posts: {
			slug: string;
			title: string;
			description: string;
			date: string;
		}[];
	};
</script>

<svelte:head>
	<title>blogs. | Mann Lohchab</title>
	<meta name="description" content="Blog posts about development and tech" />
</svelte:head>

<section class="fade-in-up">
	<div class="page-header">
		<a href="/" class="back-link">← Back to Home</a>
		<h1 class="page-title">blogs.</h1>
		<p class="subtitle">I write about tech and my experiences. I am not a professional writer, so if you spot any inaccuracies, please feel free to reach out.</p>
	</div>

	<div class="list-layout">
		{#each data.posts as post (post.slug)}
			<a href={`/blogs/${post.slug}`} class="list-item blog-link">
				<div class="list-left">
					<h4 class="item-title">{post.title}</h4>
					<p class="item-subtitle">{post.description}</p>
				</div>
				<div class="list-right">
					<span class="item-date">{post.date}</span>
					<span class="read-more">Read more →</span>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	section {
		padding: 4rem 1rem;
		max-width: 760px;
		margin: 0 auto;
	}

	.fade-in-up {
		animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.page-header {
		margin-bottom: 4rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.95rem;
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.back-link:hover {
		color: var(--text);
		transform: translateX(-4px);
	}

	.page-title {
		margin: 0 0 1rem;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		font-weight: 500;
		font-size: 2rem;
		color: var(--text);
		letter-spacing: -0.02em;
	}

	.subtitle {
		margin: 0;
		color: var(--text-muted);
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.list-layout {
		display: flex;
		flex-direction: column;
	}

	.blog-link {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
		padding: 2rem 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.blog-link:first-child {
		border-top: 1px solid var(--border);
	}

	.list-left {
		flex: 1;
	}

	.item-title {
		margin: 0 0 8px;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text);
		transition: color 0.2s ease;
	}

	.item-subtitle {
		margin: 0;
		font-size: 1rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.list-right {
		text-align: right;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.item-date {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.read-more {
		font-size: 0.9rem;
		color: var(--text-muted);
		opacity: 0;
		transform: translateX(-10px);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.blog-link:hover .item-title {
		color: var(--text-muted);
	}

	.blog-link:hover .read-more {
		opacity: 1;
		color: var(--text);
		transform: translateX(0);
	}

	@media (max-width: 640px) {
		.blog-link {
			flex-direction: column;
			gap: 12px;
			padding: 1.5rem 0;
		}

		.list-right {
			align-items: flex-start;
			flex-direction: row-reverse;
			justify-content: space-between;
			width: 100%;
		}

		.read-more {
			opacity: 1;
			transform: none;
		}
	}
</style>
