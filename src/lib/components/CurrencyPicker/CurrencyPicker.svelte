<!--
	@component
	Pill-shaped trigger (flag + code + chevron) opening a searchable
	popover of all currencies, with a "Popular" group when no query is
	active. **Use this anywhere a user picks a currency** — never roll a
	plain `<select>`.

	Wrap in `<Field as="div" label="…">` for form rows.

	Props:
	- `selected` — `CurrencyCode` (required).
	- `onSelect` — `(code: CurrencyCode) => void` (required).
	- `exclude` — `CurrencyCode` (optional). Hides this currency from the list.
	- `aria-label` — string (optional).

	@example
	```svelte
	<CurrencyPicker selected={code} exclude={otherCode} onSelect={(c) => (code = c)} />

	<Field label="Currency" as="div">
	  <CurrencyPicker selected={code} onSelect={(c) => (code = c)} />
	</Field>
	```
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { currencies, popularCodes } from '$lib/data/currencies';
	import type { Currency, CurrencyCode } from '$lib/types';
	import SearchField from '../SearchField';
	import SectionLabel from '../SectionLabel';
	import Icon from '../Icon';

	interface Props {
		/** Currently selected currency code. */
		selected: CurrencyCode;
		/** Currency to hide from the list (e.g. the other side of a pair). */
		exclude?: CurrencyCode;
		/** Called when the user picks a currency. */
		onSelect: (code: CurrencyCode) => void;
		/** Accessible label, prepended to the descriptive aria-label. */
		'aria-label'?: string;
	}

	let { selected, exclude, onSelect, 'aria-label': ariaLabel }: Props = $props();

	let open = $state(false);
	let query = $state('');
	let triggerEl: HTMLButtonElement | undefined = $state();
	let popoverEl: HTMLDivElement | undefined = $state();

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

	async function toggle() {
		open = !open;
		if (open) {
			await tick();
			const search = popoverEl?.querySelector<HTMLInputElement>('input');
			search?.focus();
		}
	}

	function close() {
		open = false;
		query = '';
	}

	function pick(code: CurrencyCode) {
		onSelect(code);
		close();
		triggerEl?.focus();
	}

	function focusOption(index: number) {
		const options = popoverEl?.querySelectorAll<HTMLButtonElement>('[role="option"]');
		if (!options || options.length === 0) return;
		const clamped = Math.max(0, Math.min(index, options.length - 1));
		options[clamped]?.focus();
	}

	function focusFirstOption() {
		focusOption(0);
	}

	function focusLastOption() {
		const options = popoverEl?.querySelectorAll<HTMLButtonElement>('[role="option"]');
		if (options) focusOption(options.length - 1);
	}

	function onListKeydown(e: KeyboardEvent) {
		if (!open) return;
		const target = e.target as HTMLElement;
		const options = Array.from(
			popoverEl?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []
		);
		const idx = options.indexOf(target as HTMLButtonElement);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (idx === -1) focusFirstOption();
			else focusOption(idx + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (idx === -1) focusLastOption();
			else focusOption(idx - 1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			focusFirstOption();
		} else if (e.key === 'End') {
			e.preventDefault();
			focusLastOption();
		}
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			close();
			triggerEl?.focus();
		}
	}

	function onDocClick(e: MouseEvent) {
		if (!open) return;
		const target = e.target as Node | null;
		if (!target) return;
		if (popoverEl?.contains(target)) return;
		if (triggerEl?.contains(target)) return;
		close();
	}

	$effect(() => {
		if (!open) return;
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	});
</script>

<svelte:window onkeydown={onWindowKeydown} />

<div class="picker">
	<button
		bind:this={triggerEl}
		class="trigger"
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label={ariaLabel
			? `${ariaLabel}: ${selectedCurrency.code} ${selectedCurrency.name}`
			: `Selected currency: ${selectedCurrency.code} ${selectedCurrency.name}`}
		onclick={toggle}
	>
		<span class="flag" aria-hidden="true">{selectedCurrency.flag}</span>
		<span class="code">{selectedCurrency.code}</span>
		<span class="chev">
			<Icon name="chevron-down" size="xs" />
		</span>
	</button>

	{#if open}
		<div
			class="popover"
			bind:this={popoverEl}
			onkeydown={onListKeydown}
			role="presentation"
		>
			<SearchField bind:value={query} placeholder="Search currency" variant="plain" />

			<div class="list" role="listbox" aria-label="Currencies" tabindex="-1">
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
							{#if currency.code === selected}
								<span class="check"><Icon name="check" size="sm" /></span>
							{/if}
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
						{#if currency.code === selected}
							<span class="check"><Icon name="check" size="sm" /></span>
						{/if}
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

	/* Inset focus so the outline isn't clipped by the popover. */
	.row:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.row-code {
		font-weight: var(--weight-semibold);
		min-width: var(--control-height-md);
	}

	.row-name {
		flex: 1;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.check {
		display: inline-flex;
		color: var(--color-accent);
		flex-shrink: 0;
	}

	.empty {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}
</style>
