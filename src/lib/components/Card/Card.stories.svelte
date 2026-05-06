<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from '../Card';
	import Stack from '../Stack';

	const { Story } = defineMeta({
		title: 'Containers/Card',
		component: Card,
		tags: ['autodocs'],
		argTypes: {
			padding: { control: 'select', options: ['sm', 'md', 'lg'] }
		}
	});
</script>

<Story name="Default (lg)" args={{ padding: 'lg' }}>
	{#snippet template({ children: _c, ...args })}
		<Card {...args}>
			<Stack space="2">
				<h3>Recent conversion</h3>
				<p>1 USD = 0.92 EUR</p>
			</Stack>
		</Card>
	{/snippet}
</Story>

<Story name="Small padding" args={{ padding: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<Card {...args}>
			<p>Compact card content.</p>
		</Card>
	{/snippet}
</Story>

<Story name="Medium padding" args={{ padding: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<Card {...args}>
			<p>Standard card content.</p>
		</Card>
	{/snippet}
</Story>
