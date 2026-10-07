<script>
	import NucleoIcon from '$lib/components/NucleoIcon.svelte';

	/** @type {{ name: string, url: string, icon: 'github' | 'linkedin' | 'x' | 'envelope' }[]} */
	const links = [
		{ name: 'GitHub', url: 'https://github.com/mannlohchab', icon: 'github' },
		{ name: 'LinkedIn', url: 'https://linkedin.com/in/mann-lohchab-4bb336364', icon: 'linkedin' },
		{ name: 'X', url: 'https://x.com/manns_dream', icon: 'x' },
		{ name: 'Email', url: 'mailto:mannworks.dev@gmail.com', icon: 'envelope' }
	];
</script>

<footer class="footer">
	<div class="footer-content">
		<div class="footer-left">
			<h4 class="footer-brand">mann lohchab.</h4>
			<p class="footer-tagline">Building elegant software & digital products.</p>
		</div>

		<div class="footer-right">
			<div class="links">
				{#each links as link}
					<a
						class="icon"
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.name}
					>
						<NucleoIcon name={link.icon} size={20} />
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="footer-bottom">
		<p class="copyright">© {new Date().getFullYear()} Mann Lohchab. All rights reserved.</p>
		<p class="built-with">
			Built with <a href="https://svelte.dev" target="_blank" class="svelte-link" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/svelte/ff3e00" alt="Svelte logo" class="svelte-footer-icon" loading="lazy" />Svelte</a>
		</p>
	</div>
</footer>

<style>
	.footer {
		margin-top: 4rem;
		padding: 2.5rem 1rem 2rem;
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 720px;
		margin-inline: auto;
		width: 100%;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.footer-brand {
		position: relative;
		display: inline-block;
		margin: 0 0 8px;
		font-family: 'Playfair Display', 'Georgia', serif;
		font-style: italic;
		font-size: 1.4rem;
		color: #000;
		font-weight: 500;
		padding: 4px 10px;
		z-index: 1;
	}

	.footer-brand::before {
		content: '';
		position: absolute;
		top: 10%;
		left: 0;
		width: 100%;
		height: 80%;
		background: #ffb6c1;
		z-index: -1;
		border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
		transform: rotate(-1.5deg);
	}

	:global(.dark) .footer-brand {
		color: #000;
	}

	.footer-tagline {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	.links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		color: var(--text);
		opacity: 0.85;
		transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
	}

	.icon :global(svg.nucleo-icon) {
		width: 20px;
		height: 20px;
	}

	.icon:hover {
		opacity: 1;
		color: var(--text);
		transform: translateY(-2px);
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px dashed var(--border);
	}

	.copyright, .built-with {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0;
	}

	.svelte-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--text);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.svelte-footer-icon {
		width: 14px;
		height: 14px;
	}

	.svelte-link:hover {
		color: #ff3e00;
	}

	@media (max-width: 640px) {
		.footer-content {
			flex-direction: column;
			align-items: flex-start;
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
