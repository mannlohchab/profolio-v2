<script lang="ts">
	import folder from '$lib/assets/icons/folder.svg';

	const modules = import.meta.glob('$lib/projects/*.{md,mdx}', { eager: true });
	const projects = Object.entries(modules).map(([path, module]) => {
		const m = module as any;
		return {
			path,
			metadata: m.metadata,
			component: m.default
		};
	}).sort((a, b) => a.metadata.order - b.metadata.order);

	const iconMap: Record<string, string> = {
		'Node.js': 'nodedotjs',
		'React': 'react',
		'Express': 'express',
		'MongoDB': 'mongodb',
		'Python': 'python',
		'scikit-learn': 'scikitlearn',
		'Pandas': 'pandas',
		'Svelte': 'svelte',
		'CSS': 'css3',
		'Nginx': 'nginx',
		'PostgreSQL': 'postgresql',
		'C': 'c',
		'Linux': 'linux',
		'TypeScript': 'typescript',
		'Bun': 'bun',
		'Rust': 'rust',
		'Zig': 'zig',
		'PyTorch': 'pytorch',
		'Docker': 'docker',
		'Candle': 'huggingface'
	};

	function getIconUrl(tech: string) {
		const iconName = iconMap[tech];
		return iconName ? `https://cdn.simpleicons.org/${iconName}` : null;
	}
</script>

<svelte:head>
	<title>Projects | Mann Lohchab</title>
</svelte:head>

<section class="fade-in-up">
	<div class="page-header">
		<a href="/" class="back-link">← Back to Home</a>
		<div class="title-wrapper">
			<img src={folder} alt="Projects" class="section-icon" />
			<h1 class="page-title">projects.</h1>
		</div>
		<p class="subtitle">A selection of my recent work and experiments.</p>
	</div>

	<div class="projects-list">
		{#each projects as project}
			<article class="editorial-project">
				<div class="project-meta">
					<span class="project-year">{project.metadata.year}</span>
					{#if project.metadata.stack}
						<div class="project-stack">
							{#each project.metadata.stack as tech}
								<span class="tech-dot">
									{#if getIconUrl(tech)}
										<img src={getIconUrl(tech)} class="tech-icon" alt={tech} loading="lazy" />
									{/if}
									{tech}
								</span>
							{/each}
						</div>
					{/if}
				</div>
				
				<div class="project-content">
					<h2 class="project-name">{project.metadata.title}</h2>
					<div class="project-description">
						<svelte:component this={project.component} />
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	section {
		padding: 4rem 1rem;
		max-width: 860px;
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

	.title-wrapper {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 1rem;
	}

	.section-icon {
		width: 28px;
		height: 28px;
		opacity: 0.8;
	}
	
	:global(.dark) .section-icon {
		filter: invert(1);
	}

	.page-title {
		margin: 0;
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
	}

	.projects-list {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
	}

	.editorial-project {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 3rem;
		padding-bottom: 3.5rem;
		border-bottom: 1px solid var(--border);
	}

	.editorial-project:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.project-year {
		font-family: 'Playfair Display', 'Georgia', serif;
		font-style: italic;
		color: var(--text-muted);
		font-size: 1.2rem;
	}

	.project-stack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tech-dot {
		font-size: 0.9rem;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.tech-icon {
		width: 14px;
		height: 14px;
	}

	.tech-dot::before {
		content: '';
		width: 4px;
		height: 4px;
		background-color: var(--border);
		border-radius: 50%;
	}

	.project-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.project-name {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 500;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.project-description {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.8;
		font-size: 1.05rem;
	}

	.project-description :global(p) {
		margin: 0 0 1rem 0;
	}

	.project-description :global(p:last-child) {
		margin: 0;
	}

	@media (max-width: 768px) {
		.editorial-project {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding-bottom: 2.5rem;
		}
		
		.projects-list {
			gap: 2.5rem;
		}

		.project-meta {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
			border-bottom: 1px solid var(--border);
			padding-bottom: 1rem;
			gap: 1rem;
		}

		.project-stack {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
		
		.tech-dot::before {
			display: none;
		}
	}
</style>
