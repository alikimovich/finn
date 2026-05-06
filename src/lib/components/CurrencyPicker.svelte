<script lang="ts">
	import { currencies, popularCodes } from '$lib/data/currencies';
	import type { Currency, CurrencyCode } from '$lib/types';

	interface Props {
		selected: CurrencyCode;
		exclude?: CurrencyCode;
		onSelect: (code: CurrencyCode) => void;
	}

	let { selected, exclude, onSelect }: Props = $props();

	let open = $state(false);
	let query = $state('');
	let triggerEl: HTMLButtonElement | undefined = $state();
	let searchEl: HTMLInputElement | undefined = $state();

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
		if (open) {
			queueMicrotask(() => searchEl?.focus());
		}
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
		<svg
			class="chev"
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m3 4 2 2 2-2" />
		</svg>
	</button>

	{#if open}
		<div class="popover" data-currency-popover role="dialog" aria-label="Select currency">
			<div class="search">
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="7" cy="7" r="5" />
					<path d="m11 11 3 3" />
				</svg>
				<input
					bind:this={searchEl}
					bind:value={query}
					type="text"
					placeholder="Search currency"
					autocomplete="off"
				/>
			</div>

			<div class="list" role="listbox">
				{#if !query.trim() && popular.length > 0}
					<div class="group-label">Popular</div>
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
					<div class="group-label">All currencies</div>
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
		height: 40px;
		padding: 0 var(--space-3);
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-pill);
		font-weight: 600;
		font-size: 14px;
		transition: border-color 120ms ease, background-color 120ms ease;
	}

	.trigger:hover {
		background: var(--accent-soft);
	}

	.trigger[aria-expanded='true'] {
		border-color: var(--accent);
	}

	.flag {
		font-size: 16px;
		line-height: 1;
	}

	.code {
		letter-spacing: 0.02em;
	}

	.chev {
		color: var(--text-subtle);
	}

	.popover {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		width: 320px;
		max-height: 380px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 20;
	}

	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--border);
		color: var(--text-subtle);
	}

	.search input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 13.5px;
		color: var(--text);
	}

	.search input::placeholder {
		color: var(--text-subtle);
	}

	.list {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-1) 0;
	}

	.group-label {
		font-size: 10.5px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-subtle);
		padding: var(--space-3) var(--space-4) var(--space-1);
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-2) var(--space-4);
		text-align: left;
		font-size: 13.5px;
	}

	.row:hover {
		background: var(--accent-soft);
	}

	.row.selected {
		background: var(--accent-soft);
	}

	.row-code {
		font-weight: 600;
		min-width: 36px;
	}

	.row-name {
		color: var(--text-muted);
		font-size: 12.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty {
		padding: var(--space-4);
		text-align: center;
		color: var(--text-subtle);
		font-size: 12.5px;
	}
</style>
