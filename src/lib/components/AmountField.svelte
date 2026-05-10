<script lang="ts">
	import type { CurrencyCode } from '$lib/types';
	import CurrencyPicker from './CurrencyPicker.svelte';
	import Input from './Input.svelte';
	import SectionLabel from './SectionLabel.svelte';

	interface Props {
		label: string;
		value: string | number;
		currency: CurrencyCode;
		onCurrencySelect: (code: CurrencyCode) => void;
		excludeCurrency?: CurrencyCode;
		oninput?: (e: Event) => void;
		ariaLabel?: string;
		inputmode?: 'decimal' | 'numeric' | 'text';
	}

	let {
		label,
		value = $bindable(),
		currency,
		onCurrencySelect,
		excludeCurrency,
		oninput,
		ariaLabel,
		inputmode = 'decimal'
	}: Props = $props();
</script>

<div class="amount-field">
	<SectionLabel text={label} />
	<div class="row">
		<CurrencyPicker
			selected={currency}
			exclude={excludeCurrency}
			onSelect={onCurrencySelect}
		/>
		<Input
			bind:value
			size="xl"
			align="right"
			type="text"
			{inputmode}
			{oninput}
			aria-label={ariaLabel ?? `Amount in ${currency}`}
		/>
	</div>
</div>

<style>
	.amount-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.row {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: var(--space-4);
	}
</style>
