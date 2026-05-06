<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Cluster from '../Cluster';
	import Button from '../Button';
	import DotSep from '../DotSep';

	const { Story } = defineMeta({
		title: 'Layout/Cluster',
		component: Cluster,
		tags: ['autodocs'],
		argTypes: {
			space: { control: 'select', options: ['1', '2', '3', '4', '5', '6'] },
			align: {
				control: 'select',
				options: ['start', 'center', 'end', 'baseline', 'stretch']
			},
			justify: {
				control: 'select',
				options: ['start', 'center', 'end', 'between']
			}
		}
	});
</script>

<Story name="Default" args={{ space: '2' }}>
	{#snippet template({ children: _c, ...args })}
		<Cluster {...args}>
			<Button variant="primary">Save</Button>
			<Button variant="secondary">Cancel</Button>
			<Button variant="ghost">Discard</Button>
		</Cluster>
	{/snippet}
</Story>

<Story name="Justify between" args={{ justify: 'between' }}>
	{#snippet template({ children: _c, ...args })}
		<Cluster {...args}>
			<h3>Recent activity</h3>
			<Button variant="ghost" size="sm">Clear</Button>
		</Cluster>
	{/snippet}
</Story>

<Story name="Inline meta with DotSep" args={{ space: '2' }}>
	{#snippet template({ children: _c, ...args })}
		<Cluster {...args}>
			<span>1 USD = 0.92 EUR</span>
			<DotSep />
			<span>updated 2 min ago</span>
			<DotSep />
			<span>ECB</span>
		</Cluster>
	{/snippet}
</Story>
