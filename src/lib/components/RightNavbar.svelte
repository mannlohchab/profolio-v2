<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';

	type Item = { id: string; label: string };
	type Point = { x: number; y: number };
	type Geometry = { nodes: Point[]; d: string; width: number; height: number };
	type Spring = {
		value: number;
		velocity: number;
		target: number;
		stiffness: number;
		damping: number;
		mass: number;
	};

	const items: Item[] = [
		{ id: 'contributions', label: 'Contributions' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'skills', label: 'Skills' },
		{ id: 'blogs', label: 'Blog' },
		{ id: 'education', label: 'Education' }
	];

	const RAIL_X = 5;
	const LABEL_GAP = 14;
	const TURN_SLACK = 2;
	const PLANE = 'M12 2 20.5 21 12 17.5 3.5 21z';
	const PLANE_HOLE = 4;
	const OFFSET = 96;

	const travel: Spring = {
		value: 0,
		velocity: 0,
		target: 0,
		stiffness: 140,
		damping: 26,
		mass: 0.6
	};
	const turn: Spring = {
		value: 180,
		velocity: 0,
		target: 180,
		stiffness: 260,
		damping: 30,
		mass: 1
	};

	let listEl: HTMLUListElement | undefined;
	let pathEl: SVGPathElement | undefined;
	let filledEl: SVGPathElement | undefined;
	let planeEl: HTMLDivElement | undefined;
	let holeA: SVGCircleElement | undefined;
	let holeB: SVGCircleElement | undefined;
	const rowEls: (HTMLLIElement | null)[] = [];

	let geometry: Geometry | undefined = undefined;
	let reached = 1;
	let reduceMotion = false;

	const lengths: number[] = [];
	let total = 0;
	let placed = false;
	let pinned: number | null = null;
	let userScrolled = false;
	let facing: 1 | -1 = 1;
	let turnFrom = 0;
	let heading = 180;
	let planeX = 0;
	let planeY = 0;
	let raf = 0;
	let lastFrame = 0;
	let measureToken = 0;

	$: active = Math.max(0, reached - 1);
	$: maskId = 'rail-toc';

	function bindRow(node: HTMLLIElement, index: number) {
		rowEls[index] = node;
		return {
			destroy() {
				if (rowEls[index] === node) rowEls[index] = null;
			}
		};
	}

	function buildPath(nodes: Point[]) {
		const points: Point[] = [{ x: nodes[0].x, y: 0 }, nodes[0]];
		for (let i = 1; i < nodes.length; i++) {
			const from = nodes[i - 1];
			const to = nodes[i];
			if (from.x !== to.x) {
				const bend = (to.y - from.y) * 0.3;
				points.push({ x: from.x, y: from.y + bend }, { x: to.x, y: to.y - bend });
			}
			points.push(to);
		}
		return points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
	}

	function lengthAtY(path: SVGPathElement, length: number, y: number) {
		let lo = 0;
		let hi = length;
		for (let i = 0; i < 24; i++) {
			const mid = (lo + hi) / 2;
			if (path.getPointAtLength(mid).y < y) lo = mid;
			else hi = mid;
		}
		return hi;
	}

	function stepSpring(spring: Spring, dt: number) {
		const force = spring.stiffness * (spring.target - spring.value);
		const accel = (force - spring.damping * spring.velocity) / spring.mass;
		spring.velocity += accel * dt;
		spring.value += spring.velocity * dt;
		return Math.abs(spring.value - spring.target) > 0.05 || Math.abs(spring.velocity) > 0.05;
	}

	function pose(distance: number) {
		if (!pathEl || !total) return;
		const at = pathEl.getPointAtLength(distance);
		const behind = pathEl.getPointAtLength(Math.max(0, distance - 1));
		const ahead = pathEl.getPointAtLength(Math.min(total, distance + 1));
		planeX = at.x;
		planeY = at.y;
		for (const hole of [holeA, holeB]) {
			hole?.setAttribute('cx', String(at.x));
			hole?.setAttribute('cy', String(at.y));
		}
		const angle =
			(Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI +
			90 +
			(facing < 0 ? 180 : 0);
		heading = angle + 360 * Math.round((heading - angle) / 360);
		turn.target = heading;
		if (filledEl) {
			filledEl.style.strokeDasharray = `${total}`;
			filledEl.style.strokeDashoffset = `${total * (1 - distance / total)}`;
		}
		const rotation = reduceMotion ? heading : turn.value;
		if (planeEl) {
			planeEl.style.transform = `translate(${planeX}px, ${planeY}px) rotate(${rotation}deg)`;
		}
		const nextReached = lengths.filter((n) => n <= distance + 0.5).length;
		if (nextReached !== reached) reached = nextReached;
	}

	function startLoop() {
		if (reduceMotion || raf) return;
		lastFrame = 0;
		raf = requestAnimationFrame(frame);
	}

	function frame(now: number) {
		const dt = lastFrame ? Math.min(0.032, (now - lastFrame) / 1000) : 1 / 60;
		lastFrame = now;
		const travelMoving = stepSpring(travel, dt);
		const turnMoving = stepSpring(turn, dt);
		pose(travel.value);
		raf = travelMoving || turnMoving ? requestAnimationFrame(frame) : 0;
	}

	function jumpTravel(next: number) {
		travel.value = next;
		travel.velocity = 0;
		travel.target = next;
	}

	function aim(next: number) {
		if ((next - turnFrom) * facing > 0) turnFrom = next;
		else if (Math.abs(next - turnFrom) > TURN_SLACK) {
			facing = facing > 0 ? -1 : 1;
			turnFrom = next;
		}
		travel.target = next;
		if (reduceMotion) {
			jumpTravel(next);
			pose(next);
			turn.value = heading;
			turn.target = heading;
			turn.velocity = 0;
			return;
		}
		startLoop();
	}

	function sync() {
		if (!lengths.length) return;

		if (pinned !== null) {
			aim(lengths[pinned] ?? lengths[0]);
			return;
		}

		const scrollTop = window.scrollY;
		const viewHeight = window.innerHeight;
		const scrollHeight = document.documentElement.scrollHeight;
		const remaining = Math.max(0, scrollHeight - viewHeight - scrollTop);
		const line = Math.min(OFFSET, scrollTop);
		const anchor = line + Math.max(0, viewHeight - line - remaining);

		const tops = items.map((item) => {
			const el = document.getElementById(item.id);
			return el ? el.getBoundingClientRect().top : Infinity;
		});

		const index = tops.findLastIndex((top) => top <= anchor);
		let next: number;
		if (index === -1) next = lengths[0];
		else if (index === lengths.length - 1) next = lengths[index];
		else {
			const span = tops[index + 1] - tops[index];
			const progress = span > 0 ? (anchor - tops[index]) / span : 0;
			next = lengths[index] + Math.min(1, Math.max(0, progress)) * (lengths[index + 1] - lengths[index]);
		}

		aim(next);
		if (!placed) {
			placed = true;
			jumpTravel(next);
			pose(next);
			turn.value = heading;
			turn.target = heading;
			turn.velocity = 0;
		}
	}

	async function measure() {
		const token = ++measureToken;
		const list = listEl;
		if (!list) return;

		const nodes = items.map((item, i) => {
			const row = rowEls[i];
			return {
				x: RAIL_X,
				y: row ? row.offsetTop + row.offsetHeight / 2 : 0
			};
		});
		if (!nodes.length || nodes.every((node) => node.y === 0)) return;

		geometry = {
			nodes,
			d: buildPath(nodes),
			width: Math.max(...nodes.map((node) => node.x)) + RAIL_X + 4,
			height: list.offsetHeight
		};
		await tick();
		if (token !== measureToken || !pathEl) return;

		total = pathEl.getTotalLength();
		lengths.length = 0;
		for (const node of geometry.nodes) lengths.push(lengthAtY(pathEl, total, node.y));
		sync();
		pose(reduceMotion ? travel.target : travel.value);
	}

	function select(index: number, event: MouseEvent) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
		const el = document.getElementById(items[index].id);
		if (!el) return;
		event.preventDefault();
		pinned = index;
		userScrolled = false;
		sync();
		const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
		window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
	}

	onMount(() => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = motionQuery.matches;
		const onMotion = (event: MediaQueryListEvent) => {
			reduceMotion = event.matches;
		};
		motionQuery.addEventListener('change', onMotion);

		const onIntent = () => {
			userScrolled = true;
		};
		const onScroll = () => {
			if (pinned !== null && userScrolled) pinned = null;
			sync();
		};

		void measure();
		const ro = new ResizeObserver(() => {
			void measure();
		});
		if (listEl) ro.observe(listEl);
		document.fonts?.ready.then(() => void measure()).catch(() => {});

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('wheel', onIntent, { passive: true });
		window.addEventListener('touchstart', onIntent, { passive: true });
		window.addEventListener('pointerdown', onIntent);
		window.addEventListener('keydown', onIntent);
		window.addEventListener('resize', sync);

		return () => {
			measureToken++;
			if (raf) cancelAnimationFrame(raf);
			ro.disconnect();
			motionQuery.removeEventListener('change', onMotion);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('wheel', onIntent);
			window.removeEventListener('touchstart', onIntent);
			window.removeEventListener('pointerdown', onIntent);
			window.removeEventListener('keydown', onIntent);
			window.removeEventListener('resize', sync);
		};
	});
</script>

{#if $page.url.pathname === '/'}
	<div class="right-nav-root">
		<nav class="right-nav" aria-label="Index">
			<p class="index-label">
				<svg
					viewBox="0 0 16 16"
					class="index-icon"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M2 4h12M2 8h8M2 12h10" />
				</svg>
				Index
			</p>

			<ul class="rail-list" bind:this={listEl}>
				{#if geometry}
					<svg
						class="rail"
						width={geometry.width}
						height={geometry.height}
						aria-hidden="true"
					>
						<linearGradient
							id="{maskId}-fade"
							gradientUnits="userSpaceOnUse"
							x1="0"
							y1="0"
							x2="0"
							y2={geometry.nodes[0].y - 4}
						>
							<stop offset="0" stop-color="black" />
							<stop offset="1" stop-color="white" />
						</linearGradient>
						<mask
							id={maskId}
							maskUnits="userSpaceOnUse"
							x="-8"
							y="-8"
							width={geometry.width + 16}
							height={geometry.height + 16}
						>
							<rect
								x="-8"
								y="-8"
								width={geometry.width + 16}
								height={geometry.height + 16}
								fill="url(#{maskId}-fade)"
							/>
							{#each geometry.nodes as node, i (i)}
								<circle cx={node.x} cy={node.y} r="4" fill="black" />
							{/each}
							<circle bind:this={holeA} r={PLANE_HOLE} fill="black" />
						</mask>
						<mask
							id="{maskId}-nodes"
							maskUnits="userSpaceOnUse"
							x="-8"
							y="-8"
							width={geometry.width + 16}
							height={geometry.height + 16}
						>
							<rect
								x="-8"
								y="-8"
								width={geometry.width + 16}
								height={geometry.height + 16}
								fill="white"
							/>
							<circle bind:this={holeB} r={PLANE_HOLE} fill="black" />
						</mask>
						<g mask="url(#{maskId})">
							<path
								bind:this={pathEl}
								d={geometry.d}
								class="rail-dots"
								fill="none"
								stroke-width="1.25"
								stroke-dasharray="2 5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								bind:this={filledEl}
								d={geometry.d}
								class="rail-fill"
								fill="none"
								stroke-width="1.25"
								stroke-linejoin="round"
							/>
						</g>
						<g mask="url(#{maskId}-nodes)">
							{#each geometry.nodes as node, i (items[i].id)}
								<circle
									cx={node.x}
									cy={node.y}
									r={i < reached ? 3 : 3.25}
									stroke-width="1.25"
									class="node"
									class:covered={i < reached}
								/>
							{/each}
						</g>
					</svg>

					<div class="plane" bind:this={planeEl} aria-hidden="true">
						<svg viewBox="0 0 24 24" class="plane-icon">
							<path
								d={PLANE}
								fill="currentColor"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				{/if}

				{#each items as item, i (item.id)}
					<li use:bindRow={i}>
						<a
							href="#{item.id}"
							class="rail-link"
							class:active={i === active}
							aria-current={i === active ? 'location' : undefined}
							style:padding-left="{RAIL_X + LABEL_GAP}px"
							onclick={(event) => select(i, event)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
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
			width: max-content;
			pointer-events: auto;
			--rail: color-mix(in oklab, var(--text) 45%, var(--bg));
		}
	}

	.index-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.75rem;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		color: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.index-icon {
		width: 14px;
		height: 14px;
		margin-left: -2px;
		flex-shrink: 0;
	}

	.rail-list {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rail {
		position: absolute;
		left: 0;
		top: 0;
		overflow: visible;
		pointer-events: none;
	}

	.rail-dots {
		stroke: color-mix(in srgb, var(--text) 25%, transparent);
	}

	.rail-fill {
		stroke: var(--rail);
	}

	.node {
		fill: transparent;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		transition:
			fill 0.2s ease,
			stroke 0.2s ease;
	}

	.node.covered {
		fill: var(--rail);
		stroke: var(--rail);
	}

	.plane {
		position: absolute;
		left: 0;
		top: 0;
		width: 16px;
		height: 16px;
		margin-left: -8px;
		margin-top: -8px;
		pointer-events: none;
		color: var(--text);
		filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.35));
	}

	.plane-icon {
		display: block;
		width: 16px;
		height: 16px;
		overflow: visible;
	}

	.rail-link {
		display: block;
		width: 100%;
		box-sizing: border-box;
		padding: 0.375rem 0.5rem 0.375rem 0;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.25rem;
		letter-spacing: 0;
		text-align: left;
		text-decoration: none;
		color: color-mix(in srgb, var(--text) 50%, transparent);
		transition: color 0.2s ease;
	}

	.rail-link:hover {
		color: color-mix(in srgb, var(--text) 80%, transparent);
	}

	.rail-link.active {
		font-weight: 500;
		color: var(--text);
	}

	.rail-link:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--text) 20%, transparent);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.node,
		.rail-link {
			transition: none;
		}
	}
</style>
