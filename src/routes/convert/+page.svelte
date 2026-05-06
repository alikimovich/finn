<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import CurrencyPicker from '$lib/components/CurrencyPicker.svelte';
	import { pairRate } from '$lib/utils/convert';
	import {
		formatAmount,
		formatRate,
		formatRateDate,
		formatRelativeTime
	} from '$lib/utils/format';
	import { recentConversions } from '$lib/stores/recentConversions';
	import { getCurrency } from '$lib/data/currencies';
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

	const fromCurrency = $derived(getCurrency(from));
	const toCurrency = $derived(getCurrency(to));
</script>

<header class="header">
	<div>
		<h1>Convert</h1>
		<p class="subtitle">Live FX rates from the European Central Bank.</p>
	</div>
</header>

<Card padding="lg">
	<div class="converter">
		<div class="row">
			<div class="row-label">You send</div>
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
				style="--swap-rot: {swapRotation}deg"
				onclick={swap}
				aria-label="Swap currencies"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 3v9M2 6l3-3 3 3M11 13V4M14 10l-3 3-3-3" />
				</svg>
			</button>
		</div>

		<div class="row">
			<div class="row-label">They get</div>
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
		<h2>Recent</h2>
		{#if $recentConversions.length > 0}
			<button class="clear" type="button" onclick={() => recentConversions.clear()}>
				Clear
			</button>
		{/if}
	</div>

	{#if $recentConversions.length === 0}
		<div class="empty">
			Nothing yet. Save a conversion to keep it here.
		</div>
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

	.row-label {
		font-size: 11.5px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-subtle);
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
		font-size: 36px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--text);
		font-family: inherit;
		font-variant-numeric: tabular-nums;
		padding: var(--space-1) 0;
		text-align: right;
	}

	.amount-input::placeholder {
		color: var(--text-subtle);
	}

	.divider {
		position: relative;
		height: 1px;
		background: var(--border);
		margin: var(--space-1) 0;
	}

	.swap {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		color: var(--text-muted);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%) rotate(var(--swap-rot, 0deg));
		transition:
			background-color 120ms ease,
			color 120ms ease,
			transform 360ms cubic-bezier(0.5, 1.4, 0.4, 1);
	}

	.swap:hover {
		background: var(--accent-soft);
		color: var(--text);
	}

	.rate-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		padding-top: var(--space-4);
		margin-top: var(--space-4);
		border-top: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 12.5px;
		font-variant-numeric: tabular-nums;
	}

	.rate {
		font-weight: 500;
		color: var(--text);
	}

	.dot-sep {
		color: var(--text-subtle);
	}

	.source {
		color: var(--text-subtle);
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

	h2 {
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}

	.clear {
		font-size: 12px;
		color: var(--text-subtle);
		transition: color 120ms ease;
	}

	.clear:hover {
		color: var(--text);
	}

	.empty {
		padding: var(--space-5);
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
		background: var(--surface);
		border: 1px solid var(--border);
		text-align: left;
		transition: border-color 120ms ease, background-color 120ms ease;
	}

	.recent-row:hover {
		border-color: var(--border-strong);
	}

	.recent-amounts {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-variant-numeric: tabular-nums;
		font-size: 13.5px;
	}

	.from-amt {
		color: var(--text);
		font-weight: 500;
	}

	.arrow {
		color: var(--text-subtle);
	}

	.to-amt {
		color: var(--text);
		font-weight: 500;
	}

	.recent-meta {
		display: inline-flex;
		gap: var(--space-2);
		color: var(--text-subtle);
		font-size: 12.5px;
		font-variant-numeric: tabular-nums;
	}
</style>
