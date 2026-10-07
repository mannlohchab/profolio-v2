<script lang="ts">
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';

	type TechItem = {
		name: string;
		src?: string;
		invertDark?: boolean;
	};

	type Experience = {
		title: string;
		role: string;
		dates: string;
		location: string;
		src: string;
		href?: string;
		description: string[];
		tech: TechItem[];
		focus?: TechItem[];
	};

	const icon = (name: string, src: string, invertDark = false): TechItem => ({
		name,
		src,
		invertDark
	});

	const experiences: Experience[] = [
		{
			title: 'BhaaratMind',
			role: 'Foundational Backend Engineer',
			dates: '2026 — Present',
			location: 'India',
			src: '/bhaaratmind.svg',
			href: 'https://bhaaratmind.com',
			description: [
				'Leading backend architecture for BhaaratMind AI products built for India across 22+ languages.',
				'Designing and shipping scalable APIs, data services, and multilingual AI workflows for Manthan AI and related products.',
				'Owning reliability, performance, and production systems that power study and intelligence experiences at scale.'
			],
			tech: [
				icon('TypeScript', '/icons/typescript.svg'),
				icon('Python', '/icons/python.svg'),
				icon('Node.js', '/icons/nodejs.svg'),
				icon('FastAPI', '/icons/fastapi.svg'),
				icon('PostgreSQL', '/icons/postgresql.svg'),
				icon('Supabase', '/icons/supabase.svg'),
				icon('Redis', '/icons/redis.svg'),
				icon('Docker', '/icons/docker.svg')
			]
		},
		{
			title: 'Ghostway',
			role: 'Co-founder',
			dates: '2026 — Present',
			location: 'Remote · India',
			src: '/ghostway.png',
			href: 'https://ghostway.in',
			description: [
				'Co-founding Ghostway.in, a food startup focused on modern dining experiences and digital-first operations.',
				'Shaping product direction, brand, and go-to-market alongside technical and operational foundations.',
				'Building systems that connect kitchens, customers, and delivery into one coherent experience.'
			],
			tech: [
				icon('Web', '/icons/react.svg'),
				icon('Backend', '/icons/nodejs.svg'),
				icon('Railway', '/icons/railway.svg', true),
				icon('Vercel', '/icons/vercel.svg', true),
				icon('Figma', '/icons/figma.svg'),
				icon('Supabase', '/icons/supabase.svg')
			],
			focus: [{ name: 'Product' }, { name: 'Ops' }, { name: 'Brand' }]
		},
		{
			title: 'KMOS',
			role: 'Co-founder & Adviser',
			dates: '2024 — Present',
			location: 'India',
			src: '/kmos.png',
			href: 'https://kmos.kmos.workers.dev/',
			description: [
				'Co-founding and advising KMOS, a software collective that designs and builds websites, apps, and the systems that run them.',
				'Guiding product direction, client delivery, and technical architecture across engagements in web, support, and automation.',
				'Advising on engineering standards and long-term ownership so shipped products stay maintained after launch.'
			],
			tech: [
				icon('TypeScript', '/icons/typescript.svg'),
				icon('React', '/icons/react.svg'),
				icon('Node.js', '/icons/nodejs.svg'),
				icon('PostgreSQL', '/icons/postgresql.svg'),
				icon('MongoDB', '/icons/mongodb.svg'),
				icon('Docker', '/icons/docker.svg'),
				icon('Cloudflare', '/icons/cloudflare.svg')
			],
			focus: [{ name: 'Product' }, { name: 'Architecture' }, { name: 'Advisory' }]
		}
	];

	let openIdx: number | null = null;

	function toggle(idx: number) {
		openIdx = openIdx === idx ? null : idx;
	}
</script>

<div class="exp-list">
	{#each experiences as item, idx}
		{@const isOpen = openIdx === idx}
		{@const isLast = idx === experiences.length - 1}
		<div class="exp-item" class:last={isLast}>
			{#if !isLast}
				<div class="item-rule" aria-hidden="true"></div>
			{:else}
				<div class="item-rule full" aria-hidden="true"></div>
				<span class="rule-dot left" aria-hidden="true"></span>
				<span class="rule-dot right" aria-hidden="true"></span>
			{/if}

			<button type="button" class="exp-row" on:click={() => toggle(idx)} aria-expanded={isOpen}>
				<div class="exp-main">
					<div class="logo-frame">
						<div class="logo-inner">
							<img src={item.src} alt="" class="logo" />
						</div>
					</div>
					<div class="exp-copy">
						<div class="title-row">
							{#if item.href}
								<a
									href={item.href}
									class="exp-title link"
									target="_blank"
									rel="noopener noreferrer"
									on:click|stopPropagation
								>
									{item.title}
								</a>
							{:else}
								<span class="exp-title">{item.title}</span>
							{/if}
						</div>
						<span class="exp-role">{item.role}</span>
					</div>
				</div>
				<div class="exp-meta">
					<div class="dates-row">
						<span class="exp-dates">{item.dates}</span>
						<span class="chevron" class:open={isOpen}>
							<NucleoIcon name="chevron-down" size={14} />
						</span>
					</div>
					<span class="exp-location">{item.location}</span>
				</div>
			</button>

			<div class="details" class:open={isOpen}>
				<div class="details-inner">
					{#if item.tech.length}
						<div class="tech-block">
							<h4 class="detail-heading">Technologies &amp; Tools</h4>
							<div class="tech-row">
								{#each item.tech as tech}
									<span class="tech-chip" title={tech.name}>
										{#if tech.src}
											<img
												src={tech.src}
												alt=""
												class="tech-icon"
												class:invert-dark={!!tech.invertDark}
												width="18"
												height="18"
												loading="lazy"
												decoding="async"
											/>
										{:else}
											<span class="tech-fallback" aria-hidden="true"
												>{tech.name.slice(0, 1)}</span
											>
										{/if}
										<span class="tech-label">{tech.name}</span>
									</span>
								{/each}
							</div>
						</div>
					{/if}
					{#if item.focus?.length}
						<div class="focus-block">
							<h4 class="detail-heading">Focused on</h4>
							<ul class="desc-list">
								{#each item.focus as focus}
									<li>{focus.name}</li>
								{/each}
							</ul>
						</div>
					{/if}
					<div class="done-block">
						<h4 class="detail-heading">What I've done</h4>
						<ul class="desc-list">
							{#each item.description as line}
								<li>{line}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.exp-list {
		display: block;
	}

	.exp-item {
		position: relative;
	}

	.item-rule {
		position: absolute;
		bottom: 0;
		left: -1rem;
		right: -1rem;
		height: 0;
		border-bottom: 1px solid var(--blueprint-line);
		pointer-events: none;
		z-index: 10;
		mask-image: repeating-linear-gradient(
			to right,
			black 0,
			black 1px,
			transparent 1px,
			transparent 6px
		);
		-webkit-mask-image: repeating-linear-gradient(
			to right,
			black 0,
			black 1px,
			transparent 1px,
			transparent 6px
		);
	}

	.item-rule.full {
		left: -100vw;
		right: -100vw;
	}

	.rule-dot {
		position: absolute;
		bottom: 0;
		width: 2px;
		height: 2px;
		background: var(--blueprint-node);
		pointer-events: none;
		z-index: 20;
	}

	.rule-dot.left {
		left: -1rem;
		transform: translate(-50%, 50%);
	}

	.rule-dot.right {
		right: -1rem;
		transform: translate(50%, 50%);
	}

	.exp-row {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.65rem;
		padding: 1rem;
		margin: 0 -1rem;
		border: none;
		background: transparent;
		color: inherit;
		cursor: pointer;
		text-align: left;
		border-radius: 8px;
		position: relative;
		z-index: 20;
		transition: background 0.2s ease;
	}

	.exp-row:hover {
		background: color-mix(in srgb, var(--card-bg) 80%, transparent);
	}

	.exp-main {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		flex: 1;
		min-width: 0;
		width: 100%;
	}

	.logo-frame {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--card-bg);
		padding: 2px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.logo-inner {
		width: 100%;
		height: 100%;
		border-radius: 7px;
		border: 1px solid var(--border);
		/* Dark plate so light logos (e.g. Ghostway white ghost) stay visible in both themes */
		background: #111;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	:global(.dark) .logo-inner {
		background: #0a0a0a;
	}

	.logo {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		padding: 0;
		display: block;
	}

	.exp-copy {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.exp-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1.25;
	}

	.exp-title.link {
		text-decoration: none;
	}

	.exp-title.link:hover {
		opacity: 0.75;
	}

	.exp-role {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.exp-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		padding-left: 3.25rem;
		flex-shrink: 0;
	}

	.dates-row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		position: relative;
		padding-right: 1.25rem;
	}

	.exp-dates {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text);
	}

	.chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		color: var(--text-muted);
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		transition: transform 0.25s ease;
	}

	.chevron.open {
		transform: translateY(-50%) rotate(180deg);
	}

	.exp-location {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.details {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s cubic-bezier(0.33, 1, 0.68, 1);
	}

	.details.open {
		grid-template-rows: 1fr;
	}

	.details-inner {
		overflow: hidden;
		padding: 0 0.5rem;
		opacity: 0;
		transform: translateY(-4px);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease,
			padding 0.35s ease;
	}

	.details.open .details-inner {
		padding: 0 0.5rem 1rem 3.25rem;
		opacity: 1;
		transform: translateY(0);
	}

	.desc-list {
		margin: 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.tech-block,
	.focus-block {
		margin-bottom: 1.1rem;
	}

	.done-block {
		margin-top: 0.15rem;
	}

	.detail-heading {
		margin: 0 0 0.65rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.tech-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.tech-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		height: 2.35rem;
		min-width: 2.35rem;
		padding: 0 0.5rem;
		border-radius: 8px;
		border: 1.5px dashed color-mix(in srgb, var(--text) 18%, transparent);
		background: transparent;
		color: var(--text);
		overflow: hidden;
		white-space: nowrap;
		cursor: default;
		transition:
			padding 0.22s ease,
			gap 0.22s ease,
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.tech-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		object-fit: contain;
		display: block;
	}

	:global(.dark) .tech-icon.invert-dark {
		filter: invert(1);
	}

	.tech-fallback {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
		color: var(--text-muted);
	}

	.tech-label {
		display: inline-block;
		max-width: 0;
		opacity: 0;
		overflow: hidden;
		font-size: 12px;
		font-weight: 500;
		color: var(--text);
		transform: translateX(-4px);
		transition:
			max-width 0.22s ease,
			opacity 0.18s ease,
			transform 0.22s ease;
	}

	.tech-chip:hover,
	.tech-chip:focus-visible {
		padding: 0 0.75rem;
		gap: 0.45rem;
		border-style: solid;
		border-color: color-mix(in srgb, var(--text) 14%, transparent);
		background: color-mix(in srgb, var(--card-bg) 88%, var(--text) 4%);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.tech-chip:hover .tech-label,
	.tech-chip:focus-visible .tech-label {
		max-width: 8rem;
		opacity: 1;
		transform: translateX(0);
	}

	:global(.dark) .tech-chip:hover,
	:global(.dark) .tech-chip:focus-visible {
		background: color-mix(in srgb, var(--card-bg) 70%, #fff 6%);
		box-shadow: none;
	}

	@media (min-width: 900px) {
		.exp-row {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.exp-meta {
			align-items: flex-end;
			text-align: right;
			padding-left: 0;
		}

		.exp-title {
			font-size: 1.05rem;
		}
	}
</style>
