<script lang="ts">
	import { currencies, popularCodes } from '$lib/data/currencies';
	import type { Currency, CurrencyCode } from '$lib/types';
	import SearchField from './SearchField.svelte';
	import SectionLabel from './SectionLabel.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		selected: CurrencyCode;
		exclude?: CurrencyCode;
		onSelect: (code: CurrencyCode) => void;
	}

	let { selected, exclude, onSelect }: Props = $props();

	let open = $state(false);
	let query = $state('');
	let triggerEl: HTMLButtonElement | undefined = $state();

	const selectedCurrency = $derived(
		currencies.find((c) => c.code === selected) ?? currencies[0]
	);

	const popular = $derived(
		popularCodes
			.map((code) => currencies.find((c) => c.code === code))
			.filter((c): c is Currency => Boolean(c))
			.filter((c) => c.code !== exclude)
	);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const list = currencies.filter((c) => c.code !== exclude);
		if (!q) return list;
		return list.filter(
			(c) =>
				c.code.toLowerCase().includes(q) ||
				c.name.toLowerCase().includes(q)
		);
	});

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
		query = '';
	}

	function pick(code: CurrencyCode) {
		onSelect(code);
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
			triggerEl?.focus();
		}
	}

	function onDocClick(e: MouseEvent) {
		if (!open) return;
		const target = e.target as Node | null;
		if (!target) return;
		const popover = document.querySelector('[data-currency-popover]');
		if (popover?.contains(target)) return;
		if (triggerEl?.contains(target)) return;
		close();
	}

	$effect(() => {
		if (!open) return;
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	});
</script>

<svelte:window onkeydown={onKeydown} />

<div class="picker">
	<button
		bind:this={triggerEl}
		class="trigger"
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
	>
		<span class="flag" aria-hidden="true">{selectedCurrency.flag}</span>
		<span class="code">{selectedCurrency.code}</span>
		<span class="chev">
			<Icon name="chevron-down" size="xs" />
		</span>
	</button>

	{#if open}
		<div class="popover" data-currency-popover role="dialog" aria-label="Select currency">
			<SearchField bind:value={query} placeholder="Search currency" variant="plain" />

			<div class="list" role="listbox">
				{#if !query.trim() && popular.length > 0}
					<div class="group-label">
						<SectionLabel text="Popular" />
					</div>
					{#each popular as currency (currency.code)}
						<button
							class="row"
							class:selected={currency.code === selected}
							type="button"
							role="option"
							aria-selected={currency.code === selected}
							onclick={() => pick(currency.code)}
						>
							<span class="flag" aria-hidden="true">{currency.flag}</span>
							<span class="row-code">{currency.code}</span>
							<span class="row-name">{currency.name}</span>
						</button>
					{/each}
					<div class="group-label">
						<SectionLabel text="All currencies" />
					</div>
				{/if}
				{#each filtered as currency (currency.code)}
					<button
						class="row"
						class:selected={currency.code === selected}
						type="button"
						role="option"
						aria-selected={currency.code === selected}
						onclick={() => pick(currency.code)}
					>
						<span class="flag" aria-hidden="true">{currency.flag}</span>
						<span class="row-code">{currency.code}</span>
						<span class="row-name">{currency.name}</span>
					</button>
				{:else}
					<div class="empty">No matches</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.picker {
		position: relative;
		display: inline-block;
	}

	.trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		height: var(--control-height-lg);
		padding: 0 var(--space-3);
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-pill);
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
		transition:
			border-color var(--dur-2) var(--ease-standard),
			background-color var(--dur-2) var(--ease-standard);
	}

	.trigger:hover {
		background: var(--color-accent-soft);
	}

	.trigger[aria-expanded='true'] {
		border-color: var(--color-accent);
	}

	.flag {
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
	}

	.code {
		letter-spacing: var(--tracking-wide);
	}

	.chev {
		display: inline-flex;
		color: var(--color-text-subtle);
	}

	.popover {
		position: absolute;
		top: calc(100% + var(--space-1) + 2px);
		left: 0;
		width: var(--popover-width);
		max-height: var(--popover-max-height);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: var(--z-popover);
	}

	.list {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-1) 0;
	}

	.group-label {
		padding: var(--space-3) var(--space-4) var(--space-1);
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-2) var(--space-4);
		text-align: left;
		font-size: var(--text-base);
	}

	.row:hover {
		background: var(--color-accent-soft);
	}

	.row.selected {
		background: var(--color-accent-soft);
	}

	.row-code {
		font-weight: var(--weight-semibold);
		min-width: var(--control-height-md);
	}

	.row-name {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}
</style>
