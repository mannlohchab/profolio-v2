<script lang="ts">
	import { onDestroy } from 'svelte';
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';

	export let name: string;
	export let handle: string;
	export let avatar: string;
	export let avatarDark: string | null = null;
	export let bio: string;
	export let location = '';
	export let layout: 'flat' | 'banner' = 'flat';
	export let bannerSrc: string | null = null;
	export let stats: { value: string | number; label: string }[] = [];

	let open = false;
	let openTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;

	function clearTimers() {
		if (openTimer) clearTimeout(openTimer);
		if (closeTimer) clearTimeout(closeTimer);
		openTimer = null;
		closeTimer = null;
	}

	function scheduleOpen() {
		clearTimers();
		openTimer = setTimeout(() => {
			open = true;
		}, 80);
	}

	function scheduleClose() {
		clearTimers();
		closeTimer = setTimeout(() => {
			open = false;
		}, 120);
	}

	onDestroy(clearTimers);
</script>

<span
	class="hover-root"
	on:mouseenter={scheduleOpen}
	on:mouseleave={scheduleClose}
	on:focusin={scheduleOpen}
	on:focusout={scheduleClose}
>
	<slot />

	{#if open}
		<div class="card" role="tooltip" class:banner-layout={layout === 'banner'}>
			{#if layout === 'banner'}
				<div class="banner">
					{#if bannerSrc}
						<img src={bannerSrc} alt="" class="banner-img" />
					{/if}
				</div>
				<div class="banner-body">
					<div class="avatar-overlap">
						{#if avatarDark}
							<img src={avatar} alt="" class="avatar large avatar-light" />
							<img src={avatarDark} alt="" class="avatar large avatar-dark" />
						{:else}
							<img src={avatar} alt="" class="avatar large" />
						{/if}
					</div>
					<div class="identity">
						<h3 class="card-name">{name}</h3>
						<span class="card-handle">{handle}</span>
					</div>
					<p class="card-bio">{bio}</p>
					{#if location}
						<div class="card-location">
							<NucleoIcon name="pin" size={12} class="pin" />
							<span>{location}</span>
						</div>
					{/if}
					{#if stats.length}
						<div class="card-stats">
							{#each stats as stat}
								<div class="stat">
									<span class="stat-value">{stat.value}</span>
									<span class="stat-label">{stat.label}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<div class="flat-body">
					<div class="flat-top">
						{#if avatarDark}
							<img src={avatar} alt="" class="avatar avatar-light" />
							<img src={avatarDark} alt="" class="avatar avatar-dark" />
						{:else}
							<img src={avatar} alt="" class="avatar" />
						{/if}
						<div class="identity">
							<h3 class="card-name">{name}</h3>
							<span class="card-handle">{handle}</span>
						</div>
					</div>
					<p class="card-bio">{bio}</p>
					{#if location}
						<div class="card-location">
							<NucleoIcon name="pin" size={12} class="pin" />
							<span>{location}</span>
						</div>
					{/if}
					{#if stats.length}
						<div class="card-stats">
							{#each stats as stat}
								<div class="stat">
									<span class="stat-value">{stat.value}</span>
									<span class="stat-label">{stat.label}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</span>

<style>
	.hover-root {
		position: relative;
		display: inline-block;
	}

	.card {
		position: absolute;
		left: 50%;
		top: calc(100% + 8px);
		transform: translateX(-50%);
		z-index: 80;
		width: min(250px, 80vw);
		border-radius: 12px;
		overflow: hidden;
		background: color-mix(in srgb, var(--bg) 96%, transparent);
		border: 1px solid var(--border);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
		backdrop-filter: blur(10px);
		animation: card-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: auto;
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0) scale(1);
		}
	}

	.flat-body {
		padding: 1rem;
	}

	.flat-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 9999px;
		object-fit: cover;
		border: 1px solid var(--border);
		background: var(--card-bg);
		flex-shrink: 0;
		filter: grayscale(0.15) contrast(1.05);
	}

	.avatar.large {
		width: 56px;
		height: 56px;
		border: 2px solid var(--bg);
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

	.identity {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.card-name {
		margin: 0;
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text);
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-handle {
		margin-top: 2px;
		font-size: 11.5px;
		font-family: 'Space Mono', ui-monospace, monospace;
		color: var(--text-muted);
		line-height: 1;
	}

	.card-bio {
		margin: 0.75rem 0 0;
		font-size: 12px;
		line-height: 1.45;
		color: var(--text);
	}

	.card-location {
		margin-top: 0.55rem;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 10.5px;
		color: var(--text-muted);
	}

	.card-location :global(.pin) {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	.card-stats {
		margin-top: 0.85rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		display: flex;
		gap: 1.1rem;
		font-size: 12px;
		color: var(--text-muted);
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-value {
		font-weight: 800;
		color: var(--text);
	}

	.banner {
		width: 100%;
		height: 64px;
		background: linear-gradient(90deg, #ede9fe, #f3e8ff);
		overflow: hidden;
	}

	:global(.dark) .banner {
		background: linear-gradient(90deg, #1e1033, #2e1065);
	}

	.banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.banner-body {
		padding: 0 0.9rem 0.9rem;
	}

	.avatar-overlap {
		height: 28px;
		position: relative;
		margin-bottom: 0.35rem;
	}

	.avatar-overlap .avatar {
		position: absolute;
		top: -28px;
		left: 0;
	}
</style>
