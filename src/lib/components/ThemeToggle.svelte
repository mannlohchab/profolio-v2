<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';

	function toggleTheme() {
		theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
	}
</script>

<button
	onclick={toggleTheme}
	class="theme-toggle"
	aria-label="Toggle Theme"
>
	{#if $theme === 'dark'}
		<NucleoIcon name="sun" size={20} />
	{:else}
		<NucleoIcon name="moon" size={20} />
	{/if}
</button>

<style>
	.theme-toggle {
		background: transparent;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.theme-toggle:hover {
		color: var(--text);
		transform: scale(1.1);
	}
</style>
