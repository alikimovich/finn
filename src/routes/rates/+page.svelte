<script lang="ts">
	import {
		Cluster,
		DotSep,
		EmptyState,
		List,
		ListRow,
		PageHeader,
		Sparkline
	} from '$lib/components';
	import { formatRate, formatRateDate } from '$lib/utils/format';
	import { getCurrency } from '$lib/data/currencies';
	import type { RateSeries } from '$lib/types';

	let { data }: { data: { series: RateSeries[] } } = $props();
</script>

<PageHeader title="Rates" subtitle="30-day trend for the pairs you watch." />

{#if data.series.length === 0}
	<EmptyState description="Couldn't load rates right now. Try again in a moment." />
{:else}
	<List space="2">
		{#each data.series as s (s.from + s.to)}
			{@const fromC = getCurrency(s.from)}
			{@const toC = getCurrency(s.to)}
			{@const up = s.changePct >= 0}
			<ListRow as="a" padding="md" href={`/convert?from=${s.from}&to=${s.to}`}>
				<div class="grid">
					<div class="pair">
						<div class="flags" aria-hidden="true">
							<span class="flag flag-from">{fromC?.flag}</span>
							<span class="flag flag-to">{toC?.flag}</span>
						</div>
						<div class="codes">
							<Cluster space="2" align="center">
								<span class="code">{s.from}</span>
								<span class="arrow" aria-hidden="true">→</span>
								<span class="code">{s.to}</span>
							</Cluster>
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
							<Cluster space="2" align="center" justify="end">
								<span class="change" class:up class:down={!up}>
									<span aria-hidden="true">{up ? '▲' : '▼'}</span>
									<span class="sr-only">{up ? 'up' : 'down'}</span>
									{Math.abs(s.changePct).toFixed(2)}%
								</span>
								<DotSep />
								<span class="range">
									{formatRate(s.low)} – {formatRate(s.high)}
								</span>
							</Cluster>
						</div>
					</div>
				</div>
			</ListRow>
		{/each}
	</List>

	<div class="footnote">
		<Cluster space="2">
			<span>1 unit of base currency in target · 7-day change · 30-day low/high</span>
			<DotSep />
			<span>ECB · {formatRateDate(data.series[0].asOf)}</span>
		</Cluster>
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: var(--space-5);
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
		height: var(--icon-lg);
		flex-shrink: 0;
	}

	.flag {
		position: absolute;
		font-size: var(--text-2xl);
		line-height: var(--leading-tight);
		filter: drop-shadow(var(--shadow-sm));
	}

	.flag-from {
		left: 0;
		top: 0;
	}

	.flag-to {
		left: var(--icon-sm);
		top: var(--space-1);
	}

	.codes {
		display: flex;
		flex-direction: column;
		gap: var(--space-half);
		min-width: 0;
	}

	.code {
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
		margin-top: var(--space-half);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.change {
		font-weight: var(--weight-semibold);
		display: inline-flex;
		align-items: center;
		gap: var(--space-half);
	}

	.change.up {
		color: var(--color-success);
	}

	.change.down {
		color: var(--color-danger);
	}

	.range {
		color: var(--color-text-subtle);
	}

	.footnote {
		margin-top: var(--space-5);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
</style>
