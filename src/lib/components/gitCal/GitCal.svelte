<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';

	type Contribution = { date: string; count: number; level: number };
	type Day = { iso: string; count: number; level: number };
	type Week = Day[];

	export let username: string;
	export let months: number | string = 9;

	let weeks: Week[] = [];
	let total = 0;
	let loading = true;
	let error: string | null = null;
	let fits = false;

	let stageEl: HTMLElement;
	let clipEl: HTMLElement;
	let tipEl: HTMLElement;
	let activeDay: HTMLElement | null = null;
	let activeIso: string | null = null;
	let tipOpen = false;
	let tipInstant = false;
	let tipCount = '';
	let tipDate = '';

	$: monthCount = Number(months) || 9;
	$: periodLabel = monthCount === 1 ? 'month' : 'months';
	$: totalLabel = total.toLocaleString('en-US');
	$: ariaLabel = `GitHub contribution graph: ${totalLabel} contributions in the last ${monthCount} ${periodLabel}`;

	function iso(date: Date) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function countLabel(count: number) {
		if (count <= 0) return 'No contributions';
		if (count === 1) return '1 contribution';
		return `${count.toLocaleString('en-US')} contributions`;
	}

	function dateLabel(key: string) {
		const [y, m, d] = key.split('-').map(Number);
		const formatted = new Date(y, m - 1, d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		return `on ${formatted}`;
	}

	function buildWeeks(contributions: Contribution[], span: number) {
		const byDate = new Map(contributions.map((day) => [day.date, day]));
		const end = new Date();
		end.setHours(0, 0, 0, 0);
		const periodStart = new Date(end.getFullYear(), end.getMonth() - (span - 1), 1);
		const cursor = new Date(periodStart);
		cursor.setDate(cursor.getDate() - cursor.getDay());

		const nextWeeks: Week[] = [];
		let week: Week = [];
		let nextTotal = 0;
		const periodKey = iso(periodStart);
		const endKey = iso(end);

		while (iso(cursor) <= endKey) {
			const key = iso(cursor);
			const src = byDate.get(key);
			const count = src?.count ?? 0;
			const level = Math.min(4, Math.max(0, src?.level ?? 0));
			week.push({ iso: key, count, level });
			if (key >= periodKey) nextTotal += count;
			if (cursor.getDay() === 6) {
				nextWeeks.push(week);
				week = [];
			}
			cursor.setDate(cursor.getDate() + 1);
		}
		if (week.length) nextWeeks.push(week);
		return { nextWeeks, nextTotal };
	}

	function measure() {
		if (loading || !clipEl) return;
		const graph = clipEl.querySelector('.graph');
		if (!(graph instanceof HTMLElement)) return;
		fits = graph.scrollWidth <= clipEl.clientWidth + 1;
	}

	function placeTip(day: HTMLElement) {
		const stage = stageEl.getBoundingClientRect();
		const rect = day.getBoundingClientRect();
		const half = tipEl.offsetWidth / 2;
		const center = rect.left - stage.left + rect.width / 2;
		const x = Math.min(Math.max(center, half), stageEl.clientWidth - half);
		const y = rect.top - stage.top;
		tipEl.style.setProperty('--x', `${x}px`);
		tipEl.style.setProperty('--y', `${y}px`);
	}

	async function showTip(day: HTMLElement) {
		const iso = day.dataset.iso ?? '';
		if (!iso || iso === activeIso) return;
		const first = !tipOpen;
		tipInstant = first;
		tipCount = day.dataset.count ?? '';
		tipDate = day.dataset.date ?? '';
		activeDay = day;
		activeIso = iso;
		tipOpen = true;
		await tick();
		if (activeIso !== iso) return;
		placeTip(day);
		if (first) {
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					tipInstant = false;
				})
			);
		}
	}

	function hideTip() {
		tipOpen = false;
		tipInstant = false;
		activeDay = null;
		activeIso = null;
	}

	function onOver(event: PointerEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const day = target.closest<HTMLElement>('[data-count]');
		if (!day) return;
		showTip(day);
	}

	function onLeave(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		hideTip();
	}

	async function fetchCommits() {
		loading = true;
		error = null;
		weeks = [];
		total = 0;
		hideTip();

		try {
			const res = await fetch(
				`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
			);
			if (!res.ok) throw new Error(`Contributions API returned ${res.status}`);

			const json = (await res.json()) as {
				contributions?: Contribution[];
				error?: string;
			};
			if (json.error) throw new Error(json.error);

			const built = buildWeeks(Array.isArray(json.contributions) ? json.contributions : [], monthCount);
			weeks = built.nextWeeks;
			total = built.nextTotal;
		} catch (err) {
			console.error('Failed to load GitHub contributions', err);
			error = 'Unable to load contributions';
			weeks = [];
			total = 0;
		} finally {
			loading = false;
		}
	}

	afterUpdate(() => {
		measure();
	});

	onMount(() => {
		const ro = new ResizeObserver(() => measure());
		if (clipEl) ro.observe(clipEl);
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node) || !stageEl?.contains(target)) hideTip();
		};
		const onResize = () => measure();
		window.addEventListener('resize', onResize);
		document.addEventListener('pointerdown', onPointerDown);
		void fetchCommits();

		return () => {
			ro.disconnect();
			window.removeEventListener('resize', onResize);
			document.removeEventListener('pointerdown', onPointerDown);
		};
	});
</script>

<div class="gitcal">
	{#if loading}
		<p class="summary"><span class="rest">Loading contributions…</span></p>
	{:else if error}
		<p class="summary"><span class="rest">{error}</span></p>
	{:else}
		<div class="head">
			<p class="summary">
				<span class="total">{totalLabel}</span>{' '}contributions in the last {monthCount}
				{periodLabel}
			</p>
			<a
				class="handle"
				href="https://github.com/{username}"
				target="_blank"
				rel="noopener noreferrer"
			>
				@{username}
			</a>
		</div>
	{/if}

	<div class="stage" bind:this={stageEl}>
		<div
			class="tip"
			bind:this={tipEl}
			aria-hidden="true"
			data-open={tipOpen ? '' : undefined}
			data-instant={tipInstant ? '' : undefined}
		>
			<span class="tip-count">{tipCount}</span>
			<span class="tip-date">{tipDate}</span>
		</div>

		<div class="clip" class:start={fits} bind:this={clipEl}>
			<div
				class="graph"
				role="img"
				aria-label={ariaLabel}
				onpointerover={onOver}
				onpointerleave={onLeave}
			>
				{#if loading}
					{#each Array(18) as _, weekIndex (weekIndex)}
						<div class="week">
							{#each Array(7) as __, dayIndex (dayIndex)}
								<span class="day"></span>
							{/each}
						</div>
					{/each}
				{:else}
					{#each weeks as week, weekIndex (weekIndex)}
						<div class="week">
							{#each week as day (day.iso)}
								<span
									class="day"
									class:active={activeIso === day.iso}
									data-iso={day.iso}
									data-level={day.level}
									data-count={countLabel(day.count)}
									data-date={dateLabel(day.iso)}
								></span>
							{/each}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.gitcal {
		padding-top: 0.85rem;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
	}

	.summary {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
		color: var(--text-muted);
	}

	.total {
		font-weight: 500;
		color: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.handle {
		flex-shrink: 0;
		color: var(--text-muted);
		font-size: 14px;
		line-height: 1.4;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.handle:hover,
	.handle:focus-visible {
		color: var(--text);
	}

	.stage {
		position: relative;
		margin-top: 1rem;
	}

	.clip {
		display: flex;
		justify-content: flex-end;
		overflow-x: clip;
		overflow-y: visible;
	}

	.clip.start {
		justify-content: flex-start;
	}

	.graph {
		display: flex;
		gap: 3px;
		width: max-content;
	}

	.week {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.day {
		width: 12px;
		height: 12px;
		flex: 0 0 auto;
		border-radius: 3px;
		background: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.day[data-level='1'] {
		background: color-mix(in srgb, var(--accent) 25%, transparent);
	}

	.day[data-level='2'] {
		background: color-mix(in srgb, var(--accent) 50%, transparent);
	}

	.day[data-level='3'] {
		background: color-mix(in srgb, var(--accent) 75%, transparent);
	}

	.day[data-level='4'] {
		background: var(--accent);
	}

	.day.active {
		outline: 1px solid color-mix(in srgb, var(--text) 25%, transparent);
		outline-offset: 1px;
	}

	.tip {
		--x: 0px;
		--y: 0px;
		--lift: 4px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		gap: 4px;
		height: 28px;
		padding: 0 10px;
		border-radius: 8px;
		background: var(--text);
		color: var(--bg);
		font-size: 13px;
		line-height: 1.3;
		white-space: nowrap;
		pointer-events: none;
		box-shadow:
			0 0 1px rgba(0, 0, 0, 0.06),
			0 4px 12px rgba(0, 0, 0, 0.14);
		opacity: 0;
		transform-origin: 50% 100%;
		scale: 0.97;
		translate: calc(var(--x) - 50%) calc(var(--y) - 100% - 6px + var(--lift));
		transition:
			opacity 0.1s cubic-bezier(0.23, 1, 0.32, 1),
			scale 0.1s cubic-bezier(0.23, 1, 0.32, 1),
			translate 0.14s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tip[data-open] {
		--lift: 0px;
		opacity: 1;
		scale: 1;
		transition:
			opacity 0.15s cubic-bezier(0.23, 1, 0.32, 1),
			scale 0.15s cubic-bezier(0.23, 1, 0.32, 1),
			translate 0.14s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tip[data-instant] {
		transition-property: opacity, scale;
	}

	.tip-count {
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.tip-date {
		opacity: 0.6;
	}

	@media (prefers-reduced-motion: reduce) {
		.tip,
		.tip[data-open] {
			transition: none;
		}
	}
</style>
