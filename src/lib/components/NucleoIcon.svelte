<script lang="ts">
	/**
	 * Nucleo icons (https://nucleoapp.com/) — SVG paths from Nucleo Social Media,
	 * Micro Bold, and Sharp libraries, rendered as Svelte components.
	 */
	export type NucleoIconName =
		| 'github'
		| 'linkedin'
		| 'x'
		| 'envelope'
		| 'moon'
		| 'sun'
		| 'chevron-down'
		| 'chevron-right'
		| 'arrow-up-right'
		| 'pin'
		| 'file'
		| 'clock'
		| 'calendar'
		| 'disc'
		| 'music'
		| 'headphones'
		| 'play'
		| 'pause'
		| 'youtube';

	interface Props {
		name: NucleoIconName;
		size?: number | string;
		class?: string;
		title?: string;
	}

	let { name, size = 20, class: className = '', title }: Props = $props();

	const sizeAttr = $derived(typeof size === 'number' ? String(size) : size);
	const sizeCss = $derived(
		typeof size === 'number' ? `${size}px` : /\d+$/.test(size) ? `${size}px` : size
	);
	/** Inline size beats global `svg { height: auto }` so icons keep a stable box. */
	const boxStyle = $derived(`width:${sizeCss};height:${sizeCss};flex-shrink:0;display:block;`);
</script>

{#if name === 'github'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 32 32"
		fill="currentColor"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z"
		/>
	</svg>
{:else if name === 'linkedin'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 32 32"
		fill="currentColor"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			fill-rule="evenodd"
			d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
		/>
	</svg>
{:else if name === 'x'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 32 32"
		fill="currentColor"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"
		/>
	</svg>
{:else if name === 'envelope'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="m3,7l6.504,3.716c.307.176.685.176.992,0l6.504-3.716"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<rect
			x="3"
			y="4"
			width="14"
			height="12"
			rx="3"
			ry="3"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'moon'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 24 24"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M3 11.9232C3 17.4885 7.5372 22 13.1341 22C16.9486 22 20.2708 19.9045 22 16.8081C21.4246 16.909 20.8325 16.9616 20.228 16.9616C14.6311 16.9616 10.0939 12.4501 10.0939 6.88486C10.0939 5.11247 10.5541 3.44695 11.3621 2C6.61007 2.83329 3 6.95906 3 11.9232Z"
			stroke="currentColor"
			stroke-width="2"
			stroke-miterlimit="10"
			stroke-linecap="square"
			stroke-linejoin="bevel"
		/>
	</svg>
{:else if name === 'sun'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<circle cx="10" cy="10" r="4" fill="currentColor" stroke-width="0" />
		<line x1="10" y1="2" x2="10" y2="3.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="15.657" y1="4.343" x2="14.596" y2="5.404" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="18" y1="10" x2="16.5" y2="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="15.657" y1="15.657" x2="14.596" y2="14.596" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="10" y1="18" x2="10" y2="16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="4.343" y1="15.657" x2="5.404" y2="14.596" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="2" y1="10" x2="3.5" y2="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		<line x1="4.343" y1="4.343" x2="5.404" y2="5.404" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
	</svg>
{:else if name === 'chevron-down'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<polyline
			points="3.5 7.5 10 14 16.5 7.5"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'chevron-right'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<polyline
			points="7.5 16.5 14 10 7.5 3.5"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'arrow-up-right'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<line
			x1="4"
			y1="16"
			x2="16"
			y2="4"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<polyline
			points="16 11 16 4 9 4"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'pin'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="m4,9.0053c0-3.3166,2.6863-6.0053,6-6.0053s6,2.6887,6,6.0053-3.1146,6.0287-4.8557,7.5611c-.6568.5781-1.6318.5781-2.2886,0-1.7412-1.5324-4.8557-4.5585-4.8557-7.5611Z"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<circle
			cx="10"
			cy="9"
			r="1"
			fill="currentColor"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'file'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="m4,7h3c.552,0,1-.448,1-1v-3"
			stroke="currentColor"
			stroke-linejoin="round"
			stroke-width="2"
			fill="none"
		/>
		<line
			x1="12.5"
			y1="9"
			x2="10"
			y2="9"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<line
			x1="12.5"
			y1="13"
			x2="7.5"
			y2="13"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<path
			d="m16,14v-8c0-1.657-1.343-3-3-3h-4.586c-.265,0-.52.105-.707.293l-3.414,3.414c-.188.188-.293.442-.293.707v6.586c0,1.657,1.343,3,3,3h6c1.657,0,3-1.343,3-3Z"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'clock'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<circle
			cx="10"
			cy="10"
			r="7"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<path
			d="M10 6.25V10l2.75 1.65"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'calendar'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<rect
			x="3"
			y="4.5"
			width="14"
			height="12.5"
			rx="2.5"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<path
			d="M3 8.25h14M7 2.75v3M13 2.75v3"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'disc'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<circle
			cx="10"
			cy="10"
			r="7"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<circle
			cx="10"
			cy="10"
			r="2.25"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'music'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M8 14.5V5.4l8-1.6v9.1"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<circle cx="6.25" cy="14.75" r="2.25" fill="currentColor" />
		<circle cx="14.25" cy="13.25" r="2.25" fill="currentColor" />
	</svg>
{:else if name === 'headphones'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M4.5 11.25v-1a5.5 5.5 0 0 1 11 0v1"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<path
			d="M4.5 11.25v3A1.75 1.75 0 0 0 6.25 16H7.5v-5.5H6.25A1.75 1.75 0 0 0 4.5 11.25Z"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
		<path
			d="M15.5 11.25v3A1.75 1.75 0 0 1 13.75 16H12.5v-5.5h1.25A1.75 1.75 0 0 1 15.5 11.25Z"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
		/>
	</svg>
{:else if name === 'play'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M6.5 4.35v11.3L16.25 10 6.5 4.35Z"
			fill="currentColor"
			stroke="currentColor"
			stroke-linejoin="round"
			stroke-width="1.5"
		/>
	</svg>
{:else if name === 'pause'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 20 20"
		fill="none"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<rect x="5" y="4" width="3.25" height="12" rx="1" fill="currentColor" />
		<rect x="11.75" y="4" width="3.25" height="12" rx="1" fill="currentColor" />
	</svg>
{:else if name === 'youtube'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={sizeAttr}
		height={sizeAttr}
		viewBox="0 0 24 24"
		fill="currentColor"
		class="nucleo-icon {className}"
		style={boxStyle}
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
	>
		{#if title}<title>{title}</title>{/if}
		<path
			d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"
		/>
	</svg>
{/if}
