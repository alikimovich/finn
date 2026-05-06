<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Stack from '../Stack';
	import Card from '../Card';

	const { Story } = defineMeta({
		title: 'Layout/Stack',
		component: Stack,
		tags: ['autodocs'],
		argTypes: {
			space: {
				control: 'select',
				options: ['1', '2', '3', '4', '5', '6', '7', '8']
			},
			align: {
				control: 'select',
				options: ['start', 'center', 'end', 'stretch']
			}
		}
	});
</script>

<Story name="Default (space=3)" args={{ space: '3' }}>
	{#snippet template({ children: _c, ...args })}
		<Stack {...args}>
			<Card padding="sm">First</Card>
			<Card padding="sm">Second</Card>
			<Card padding="sm">Third</Card>
		</Stack>
	{/snippet}
</Story>

<Story name="Tight (space=1)" args={{ space: '1' }}>
	{#snippet template({ children: _c, ...args })}
		<Stack {...args}>
			<Card padding="sm">First</Card>
			<Card padding="sm">Second</Card>
			<Card padding="sm">Third</Card>
		</Stack>
	{/snippet}
</Story>

<Story name="Loose (space=6)" args={{ space: '6' }}>
	{#snippet template({ children: _c, ...args })}
		<Stack {...args}>
			<Card padding="sm">First</Card>
			<Card padding="sm">Second</Card>
			<Card padding="sm">Third</Card>
		</Stack>
	{/snippet}
</Story>

<Story name="Center-aligned" args={{ space: '3', align: 'center' }}>
	{#snippet template({ children: _c, ...args })}
		<Stack {...args}>
			<Card padding="sm">Short</Card>
			<Card padding="sm">A much longer card</Card>
			<Card padding="sm">Mid</Card>
		</Stack>
	{/snippet}
</Story>
