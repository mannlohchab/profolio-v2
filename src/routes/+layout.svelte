<script lang="ts">
	import './layout.css';
	import Footer from '$lib/components/footer/footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { capturePageview, initAnalytics } from '$lib/analytics';

	let { children } = $props();

	initAnalytics();

	afterNavigate(() => {
		capturePageview();
	});

	const isHome = $derived($page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
	<link rel="apple-touch-icon" href="/favicon.png" />
</svelte:head>

{#if !isHome}
	<nav class="top-nav">
		<div class="nav-container">
			<div class="nav-links">
				<a href="/" class="nav-link">Home</a>
				<a href="/projects" class="nav-link">Work</a>
				<a href="/blogs" class="nav-link">Blog</a>
				<a href="/resume" class="nav-link" target="_blank" rel="noopener noreferrer">Resume</a>
			</div>
			<ThemeToggle />
		</div>
	</nav>
{/if}

<main class="main-content" class:home={isHome}>
	{@render children()}
</main>

<Footer />

<style>
	.top-nav {
		position: sticky;
		top: 1rem;
		z-index: 50;
		max-width: fit-content;
		margin: 0 auto 1.5rem;
		background: var(--bg);
		padding: 0.45rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 9999px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	:global(.dark) .top-nav {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.nav-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 1.25rem;
	}

	.nav-link {
		color: var(--text-muted);
		text-decoration: none;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		font-size: 1.15rem;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: var(--text);
	}

	.main-content {
		min-height: calc(100vh - 100px);
		padding-inline: clamp(1rem, 4vw, 2rem);
	}

	.main-content.home {
		min-height: 100vh;
		padding-inline: 0;
	}
</style>
