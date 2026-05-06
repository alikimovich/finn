<script lang="ts">
	import Sparkline from '$lib/components/Sparkline.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatRate, formatRateDate } from '$lib/utils/format';
	import { getCurrency } from '$lib/data/currencies';
	import type { RateSeries } from '$lib/types';

	let { data }: { data: { series: RateSeries[] } } = $props();
</script>

<PageHeader title="Rates" subtitle="30-day trend for the pairs you watch." />

{#if data.series.length === 0}
	<EmptyState description="Couldn't load rates right now. Try again in a moment." />
{:else}
	<ul class="list">
		{#each data.series as s (s.from + s.to)}
			{@const fromC = getCurrency(s.from)}
			{@const toC = getCurrency(s.to)}
			{@const up = s.changePct >= 0}
			<li>
				<a class="row" href={`/convert?from=${s.from}&to=${s.to}`}>
					<div class="pair">
						<div class="flags" aria-hidden="true">
							<span class="flag flag-from">{fromC?.flag}</span>
							<span class="flag flag-to">{toC?.flag}</span>
						</div>
						<div class="codes">
							<div class="code-line">
								<span class="code">{s.from}</span>
								<span class="arrow" aria-hidden="true">→</span>
								<span class="code">{s.to}</span>
							</div>
							<div class="names">
								{fromC?.name} → {toC?.name}
							</div>
						</div>
					</div>

					<div class="spark">
						<Sparkline
							points={s.points.map((p) => p.rate)}
							tone={up ? 'up' : 'down'}
						/>
					</div>

					<div class="rate">
						<div class="rate-value">{formatRate(s.current)}</div>
						<div class="rate-meta">
							<span class="change" class:up class:down={!up}>
								{up ? '▲' : '▼'}
								{Math.abs(s.changePct).toFixed(2)}%
							</span>
							<span class="dot-sep">·</span>
							<span class="range">
								{formatRate(s.low)} – {formatRate(s.high)}
							</span>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<div class="footnote">
		<span>1 unit of base currency in target · 7-day change · 30-day low/high</span>
		<span class="dot-sep">·</span>
		<span>ECB · {formatRateDate(data.series[0].asOf)}</span>
	</div>
{/if}

<style>
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-4) var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition:
			border-color var(--dur-2) var(--ease-standard),
			background-color var(--dur-2) var(--ease-standard);
	}

	.row:hover {
		border-color: var(--color-border-strong);
	}

	.pair {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.flags {
		position: relative;
		width: var(--control-height-md);
		height: 22px;
		flex-shrink: 0;
	}

	.flag {
		position: absolute;
		font-size: var(--text-2xl);
		line-height: var(--leading-tight);
		filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
	}

	.flag-from {
		left: 0;
		top: 0;
	}

	.flag-to {
		left: 14px;
		top: 4px;
	}

	.codes {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.code-line {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
		letter-spacing: var(--tracking-wide);
	}

	.arrow {
		color: var(--color-text-subtle);
		font-weight: var(--weight-regular);
	}

	.names {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spark {
		display: flex;
		align-items: center;
	}

	.rate {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.rate-value {
		font-size: var(--text-xl);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-tight);
	}

	.rate-meta {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-2);
		margin-top: 2px;
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.change {
		font-weight: var(--weight-semibold);
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}

	.change.up {
		color: var(--color-success);
	}

	.change.down {
		color: var(--color-danger);
	}

	.dot-sep {
		color: var(--color-text-subtle);
	}

	.range {
		color: var(--color-text-subtle);
	}

	.footnote {
		margin-top: var(--space-5);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
</style>
