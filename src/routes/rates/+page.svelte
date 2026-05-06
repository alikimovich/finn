<script lang="ts">
	import Sparkline from '$lib/components/Sparkline.svelte';
	import { formatRate, formatRateDate } from '$lib/utils/format';
	import { getCurrency } from '$lib/data/currencies';
	import type { RateSeries } from '$lib/types';

	let { data }: { data: { series: RateSeries[] } } = $props();
</script>

<header class="header">
	<div>
		<h1>Rates</h1>
		<p class="subtitle">30-day trend for the pairs you watch.</p>
	</div>
</header>

{#if data.series.length === 0}
	<div class="empty">Couldn't load rates right now. Try again in a moment.</div>
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
							stroke={up ? '#3a8a5c' : '#b8423b'}
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
	.header {
		margin-bottom: var(--space-5);
	}

	h1 {
		font-size: 24px;
		letter-spacing: -0.02em;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 13.5px;
		margin-top: var(--space-1);
	}

	.empty {
		padding: var(--space-6);
		text-align: center;
		color: var(--text-subtle);
		font-size: 13px;
		border: 1px dashed var(--border);
		border-radius: var(--radius-md);
	}

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
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition:
			border-color 120ms ease,
			background-color 120ms ease,
			transform 120ms ease;
	}

	.row:hover {
		border-color: var(--border-strong);
		background: var(--surface);
	}

	.pair {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.flags {
		position: relative;
		width: 36px;
		height: 22px;
		flex-shrink: 0;
	}

	.flag {
		position: absolute;
		font-size: 18px;
		line-height: 1;
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
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.02em;
	}

	.arrow {
		color: var(--text-subtle);
		font-weight: 400;
	}

	.names {
		font-size: 12px;
		color: var(--text-muted);
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
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.rate-meta {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-2);
		margin-top: 2px;
		font-size: 11.5px;
		color: var(--text-muted);
	}

	.change {
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}

	.change.up {
		color: #3a8a5c;
	}

	.change.down {
		color: var(--danger);
	}

	.dot-sep {
		color: var(--text-subtle);
	}

	.range {
		color: var(--text-subtle);
	}

	.footnote {
		margin-top: var(--space-5);
		padding-top: var(--space-4);
		border-top: 1px solid var(--border);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-size: 11.5px;
		color: var(--text-subtle);
	}
</style>
