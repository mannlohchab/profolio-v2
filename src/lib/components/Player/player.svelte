<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';

	/** Card shows track metadata; playback uses the linked YouTube audio. */
	const song = {
		title: 'M.',
		artist: 'Anıl Emre Daldal',
		album: 'M. — Single',
		year: '2020',
		duration: '3:43',
		streams: '6,747,370',
		cover: '/music/anil-emre-daldal-m-cover.jpg',
		avatar: '/music/anil-emre-daldal-avatar.jpg',
		youtube: 'https://youtu.be/41IaR01vEb0',
		videoId: '41IaR01vEb0'
	};

	let playing = false;
	let listening = 0;
	let ready = false;
	let host: HTMLDivElement;
	/** @type {any} */
	let player = null;
	let destroyed = false;

	function loadYouTubeApi() {
		return new Promise((resolve) => {
			// @ts-ignore
			if (window.YT?.Player) {
				resolve(undefined);
				return;
			}
			const prev = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				if (typeof prev === 'function') prev();
				resolve(undefined);
			};
			if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
				const tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				document.head.appendChild(tag);
			}
		});
	}

	onMount(() => {
		let cancelled = false;
		(async () => {
			await loadYouTubeApi();
			if (cancelled || destroyed || !host) return;
			// @ts-ignore
			player = new window.YT.Player(host, {
				videoId: song.videoId,
				width: 240,
				height: 135,
				playerVars: {
					autoplay: 0,
					controls: 0,
					disablekb: 1,
					fs: 0,
					modestbranding: 1,
					playsinline: 1,
					rel: 0,
					origin: window.location.origin
				},
				events: {
					onReady: () => {
						ready = true;
					},
					onStateChange: (event) => {
						// @ts-ignore
						const YT = window.YT;
						if (event.data === YT.PlayerState.PLAYING) {
							playing = true;
						} else if (
							event.data === YT.PlayerState.PAUSED ||
							event.data === YT.PlayerState.ENDED ||
							event.data === YT.PlayerState.CUED
						) {
							playing = false;
						}
					}
				}
			});
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		destroyed = true;
		try {
			player?.destroy?.();
		} catch {
			/* ignore */
		}
		player = null;
	});

	function toggle() {
		if (!player?.playVideo) return;
		if (playing) {
			player.pauseVideo();
			playing = false;
		} else {
			player.playVideo();
			playing = true;
			listening += 1;
		}
	}
</script>

<div class="track-card" class:playing>
	<button
		type="button"
		class="main"
		on:click={toggle}
		disabled={!ready}
		aria-label={playing ? 'Pause song' : 'Play full song'}
	>
		<span class="cover-wrap">
			<span class="cover-frame">
				<span class="cover-inner">
					<img src={song.cover} alt="" class="cover" width="64" height="64" />
				</span>
				<span class="cover-btn" aria-hidden="true">
					{#if playing}
						<NucleoIcon name="pause" size={11} class="cover-icon" />
					{:else}
						<NucleoIcon name="play" size={11} class="cover-icon play-icon" />
					{/if}
				</span>
			</span>
		</span>
		<div class="info">
			<h3 class="title">{song.title}</h3>
			<div class="artist">
				<img src={song.avatar} alt="" class="avatar" width="16" height="16" />
				<span>{song.artist}</span>
			</div>
			<div class="meta">
				<span class="meta-item">
					<NucleoIcon name="clock" size={13} class="meta-icon" />
					{song.duration}
				</span>
				<span class="meta-item">
					<NucleoIcon name="calendar" size={13} class="meta-icon" />
					{song.year}
				</span>
				<span class="meta-item">
					<NucleoIcon name="disc" size={13} class="meta-icon" />
					{song.album}
				</span>
			</div>
		</div>
	</button>

	<div class="stats">
		<span class="stat">
			<NucleoIcon name="music" size={14} class="stat-icon" />
			{song.streams} Streams
		</span>
		<span class="stat listening" class:live={playing}>
			<NucleoIcon name="headphones" size={14} class="stat-icon" />
			{#if playing}
				Listening now
			{:else if listening > 0}
				{listening.toLocaleString()} Listening
			{:else}
				Tap to play
			{/if}
			<span class="eq" class:on={playing} aria-hidden="true">
				<span></span><span></span><span></span>
			</span>
		</span>
		<a
			class="yt-link"
			href={song.youtube}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Watch on YouTube"
			on:click|stopPropagation
		>
			<NucleoIcon name="youtube" size={15} class="yt-icon" />
			YouTube
		</a>
	</div>

	<!-- Hidden YouTube host for full-song playback -->
	<div class="yt-host" aria-hidden="true">
		<div bind:this={host}></div>
	</div>
</div>

<style>
	.track-card {
		position: relative;
		width: min(100%, 380px);
		border-radius: 16px;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
		text-align: left;
	}

	:global(.dark) .track-card {
		background: #111111;
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
	}

	.main {
		display: flex;
		gap: 0.85rem;
		width: 100%;
		padding: 0.9rem;
		border: none;
		background: transparent;
		color: inherit;
		cursor: pointer;
		text-align: left;
		font: inherit;
	}

	.main:disabled {
		cursor: wait;
		opacity: 0.85;
	}

	.main:hover .title {
		opacity: 0.8;
	}

	.cover-wrap {
		display: block;
		flex-shrink: 0;
	}

	.cover-frame {
		position: relative;
		display: block;
		padding: 3px;
		border: 1.5px solid var(--blueprint-line);
		border-radius: 8px;
	}

	.cover-inner {
		display: block;
		width: 64px;
		height: 64px;
		border-radius: 5px;
		overflow: hidden;
		background: var(--card-bg);
	}

	.cover {
		width: 64px;
		height: 64px;
		max-width: none;
		object-fit: cover;
		display: block;
	}

	.cover-btn {
		position: absolute;
		right: 5px;
		bottom: 5px;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.62);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		color: #fff;
	}

	:global(.cover-icon.play-icon) {
		margin-left: 1px;
	}

	.info {
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.28rem;
	}

	.title {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text);
		line-height: 1.2;
	}

	.artist {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.avatar {
		width: 16px;
		height: 16px;
		border-radius: 999px;
		object-fit: cover;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-top: 0.15rem;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		font-size: 0.72rem;
		color: #7c6bb5;
		white-space: nowrap;
	}

	:global(.dark) .meta-item {
		color: #a78bfa;
	}

	:global(.meta-icon) {
		opacity: 0.9;
	}

	.stats {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.55rem 0.9rem;
		background: #f3f3f5;
		border-top: 1px solid rgba(0, 0, 0, 0.04);
		font-size: 0.75rem;
		color: var(--text-muted);
		flex-wrap: wrap;
	}

	:global(.dark) .stats {
		background: #1a1a1a;
		border-top-color: rgba(255, 255, 255, 0.06);
	}

	.stat {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	:global(.stat-icon) {
		opacity: 0.85;
	}

	.listening {
		gap: 0.4rem;
	}

	.listening.live {
		color: #22c55e;
		font-weight: 600;
	}

	.listening.live :global(.stat-icon) {
		opacity: 1;
	}

	.yt-link {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
	}

	.yt-link:hover {
		color: #ff0033;
	}

	.yt-link:hover :global(.yt-icon) {
		color: #ff0033;
	}

	.eq {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 11px;
	}

	.eq span {
		width: 2px;
		height: 40%;
		border-radius: 1px;
		background: currentColor;
		opacity: 0.55;
	}

	.eq span:nth-child(2) {
		height: 70%;
	}
	.eq span:nth-child(3) {
		height: 100%;
	}

	.eq.on span {
		animation: eq 0.7s ease-in-out infinite;
		opacity: 0.9;
	}
	.eq.on span:nth-child(2) {
		animation-delay: 0.12s;
	}
	.eq.on span:nth-child(3) {
		animation-delay: 0.24s;
	}

	@keyframes eq {
		0%,
		100% {
			transform: scaleY(0.45);
		}
		50% {
			transform: scaleY(1);
		}
	}

	/* Keep a real-sized offscreen host — YouTube blocks tiny/display:none players. */
	.yt-host {
		position: absolute;
		left: -10000px;
		top: 0;
		width: 240px;
		height: 135px;
		overflow: hidden;
		pointer-events: none;
	}
</style>
