<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import CurrencyPicker from '$lib/components/CurrencyPicker.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { pairRate } from '$lib/utils/convert';
	import {
		formatAmount,
		formatRate,
		formatRateDate,
		formatRelativeTime
	} from '$lib/utils/format';
	import { recentConversions } from '$lib/stores/recentConversions';
	import type { Conversion, CurrencyCode } from '$lib/types';

	import { page } from '$app/state';

	interface PageData {
		base: CurrencyCode;
		date: string;
		rates: Record<CurrencyCode, number>;
	}

	let { data }: { data: PageData } = $props();

	const initialFrom = page.url.searchParams.get('from') ?? 'USD';
	const initialTo = page.url.searchParams.get('to') ?? 'EUR';
	const initialAmount = page.url.searchParams.get('amount') ?? '100';

	let from = $state<CurrencyCode>(initialFrom);
	let to = $state<CurrencyCode>(initialTo);
	let fromAmount = $state<string>(initialAmount);
	let lastEdited = $state<'from' | 'to'>('from');
	let savedFlash = $state(false);
	let swapRotation = $state(0);

	const rate = $derived(pairRate(data.rates, data.base, from, to));
	const inverseRate = $derived(rate ? 1 / rate : 0);

	const fromNumber = $derived(Number(fromAmount.replace(/,/g, '')) || 0);
	const toNumber = $derived(fromNumber * rate);

	let toAmount = $state<string>('');

	$effect(() => {
		if (lastEdited === 'from') {
			toAmount = toNumber ? formatAmount(toNumber, to) : '';
		}
	});

	function onFromInput(e: Event) {
		const target = e.target as HTMLInputElement;
		fromAmount = target.value;
		lastEdited = 'from';
	}

	function onToInput(e: Event) {
		const target = e.target as HTMLInputElement;
		toAmount = target.value;
		lastEdited = 'to';
		const n = Number(target.value.replace(/,/g, '')) || 0;
		fromAmount = rate ? String(+(n / rate).toFixed(2)) : '0';
	}

	function swap() {
		const prevFrom = from;
		from = to;
		to = prevFrom;
		lastEdited = 'from';
		swapRotation += 180;
	}

	function selectFrom(code: CurrencyCode) {
		from = code;
		lastEdited = 'from';
	}

	function selectTo(code: CurrencyCode) {
		to = code;
		lastEdited = 'from';
	}

	function save() {
		recentConversions.add({
			from,
			to,
			amount: fromNumber,
			result: toNumber,
			rate,
			date: data.date
		});
		savedFlash = true;
		setTimeout(() => (savedFlash = false), 1400);
	}

	function loadConversion(c: Conversion) {
		from = c.from;
		to = c.to;
		fromAmount = String(c.amount);
		lastEdited = 'from';
	}
</script>

<PageHeader
	title="Convert"
	subtitle="Live FX rates from the European Central Bank."
/>

<Card padding="lg">
	<div class="converter">
		<div class="row">
			<SectionLabel text="You send" />
			<div class="row-content">
				<CurrencyPicker selected={from} exclude={to} onSelect={selectFrom} />
				<input
					class="amount-input"
					type="text"
					inputmode="decimal"
					value={fromAmount}
					oninput={onFromInput}
					aria-label="Amount in {from}"
				/>
			</div>
		</div>

		<div class="divider">
			<button
				class="swap"
				type="button"
				style:--swap-rot="{swapRotation}deg"
				onclick={swap}
				aria-label="Swap currencies"
			>
				<Icon name="swap-vertical" size="sm" />
			</button>
		</div>

		<div class="row">
			<SectionLabel text="They get" />
			<div class="row-content">
				<CurrencyPicker selected={to} exclude={from} onSelect={selectTo} />
				<input
					class="amount-input"
					type="text"
					inputmode="decimal"
					value={toAmount}
					oninput={onToInput}
					aria-label="Amount in {to}"
				/>
			</div>
		</div>
	</div>

	<div class="rate-meta">
		<span class="rate">
			1 {from} = {formatRate(rate)} {to}
		</span>
		<span class="dot-sep">·</span>
		<span>
			1 {to} = {formatRate(inverseRate)} {from}
		</span>
		<span class="dot-sep">·</span>
		<span class="source">ECB · {formatRateDate(data.date)}</span>
	</div>

	<div class="actions">
		<Button variant="ghost" size="sm" onclick={save} disabled={!fromNumber}>
			{savedFlash ? 'Saved ✓' : 'Save conversion'}
		</Button>
	</div>
</Card>

<section class="recent">
	<div class="recent-head">
		<SectionLabel as="h2" text="Recent" />
		{#if $recentConversions.length > 0}
			<button class="clear" type="button" onclick={() => recentConversions.clear()}>
				Clear
			</button>
		{/if}
	</div>

	{#if $recentConversions.length === 0}
		<EmptyState
			tone="subtle"
			description="Nothing yet. Save a conversion to keep it here."
		/>
	{:else}
		<ul class="list">
			{#each $recentConversions as item (item.id)}
				<li>
					<button class="recent-row" type="button" onclick={() => loadConversion(item)}>
						<span class="recent-amounts">
							<span class="from-amt">
								{formatAmount(item.amount, item.from)} {item.from}
							</span>
							<span class="arrow" aria-hidden="true">→</span>
							<span class="to-amt">
								{formatAmount(item.result, item.to)} {item.to}
							</span>
						</span>
						<span class="recent-meta">
							<span>{formatRate(item.rate)}</span>
							<span class="dot-sep">·</span>
							<span>{formatRelativeTime(item.savedAt)}</span>
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.converter {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3) 0;
	}

	.row-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.amount-input {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		outline: none;
		font-size: var(--text-display);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-display);
		line-height: var(--leading-snug);
		color: var(--color-text);
		font-family: inherit;
		font-variant-numeric: tabular-nums;
		padding: var(--space-1) 0;
		text-align: right;
	}

	.amount-input::placeholder {
		color: var(--color-text-subtle);
	}

	.divider {
		position: relative;
		height: 1px;
		background: var(--color-border);
		margin: var(--space-1) 0;
	}

	.swap {
		position: absolute;
		left: 50%;
		top: 50%;
		width: var(--space-6);
		height: var(--space-6);
		border-radius: var(--radius-circle);
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong);
		color: var(--color-text-muted);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%) rotate(var(--swap-rot, 0deg));
		transition:
			background-color var(--dur-2) var(--ease-standard),
			color var(--dur-2) var(--ease-standard),
			transform var(--dur-5) var(--ease-spring);
	}

	.swap:hover {
		background: var(--color-accent-soft);
		color: var(--color-text);
	}

	.rate-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		padding-top: var(--space-4);
		margin-top: var(--space-4);
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}

	.rate {
		font-weight: var(--weight-medium);
		color: var(--color-text);
	}

	.dot-sep {
		color: var(--color-text-subtle);
	}

	.source {
		color: var(--color-text-subtle);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: var(--space-4);
	}

	.recent {
		margin-top: var(--space-7);
	}

	.recent-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.clear {
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		transition: color var(--dur-2) var(--ease-standard);
	}

	.clear:hover {
		color: var(--color-text);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.recent-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		text-align: left;
		transition:
			border-color var(--dur-2) var(--ease-standard),
			background-color var(--dur-2) var(--ease-standard);
	}

	.recent-row:hover {
		border-color: var(--color-border-strong);
	}

	.recent-amounts {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-variant-numeric: tabular-nums;
		font-size: var(--text-base);
	}

	.from-amt,
	.to-amt {
		color: var(--color-text);
		font-weight: var(--weight-medium);
	}

	.arrow {
		color: var(--color-text-subtle);
	}

	.recent-meta {
		display: inline-flex;
		gap: var(--space-2);
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}
</style>
