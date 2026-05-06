<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AmountField from '../AmountField';
	import Card from '../Card';
	import Stack from '../Stack';

	const { Story } = defineMeta({
		title: 'Form/AmountField',
		component: AmountField,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import type { CurrencyCode } from '$lib/types';

	let amountA = $state('100.00');
	let codeA = $state<CurrencyCode>('USD');

	let amountB = $state('92.00');
	let codeB = $state<CurrencyCode>('EUR');
</script>

<Story name="Default">
	<Card padding="lg">
		<AmountField
			label="Amount"
			bind:value={amountA}
			currency={codeA}
			onCurrencySelect={(c) => (codeA = c)}
		/>
	</Card>
</Story>

<Story name="Pair (converter)">
	<Card padding="lg">
		<Stack space="4">
			<AmountField
				label="You send"
				bind:value={amountA}
				currency={codeA}
				excludeCurrency={codeB}
				onCurrencySelect={(c) => (codeA = c)}
			/>
			<AmountField
				label="They get"
				bind:value={amountB}
				currency={codeB}
				excludeCurrency={codeA}
				onCurrencySelect={(c) => (codeB = c)}
			/>
		</Stack>
	</Card>
</Story>
