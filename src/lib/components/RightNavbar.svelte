<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	const links = [
		{ name: 'Contributions', href: '#contributions' },
		{ name: 'Experience', href: '#experience' },
		{ name: 'Projects', href: '#projects' },
		{ name: 'Skills', href: '#skills' },
		{ name: 'Blog', href: '#blogs' },
		{ name: 'Education', href: '#education' }
	];

	let activeSection: string | null = null;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeSection = entry.target.id;
				}
			},
			{ rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
		);

		for (const { href } of links) {
			const el = document.getElementById(href.slice(1));
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

{#if $page.url.pathname === '/'}
	<div class="right-nav-root">
		<nav class="right-nav" aria-label="Section index">
			<h3 class="index-label">Index</h3>
			{#each links as link}
				{@const isActive = activeSection === link.href.slice(1)}
				<a href={link.href} class="right-link" class:active={isActive}>
					<span class="dash" class:open={isActive}></span>
					{link.name}
				</a>
			{/each}
		</nav>
	</div>
{/if}

<style>
	.right-nav-root {
		display: none;
	}

	@media (min-width: 1024px) {
		.right-nav-root {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 50;
			pointer-events: none;
		}

		.right-nav {
			position: absolute;
			top: 22vh;
			left: calc(70% + 1.5rem);
			pointer-events: auto;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-top: 0.5rem;
		}
	}

	.index-label {
		margin: 0 0 0.25rem;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
		opacity: 0.7;
	}

	.right-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.right-link:hover,
	.right-link.active {
		color: var(--text);
	}

	.dash {
		display: block;
		height: 1px;
		width: 0;
		background: transparent;
		transition: width 0.25s ease, background 0.25s ease;
	}

	.dash.open {
		width: 12px;
		background: var(--border);
	}
</style>
