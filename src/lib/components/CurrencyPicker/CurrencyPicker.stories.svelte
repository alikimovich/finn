<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CurrencyPicker from '../CurrencyPicker';
	import Field from '../Field';

	const { Story } = defineMeta({
		title: 'Form/CurrencyPicker',
		component: CurrencyPicker,
		tags: ['autodocs']
	});
</script>

<Story name="Standalone">
	{#snippet template()}
		{@const noop = () => {}}
		<CurrencyPicker selected="USD" onSelect={noop} />
	{/snippet}
</Story>

<Story name="Inside a Field">
	{#snippet template()}
		{@const noop = () => {}}
		<Field label="Currency" as="div">
			<CurrencyPicker selected="EUR" onSelect={noop} />
		</Field>
	{/snippet}
</Story>

<Story name="With exclusion (currency pair)">
	{#snippet template()}
		{@const noop = () => {}}
		<CurrencyPicker selected="GBP" exclude="USD" onSelect={noop} />
	{/snippet}
</Story>
