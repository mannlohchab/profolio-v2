<script lang="ts">
	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let className = '';
</script>

<div
	class="blueprint-line {direction} {className}"
	aria-hidden="true"
></div>

<style>
	.blueprint-line {
		pointer-events: none;
		position: absolute;
		z-index: 1;
	}

	.horizontal {
		left: -100vw;
		right: -100vw;
		height: 0;
		border-bottom: 1px solid var(--blueprint-line);
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

	.vertical {
		top: 0;
		bottom: 0;
		width: 0;
		border-right: 1px solid var(--blueprint-line);
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
</style>
