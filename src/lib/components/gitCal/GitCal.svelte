<script lang="ts">
	import { onMount } from 'svelte';

	type Styles = { [id: string]: string };

	export let username: string;
	export let styles: Styles = {};
	export let months: string = '6';

	const _styles: Styles = {
		commits0: 'rgb(22,27,34)',
		commits1: 'rgb(14,68,41)',
		commits2: 'rgb(0,109,50)',
		commits3: 'rgb(38,166,65)',
		commits4: 'rgb(57,211,83)',
		'text-fill': 'rgb(201,209,217)',
		'text-size': 'xx-small',
		...styles
	};

	let days: { date: Date; commits: number }[] = [];
	let loading = true;
	let error: string | null = null;
	let maxCommits = 0;
	let totalCommits = 0;

	const setStyles = (node: HTMLElement | SVGElement, styles: object) => {
		Object.entries(styles).forEach(([key, value]) => {
			node.style.setProperty(key, value);
		});
	};

	async function fetchCommits() {
		loading = true;
		error = null;
		days = [];
		maxCommits = 0;
		totalCommits = 0;

		const calEnd = new Date();
		calEnd.setDate(calEnd.getDate() - 1);

		const calStart = new Date(calEnd.getFullYear(), calEnd.getMonth() - Number(months), 1);
		calStart.setDate(-calStart.getDay() + 1);

		try {
			const res = await fetch(
				`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
			);

			if (!res.ok) {
				throw new Error(`Contributions API returned ${res.status}`);
			}

			const json = (await res.json()) as {
				contributions?: { date: string; count: number; level: number }[];
				error?: string;
			};

			if (json.error) {
				throw new Error(json.error);
			}

			const allDays = Array.isArray(json.contributions) ? json.contributions : [];
			const startDate = new Date(calStart);
			const endDate = new Date(calEnd);
			const nextDays: { date: Date; commits: number }[] = [];

			for (const day of allDays) {
				const dateObj = new Date(day.date);

				if (dateObj >= startDate && dateObj < endDate) {
					const commits = day.count ?? 0;

					if (commits > maxCommits) maxCommits = commits;
					totalCommits += commits;

					nextDays.push({
						date: dateObj,
						commits
					});
				}
			}

			days = nextDays;
		} catch (err) {
			console.error('Failed to load GitHub contributions', err);
			error = 'Unable to load contributions';
			days = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		void fetchCommits();
	});

	const commits = (c: number) => {
		if (maxCommits === 0) return 'commits0';
		if (c === 0) return 'commits0';
		if (c / maxCommits <= 0.2) return 'commits1';
		if (c / maxCommits <= 0.6) return 'commits2';
		if (c / maxCommits <= 0.8) return 'commits3';
		return 'commits4';
	};
</script>

{#if loading}
	Loading...
{:else if error}
	<p class="gitcal-error">{error}</p>
{:else}
	<svg width={((days.length / 7) | 0) * 12 + 12} height={7 * 12 + 2 * 14}>
		<g>
			{#each days as day, index}
				{#if day.date.getDate() === 1}
					<text
						use:setStyles={{
							fill: _styles['text-fill'],
							'font-size': _styles['text-size']
						}}
						x={((index / 7) | 0) * 12}
						y="10"
					>
						{day.date.toLocaleString('default', { month: 'short' })}
						{#if !day.date.getMonth()}
							-{day.date.getFullYear() % 100}
						{/if}
					</text>
				{/if}

				<rect
					fill={_styles[commits(day.commits)]}
					x={((index / 7) | 0) * 12}
					y={day.date.getDay() * 12 + 15}
					width="10"
					height="10"
					rx="2"
				>
					<title>
						{day.date.toDateString()} - {day.commits === 0 ? 'no ' : day.commits}
						commit{day.commits !== 1 ? 's' : ''}
					</title>
				</rect>
			{/each}

			<!-- legend -->

			<text
				use:setStyles={{
					fill: _styles['text-fill'],
					'font-size': _styles['text-size']
				}}
				x="0"
				y={14 + 7 * 12 + 10}
			>
				less
			</text>

			{#each [0, 1, 2, 3, 4] as index}
				<rect
					fill={_styles['commits' + index]}
					x={24 + index * 12}
					y={14 + 7 * 12 + 2}
					width="10"
					height="10"
					rx="2"
				/>
			{/each}

			<text
				use:setStyles={{
					fill: _styles['text-fill'],
					'font-size': _styles['text-size']
				}}
				x={24 + 5 * 12 + 6}
				y={14 + 7 * 12 + 10}
			>
				more
			</text>

			<text
				use:setStyles={{
					fill: _styles['text-fill'],
					'font-size': _styles['text-size']
				}}
				x={24 + 9 * 12 + 6}
				y={14 + 7 * 12 + 10}
			>
				max commits: {maxCommits} total commits: {totalCommits}
			</text>
		</g>
	</svg>
{/if}

<style>
	.gitcal-error {
		margin: 0;
		color: var(--text-muted, #888);
		font-size: 0.9rem;
	}
</style>
