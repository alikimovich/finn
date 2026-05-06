<!--
	@component
	A labeled row that pairs a `<CurrencyPicker>` with a 36px display
	`<Input>` for entering an amount in a chosen currency. **Use this
	anywhere a user enters an amount alongside a currency** — the convert
	"You send" / "They get" rows and the send screen's AMOUNT row are
	all this primitive.

	The label uses `<SectionLabel>` typography (10.5px / 0.06em — the
	`AMOUNT` style from Figma). The input is `<Input size="xl">` —
	semibold, tabular numerals, focus-borderless. The row is non-wrapping
	so the input never gets pushed to its own line.

	Don't compose this by hand from `<Field>` + `<Input size="xl">` —
	`<Field>`'s descendant input styling clobbers the `xl` variant.

	Props:
	- `label` — string (required). Rendered uppercase via `<SectionLabel>`.
	- `value` — string | number (bindable, required).
	- `currency` — `CurrencyCode` (required).
	- `onCurrencySelect` — `(code: CurrencyCode) => void` (required).
	- `excludeCurrency` — `CurrencyCode` (optional). Hides this currency
	  from the picker (e.g. the other side of a converter pair).
	- `oninput` — `(e: Event) => void` (optional). Fires on every
	  keystroke, in addition to the bound value updating.
	- `ariaLabel` — string (optional). Defaults to `Amount in {currency}`.
	- `inputmode` — passed to the underlying input (default `'decimal'`).

	@example
	```svelte
	<AmountField
	  label="Amount"
	  bind:value={amount}
	  currency={code}
	  onCurrencySelect={(c) => (code = c)}
	/>

	<AmountField
	  label="You send"
	  bind:value={fromAmount}
	  currency={from}
	  excludeCurrency={to}
	  onCurrencySelect={selectFrom}
	  oninput={onFromInput}
	/>
	```
-->
<script lang="ts">
	import type { CurrencyCode } from '$lib/types';
	import CurrencyPicker from '../CurrencyPicker';
	import Input from '../Input';
	import SectionLabel from '../SectionLabel';

	interface Props {
		/** Uppercase label rendered via SectionLabel (e.g. "Amount", "You send"). */
		label: string;
		/** Bindable amount value. */
		value: string | number;
		/** Currently selected currency code. */
		currency: CurrencyCode;
		/** Called when the user picks a different currency. */
		onCurrencySelect: (code: CurrencyCode) => void;
		/** Currency to hide from the picker (e.g. the other side of a pair). */
		excludeCurrency?: CurrencyCode;
		/** Optional input handler — fires alongside the bound value updating. */
		oninput?: (e: Event) => void;
		/**
		 * Accessible label for the amount input.
		 * @default `Amount in {currency}`
		 */
		ariaLabel?: string;
		/**
		 * `inputmode` for the amount input.
		 * @default 'decimal'
		 */
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
