<script>
	export let data;

	import pfpLight from '$lib/assets/image-light.png';
	import pfpDark from '$lib/assets/image.png';
	import bannerLight from '$lib/assets/banners/banner-light.png';
	import bannerDark from '$lib/assets/banners/banner-dark.gif';
	import verified from '$lib/assets/verified.png';
	import sv_icon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import GitCal from '$lib/components/gitCal/GitCal.svelte';
	import RightNavbar from '$lib/components/RightNavbar.svelte';
	import BlueprintLine from '$lib/components/BlueprintLine.svelte';
	import SocialHoverCard from '$lib/components/SocialHoverCard.svelte';
	import ExperienceList from '$lib/components/ExperienceList.svelte';
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';
	import Player from '$lib/components/Player/player.svelte';

	const modules = import.meta.glob('$lib/projects/*.{md,mdx}', { eager: true });
	const projects = Object.entries(modules)
		.map(([path, module]) => {
			/** @type {any} */
			const m = module;
			return {
				path,
				metadata: m.metadata,
				component: m.default
			};
		})
		.sort((a, b) => a.metadata.order - b.metadata.order)
		.slice(0, 2);

	/**
	 * Stack icons — local branded SVGs under /static/icons (Simple Icons colors + customs).
	 * `invertDark` only for near-black marks that need a light version in dark mode.
	 * @type {{ name: string, src: string, branded?: boolean, invertDark?: boolean }[]}
	 */
	const skills = [
		{ name: 'TypeScript', src: '/icons/typescript.svg', branded: true },
		{ name: 'JavaScript', src: '/icons/javascript.svg', branded: true },
		{ name: 'Python', src: '/icons/python.svg', branded: true },
		{ name: 'Rust', src: '/icons/rust.svg', branded: true, invertDark: true },
		{ name: 'Zig', src: '/icons/zig.svg', branded: true },
		{ name: 'Java', src: '/icons/java.svg', branded: true, invertDark: true },
		{ name: 'Bash', src: '/icons/bash.svg', branded: true },
		{ name: 'React', src: '/icons/react.svg', branded: true },
		{ name: 'Svelte', src: '/icons/svelte.svg', branded: true },
		{ name: 'TanStack', src: '/icons/tanstack.svg', branded: true },
		{ name: 'Node.js', src: '/icons/nodejs.svg', branded: true },
		{ name: 'Bun', src: '/icons/bun.svg', branded: true, invertDark: true },
		{ name: 'pnpm', src: '/icons/pnpm.svg', branded: true },
		{ name: 'Yarn', src: '/icons/yarn.svg', branded: true },
		{ name: 'Hono', src: '/icons/hono.svg', branded: true },
		{ name: 'Express', src: '/icons/express.svg', branded: true, invertDark: true },
		{ name: 'Axum', src: '/icons/axum.svg', branded: true },
		{ name: 'Flask', src: '/icons/flask.svg', branded: true, invertDark: true },
		{ name: 'FastAPI', src: '/icons/fastapi.svg', branded: true },
		{ name: 'NumPy', src: '/icons/numpy.svg', branded: true },
		{ name: 'PyTorch', src: '/icons/pytorch.svg', branded: true },
		{ name: 'Candle', src: '/icons/candle.svg', branded: true },
		{ name: 'PostgreSQL', src: '/icons/postgresql.svg', branded: true },
		{ name: 'MySQL', src: '/icons/mysql.svg', branded: true },
		{ name: 'SQLite', src: '/icons/sqlite.svg', branded: true },
		{ name: 'Turso', src: '/icons/turso.svg', branded: true },
		{ name: 'Supabase', src: '/icons/supabase.svg', branded: true },
		{ name: 'Convex', src: '/icons/convex.svg', branded: true },
		{ name: 'Appwrite', src: '/icons/appwrite.svg', branded: true },
		{ name: 'MongoDB', src: '/icons/mongodb.svg', branded: true },
		{ name: 'Redis', src: '/icons/redis.svg', branded: true },
		{ name: 'Docker', src: '/icons/docker.svg', branded: true },
		{ name: 'Kubernetes', src: '/icons/kubernetes.svg', branded: true },
		{ name: 'NGINX', src: '/icons/nginx.svg', branded: true },
		{ name: 'Traefik', src: '/icons/traefik.svg', branded: true },
		{ name: 'Firecracker', src: '/icons/firecracker.svg', branded: true },
		{ name: 'QEMU', src: '/icons/qemu.svg', branded: true },
		{ name: 'GitHub', src: '/icons/github.svg', branded: true, invertDark: true },
		{ name: 'AWS', src: '/icons/aws.svg', branded: true },
		{ name: 'Cloudflare', src: '/icons/cloudflare.svg', branded: true }
	];

	/** @param {{ name: string, src: string }} skill */
	function skillIconUrl(skill) {
		return skill.src;
	}

	/** Swap a missing CDN icon for a letter mark so the chip never looks empty. */
	/** @param {Event & { currentTarget: HTMLImageElement }} event */
	function onSkillIconError(event) {
		const img = event.currentTarget;
		if (img.dataset.failed === '1') return;
		img.dataset.failed = '1';
		const mark = document.createElement('span');
		mark.className = 'skill-chip-fallback';
		mark.textContent = (img.dataset.fallback || '?').slice(0, 1).toUpperCase();
		mark.setAttribute('aria-hidden', 'true');
		img.replaceWith(mark);
	}

	const socials = [
		{
			name: 'GitHub',
			icon: /** @type {'github'} */ ('github'),
			href: 'https://github.com/mannlohchab',
			hover: {
				name: 'Mann Lohchab',
				handle: 'mannlohchab',
				avatar: 'https://github.com/mannlohchab.png',
				bio: '19 • Building with Rust & Zig • CS Student',
				location: 'India',
				layout: /** @type {'flat'} */ ('flat'),
				stats: [
					{ value: '48', label: 'Repositories' },
					{ value: '2', label: 'Followers' }
				]
			}
		},
		{
			name: 'X',
			icon: /** @type {'x'} */ ('x'),
			href: 'https://x.com/manns_dream',
			hover: {
				name: 'Mann Lohchab',
				handle: '@manns_dream',
				avatar: 'https://unavatar.io/twitter/manns_dream',
				bio: 'Software Engineer · Full Stack Developer',
				location: 'India',
				layout: /** @type {'banner'} */ ('banner'),
				bannerSrc: bannerLight,
				stats: [
					{ value: '—', label: 'Following' },
					{ value: '—', label: 'Followers' }
				]
			}
		},
		{
			name: 'LinkedIn',
			icon: /** @type {'linkedin'} */ ('linkedin'),
			href: 'https://linkedin.com/in/mann-lohchab-4bb336364',
			hover: {
				name: 'Mann Lohchab',
				handle: 'in/mann-lohchab-4bb336364',
				avatar: pfpLight,
				avatarDark: pfpDark,
				bio: 'Full Stack web developer focused on UI design and robust systems.',
				location: 'India',
				layout: /** @type {'banner'} */ ('banner'),
				bannerSrc: bannerLight,
				stats: [
					{ value: '—', label: 'Connections' },
					{ value: '—', label: 'Followers' }
				]
			}
		},
		{
			name: 'Email',
			icon: /** @type {'envelope'} */ ('envelope'),
			href: 'mailto:mannworks.dev@gmail.com',
			hover: null
		}
	];
</script>

<svelte:head>
	<title>Mann Lohchab</title>
	<meta name="description" content="Mann Lohchab — Software Engineer & Full Stack Developer" />
</svelte:head>

<RightNavbar />

<div class="page">
	<!-- Blueprint vertical rails -->
	<div class="rail rail-left" aria-hidden="true"></div>
	<div class="rail rail-right" aria-hidden="true"></div>

	<!-- Blueprint horizontal rails through banner/profile -->
	<div class="hline hline-banner" aria-hidden="true"></div>
	<div class="hline hline-profile" aria-hidden="true"></div>

	{#each [
		{ top: '22vh', side: 'left' },
		{ top: '22vh', side: 'right' },
		{ top: 'calc(22vh + 112px)', side: 'left' },
		{ top: 'calc(22vh + 112px)', side: 'right' }
	] as node}
		<div
			class="node {node.side}"
			aria-hidden="true"
			style:top={node.top}
		></div>
	{/each}

	<!-- Banner cell -->
	<div class="banner-cell">
		<img src={bannerLight} alt="" class="banner-img banner-light" loading="eager" />
		<img src={bannerDark} alt="" class="banner-img banner-dark" loading="eager" />
		<div class="banner-fade-bottom"></div>
		<div class="banner-fade-left"></div>
		<div class="banner-fade-right"></div>
	</div>

	<!-- Profile cell -->
	<div class="profile-cell">
		<div class="profile-row">
			<div class="identity">
				<div class="avatar-frame">
					<div class="avatar-inner">
						<img src={pfpLight} alt="Mann Lohchab" class="avatar avatar-light" />
						<img src={pfpDark} alt="Mann Lohchab" class="avatar avatar-dark" />
					</div>
					<div class="svelte-tooltip-wrapper">
						<img src={sv_icon} alt="svelte-icon" class="svelte-icon" />
						<span class="svelte-tooltip">Made with Svelte</span>
					</div>
				</div>
				<div class="identity-text">
					<h1 class="name-line">
						<span class="Name">mann lohchab.</span>
						<span class="verified-tooltip-wrapper">
							<img src={verified} alt="verified" class="tick" />
							<span class="verified-tooltip">Not verified</span>
						</span>
					</h1>
					<p class="role">Software Engineer · Full Stack Developer</p>
					<p class="location-line">
						<NucleoIcon name="pin" size={13} class="location-pin" />
						<span>India</span>
					</p>
				</div>
			</div>
			<div class="profile-actions">
				<a
					href="/resume"
					class="resume-btn"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Resume"
				>
					<NucleoIcon name="file" size={20} />
					<span class="resume-label">Resume</span>
				</a>
				<ThemeToggle />
			</div>
		</div>
	</div>

	<!-- Flowing content -->
	<div class="content">
		<p class="thought-line">"Crafting elegant software & digital experiences."</p>

		<div class="about">
			<p class="intro-text">
				<span class="intro-lead">Hi there!</span> I'm <span class="highlight">Mann</span>, a Full
				Stack web developer with a focus on UI design and robust systems.
			</p>
			<p class="tech-text">
				I build elegant web applications using <span class="skill-badge">TypeScript</span>,
				<span class="skill-badge">React</span>, and <span class="skill-badge">Svelte</span>. On the
				backend, I leverage <span class="skill-badge">Hono</span>,
				<span class="skill-badge">Bun</span>, and <span class="skill-badge">MongoDB</span>. Recently,
				I've been expanding my systems programming and data engineering skills with
				<span class="skill-badge">Rust</span>, <span class="skill-badge">Python</span>, and
				<span class="skill-badge">PostgreSQL</span>. Enthusiastic about
				<span class="skill-badge">Zig</span>.
			</p>
		</div>

		<div class="cta-row">
			<a href="mailto:mannworks.dev@gmail.com" class="pill primary">Send an email</a>
			<a href="/projects" class="pill">View work</a>
		</div>

		<div class="song-row">
			<Player />
		</div>

		<div class="social-block">
			<h2 class="social-heading">
				Here are my <span>socials</span>
			</h2>
			<div class="social-row">
				{#each socials as social}
					{#if social.hover}
						<SocialHoverCard
							name={social.hover.name}
							handle={social.hover.handle}
							avatar={social.hover.avatar}
							avatarDark={social.hover.avatarDark ?? null}
							bio={social.hover.bio}
							location={social.hover.location}
							layout={social.hover.layout}
							bannerSrc={social.hover.bannerSrc ?? null}
							stats={social.hover.stats}
						>
							<a
								href={social.href}
								class="pill pill-icon"
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.name}
							>
								<NucleoIcon name={social.icon} size={16} />
								<span>{social.name}</span>
							</a>
						</SocialHoverCard>
					{:else}
						<a
							href={social.href}
							class="pill pill-icon"
							aria-label={social.name}
						>
							<NucleoIcon name={social.icon} size={16} />
							<span>{social.name}</span>
						</a>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Contributions -->
		<section id="contributions" class="section">
			<div class="section-head">
				<BlueprintLine />
				<h2 class="section-title">Contributions.</h2>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>
			<div class="gitcal-wrap">
				<GitCal
					username="mannlohchab"
					months="12"
					styles={{
						commits0: 'var(--commit-0)',
						commits1: 'var(--commit-1)',
						commits2: 'var(--commit-2)',
						commits3: 'var(--commit-3)',
						commits4: 'var(--commit-4)',
						'text-fill': 'var(--text-muted)'
					}}
				/>
			</div>
		</section>

		<!-- Experience -->
		<section id="experience" class="section">
			<div class="section-head">
				<BlueprintLine />
				<h2 class="section-title">Experiences</h2>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>
			<ExperienceList />
		</section>

		<!-- Projects -->
		<section id="projects" class="section">
			<div class="section-head">
				<BlueprintLine />
				<a href="/projects" class="section-title crumb">Projects</a>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>

			<div class="projects-grid">
				<div class="grid-vrail" aria-hidden="true"></div>
				{#each projects as project}
					<a href="/projects" class="project-card">
						<h3 class="project-title">{project.metadata.title}</h3>
						{#if project.metadata.stack}
							<p class="project-meta">{project.metadata.stack.join(' · ')}</p>
						{/if}
						<p class="project-year">{project.metadata.year}</p>
					</a>
				{/each}
			</div>

			<div class="view-all-wrap">
				<a href="/projects" class="view-all">
					View All
					<NucleoIcon name="arrow-up-right" size={14} class="view-all-icon" />
				</a>
			</div>
		</section>

		<!-- Skills -->
		<section id="skills" class="section">
			<div class="section-head">
				<BlueprintLine />
				<h2 class="section-title">stack.</h2>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>
			<div class="skills-grid">
				{#each skills as skill}
					<span class="skill-chip">
						<img
							src={skillIconUrl(skill)}
							alt=""
							class="skill-chip-icon"
							class:branded={!!skill.branded}
							class:invert-dark={!!skill.invertDark}
							width="15"
							height="15"
							loading="lazy"
							decoding="async"
							data-fallback={skill.name}
							onerror={onSkillIconError}
						/>
						<span>{skill.name}</span>
					</span>
				{/each}
			</div>
		</section>

		<!-- Blogs -->
		<section id="blogs" class="section">
			<div class="section-head">
				<BlueprintLine />
				<a href="/blogs" class="section-title crumb">Blog</a>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>

			<div class="list">
				{#if data?.posts?.length}
					{#each data.posts as post}
						<a href={`/blogs/${post.slug}`} class="list-row">
							<div>
								<h3 class="list-title">{post.title}</h3>
								<p class="list-sub">{post.description}</p>
							</div>
							<p class="list-meta">{post.date}</p>
						</a>
					{/each}
				{:else}
					<p class="empty">No posts yet.</p>
				{/if}
			</div>

			<div class="view-all-wrap">
				<a href="/blogs" class="view-all">
					View All
					<NucleoIcon name="arrow-up-right" size={14} class="view-all-icon" />
				</a>
			</div>
		</section>

		<!-- Education -->
		<section id="education" class="section">
			<div class="section-head">
				<BlueprintLine />
				<h2 class="section-title">education.</h2>
				<BlueprintLine className="bottom" />
				<span class="dot left" aria-hidden="true"></span>
				<span class="dot right" aria-hidden="true"></span>
			</div>

			<div class="list">
				<div class="list-row static">
					<div class="edu-main">
						<div class="logo-frame">
							<div class="logo-inner">
								<img src="/srm.png" alt="" class="logo" />
							</div>
						</div>
						<div>
							<h3 class="list-title">SRM University</h3>
							<p class="list-sub">B.Tech in Computer Science & Engineering</p>
						</div>
					</div>
					<div class="list-meta-block">
						<p class="list-meta">Expected 2028</p>
						<p class="list-meta">CGPA: 7.5</p>
					</div>
				</div>
				<div class="list-row static">
					<div class="edu-main">
						<div class="logo-frame">
							<div class="logo-inner">
								<img src="/cbse.png" alt="" class="logo" />
							</div>
						</div>
						<div>
							<h3 class="list-title">CBSE</h3>
							<p class="list-sub">Class XII – Science (PCMB)</p>
						</div>
					</div>
					<div class="list-meta-block">
						<p class="list-meta">Graduated</p>
						<p class="list-meta">87%</p>
					</div>
				</div>
			</div>
		</section>

	</div>
</div>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow-x: hidden;
		background: var(--bg);
		color: var(--text);
	}

	.rail {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		border-right: 1px solid var(--blueprint-line);
		pointer-events: none;
		mask-image: repeating-linear-gradient(
			to bottom,
			black 0,
			black 1px,
			transparent 1px,
			transparent 6px
		);
		-webkit-mask-image: repeating-linear-gradient(
			to bottom,
			black 0,
			black 1px,
			transparent 1px,
			transparent 6px
		);
	}

	.rail-left {
		left: 30%;
	}
	.rail-right {
		right: 30%;
	}

	.hline {
		position: absolute;
		left: 0;
		right: 0;
		height: 0;
		border-bottom: 1px solid var(--blueprint-line);
		pointer-events: none;
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

	.hline-banner {
		top: 22vh;
	}
	.hline-profile {
		top: calc(22vh + 112px);
	}

	.node {
		display: none;
		position: absolute;
		width: 2px;
		height: 2px;
		background: var(--blueprint-node);
		pointer-events: none;
		z-index: 10;
	}

	.node.left {
		left: 30%;
		transform: translate(-50%, -50%);
	}

	.node.right {
		right: 30%;
		transform: translate(50%, -50%);
	}

	.banner-cell {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 22vh;
		overflow: hidden;
		z-index: 0;
		background: var(--bg);
	}

	.banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		opacity: 0.95;
	}

	.banner-light {
		display: block;
	}

	.banner-dark {
		display: none;
	}

	:global(.dark) .banner-light {
		display: none;
	}

	:global(.dark) .banner-dark {
		display: block;
	}

	.banner-fade-bottom,
	.banner-fade-left,
	.banner-fade-right {
		position: absolute;
		pointer-events: none;
		z-index: 2;
	}

	.banner-fade-bottom {
		inset: auto 0 0 0;
		height: 2.5rem;
		background: linear-gradient(to top, color-mix(in srgb, var(--bg) 90%, transparent), transparent);
	}

	.banner-fade-left,
	.banner-fade-right {
		top: 0;
		bottom: 0;
		width: 2rem;
		background: linear-gradient(to right, color-mix(in srgb, var(--bg) 85%, transparent), transparent);
	}

	.banner-fade-right {
		right: 0;
		left: auto;
		background: linear-gradient(to left, color-mix(in srgb, var(--bg) 85%, transparent), transparent);
	}

	.profile-cell {
		position: absolute;
		left: 0;
		right: 0;
		top: 22vh;
		height: 112px;
		display: flex;
		align-items: center;
		padding: 0 1rem;
		z-index: 40;
	}

	.profile-row {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.identity {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 0;
	}

	.avatar-frame {
		position: relative;
		padding: 3px;
		border: 1.5px solid var(--blueprint-line);
		border-radius: 8px;
		flex-shrink: 0;
	}

	.avatar-inner {
		width: 64px;
		height: 64px;
		border-radius: 5px;
		overflow: hidden;
		background: var(--card-bg);
	}

	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(0.15) contrast(1.05);
		transform: scale(1.08) translateY(2px);
	}

	.avatar-light {
		display: block;
	}

	.avatar-dark {
		display: none;
	}

	:global(.dark) .avatar-light {
		display: none;
	}

	:global(.dark) .avatar-dark {
		display: block;
	}

	.identity-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 1.25rem;
		min-width: 0;
	}

	.name-line {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.Name {
		position: relative;
		display: inline-block;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 500;
		color: #000000;
		letter-spacing: -0.02em;
		padding: 0 8px;
		z-index: 1;
		line-height: 1.15;
	}

	.Name::before {
		content: '';
		position: absolute;
		top: 10%;
		left: 0;
		width: 100%;
		height: 80%;
		background: #fed7aa;
		z-index: -1;
		border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
		transform: rotate(-1.5deg);
	}

	:global(.dark) .Name {
		color: #000000;
	}

	.tick {
		width: 18px;
		height: 18px;
	}

	.verified-tooltip-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		cursor: help;
	}

	.verified-tooltip,
	.svelte-tooltip {
		position: absolute;
		bottom: 130%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.7rem;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
		z-index: 10;
		font-family: 'Inter', system-ui, sans-serif;
		font-weight: 400;
		font-style: normal;
	}

	:global(.dark) .verified-tooltip,
	:global(.dark) .svelte-tooltip {
		background: rgba(255, 255, 255, 0.9);
		color: #000;
	}

	.verified-tooltip-wrapper:hover .verified-tooltip,
	.svelte-tooltip-wrapper:hover .svelte-tooltip {
		opacity: 1;
	}

	.svelte-tooltip-wrapper {
		position: absolute;
		width: 22px;
		height: 22px;
		bottom: 2px;
		right: 2px;
		z-index: 10;
	}

	.svelte-icon {
		width: 18px;
		height: 18px;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.role {
		margin: 0.35rem 0 0 8px;
		font-size: 0.9rem;
		color: var(--neon-1);
	}

	.location-line {
		margin: 0.25rem 0 0 8px;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		color: var(--text-muted);
		line-height: 1.2;
	}

	.location-line :global(.location-pin) {
		flex-shrink: 0;
		color: var(--text-muted);
	}

	.profile-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.resume-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		background: transparent;
		border: none;
		border-radius: 0;
		color: var(--text-muted);
		text-decoration: none;
		cursor: pointer;
		transition:
			color 0.2s ease,
			transform 0.2s ease;
	}

	.resume-btn:hover,
	.resume-btn:focus-visible {
		color: var(--text);
		transform: scale(1.1);
		background: transparent;
	}

	.resume-label {
		position: absolute;
		bottom: 130%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 400;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
		z-index: 10;
	}

	:global(.dark) .resume-label {
		background: rgba(255, 255, 255, 0.9);
		color: #000;
	}

	.resume-btn:hover .resume-label,
	.resume-btn:focus-visible .resume-label {
		opacity: 1;
	}

	.content {
		position: relative;
		z-index: 10;
		padding: calc(22vh + 112px) 1rem 3rem;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.thought-line {
		position: relative;
		margin: 1.1rem 0 0 2px;
		display: inline-block;
		align-self: flex-start;
		width: fit-content;
		max-width: 100%;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		font-size: 1.05rem;
		color: #000000;
		background: #ede9fe;
		padding: 4px 10px;
		z-index: 1;
	}

	.thought-line::before {
		content: '';
		position: absolute;
		top: 12%;
		left: 4%;
		width: 92%;
		height: 76%;
		background: #ffb6c1;
		z-index: -1;
		border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
		transform: rotate(-1.5deg);
	}

	:global(.dark) .thought-line {
		color: #000000;
		background: rgba(88, 28, 135, 0.55);
	}

	:global(.dark) .thought-line::before {
		background: #ffb6c1;
	}

	.about {
		margin: 1.25rem 0 0;
		color: var(--text-muted);
		font-size: 1.02rem;
		line-height: 1.65;
	}

	.intro-text,
	.tech-text {
		margin: 0 0 1rem;
	}

	.intro-lead {
		font-weight: 700;
		color: var(--text);
	}

	.highlight {
		color: var(--text);
		font-weight: 500;
	}

	.skill-badge {
		color: var(--text);
		font-weight: 500;
		transition: color 0.2s ease;
		cursor: default;
	}

	.skill-badge:hover {
		color: var(--accent);
	}

	.cta-row,
	.social-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.song-row {
		margin-top: 0.85rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		gap: 0.65rem;
	}

	.social-block {
		margin-top: 1.1rem;
	}

	.social-heading {
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		font-weight: 400;
		color: var(--text-muted);
	}

	.social-heading span {
		font-weight: 600;
		color: var(--text);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.85rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--card-bg);
		color: var(--text-muted);
		text-decoration: none;
		font-size: 12px;
		font-weight: 500;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.pill:hover {
		color: var(--text);
		background: color-mix(in srgb, var(--card-bg) 70%, var(--text) 4%);
	}

	.pill.primary {
		color: var(--text);
		border-color: color-mix(in srgb, var(--border) 80%, var(--text) 20%);
	}

	.pill-icon {
		color: var(--text-muted);
	}

	.pill-icon :global(svg.nucleo-icon) {
		flex-shrink: 0;
		color: var(--text);
	}

	.section {
		position: relative;
		margin-top: 1.75rem;
		scroll-margin-top: 6rem;
	}

	.section-head {
		position: relative;
		padding: 0.55rem 0;
	}

	.section-head :global(.blueprint-line.bottom) {
		bottom: 0;
		top: auto;
	}

	.section-head :global(.blueprint-line:not(.bottom)) {
		top: 0;
	}

	.section-title {
		margin: 0;
		font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		font-weight: 500;
		font-size: 1.5rem;
		color: var(--text);
		letter-spacing: -0.02em;
	}

	.crumb {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.2s ease;
		display: inline-block;
	}

	.crumb:hover {
		color: var(--text);
	}

	.dot {
		position: absolute;
		bottom: 0;
		width: 2px;
		height: 2px;
		background: var(--blueprint-node);
		transform: translateY(50%);
		pointer-events: none;
	}

	.dot.left {
		left: -1rem;
		transform: translate(-50%, 50%);
	}

	.dot.right {
		right: -1rem;
		transform: translate(50%, 50%);
	}

	.projects-grid {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		padding: 1.25rem 0 1.5rem;
	}

	.grid-vrail {
		display: none;
	}

	.project-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: color-mix(in srgb, var(--card-bg) 80%, transparent);
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.project-card:hover {
		border-color: color-mix(in srgb, var(--border) 60%, var(--text) 20%);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
		transform: translateY(-1px);
	}

	.project-title {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
	}

	.project-meta,
	.project-year {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.gitcal-wrap {
		padding: 1rem 0 0.5rem;
		overflow-x: auto;
	}

	.skills-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1.25rem 0 0.25rem;
	}

	.skill-chip {
		flex-grow: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		border: 1px solid var(--blueprint-line);
		background: var(--card-bg);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
		min-width: 0;
	}

	.skill-chip-icon {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		object-fit: contain;
		display: block;
		opacity: 0.85;
	}

	:global(.dark) .skill-chip-icon:not(.branded) {
		filter: invert(1);
		opacity: 0.9;
	}

	:global(.dark) .skill-chip-icon.invert-dark {
		filter: invert(1);
		opacity: 0.95;
	}

	.skill-chip-icon.branded {
		width: 16px;
		height: 16px;
	}

	.skill-chip :global(.skill-chip-fallback) {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
		line-height: 1;
		color: var(--text);
		border: 1px solid var(--border);
		border-radius: 3px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.1rem 0 0.25rem;
	}

	.list-row {
		display: flex;
		justify-content: space-between;
		gap: 1.25rem;
		align-items: flex-start;
		text-decoration: none;
		color: inherit;
	}

	.edu-main {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		min-width: 0;
		flex: 1;
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

	.list-row:not(.static):hover .list-title {
		opacity: 0.75;
	}

	.list-title {
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
		transition: opacity 0.2s ease;
	}

	.list-sub {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.list-meta,
	.list-meta-block {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
		text-align: right;
		flex-shrink: 0;
	}

	.list-meta-block .list-meta + .list-meta {
		margin-top: 0.2rem;
	}

	.empty {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.view-all-wrap {
		display: flex;
		justify-content: center;
		padding: 1rem 0 0.25rem;
		position: relative;
	}

	.view-all {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--card-bg);
		color: var(--text-muted);
		text-decoration: none;
		font-size: 13px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		transition:
			color 0.2s ease,
			background 0.2s ease;
	}

	.view-all:hover {
		color: var(--text);
	}

	.view-all :global(.view-all-icon) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	@media (min-width: 768px) {
		.rail,
		.node {
			display: block;
		}

		.banner-cell,
		.profile-cell {
			left: 30%;
			right: 30%;
		}

		.avatar-inner {
			width: 80px;
			height: 80px;
		}

		.content {
			margin-left: 30%;
			margin-right: 30%;
		}

		.projects-grid {
			grid-template-columns: 1fr 1fr;
			gap: 1.25rem 1.5rem;
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}

		.grid-vrail {
			display: block;
			position: absolute;
			top: 0;
			bottom: 1rem;
			left: 50%;
			width: 0;
			border-right: 1px solid var(--blueprint-line);
			transform: translateX(-50%);
			mask-image: repeating-linear-gradient(
				to bottom,
				black 0,
				black 1px,
				transparent 1px,
				transparent 6px
			);
			-webkit-mask-image: repeating-linear-gradient(
				to bottom,
				black 0,
				black 1px,
				transparent 1px,
				transparent 6px
			);
		}
	}
</style>
