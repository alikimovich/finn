<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import List from '../List';
	import ListRow from '../ListRow';
	import Cluster from '../Cluster';
	import Avatar from '../Avatar';

	const { Story } = defineMeta({
		title: 'Lists/List',
		component: List,
		tags: ['autodocs'],
		argTypes: {
			space: {
				control: 'select',
				options: ['half', '1', '2', '3', '4']
			}
		}
	});
</script>

<Story name="Default (space=2)" args={{ space: '2' }}>
	{#snippet template({ children: _c, ...args })}
		<List {...args}>
			<ListRow padding="sm">
				<Cluster space="3" align="center">
					<Avatar name="Jane Doe" size={32} />
					<span>Jane Doe</span>
				</Cluster>
			</ListRow>
			<ListRow padding="sm">
				<Cluster space="3" align="center">
					<Avatar name="Alex Kim" size={32} />
					<span>Alex Kim</span>
				</Cluster>
			</ListRow>
			<ListRow padding="sm">
				<Cluster space="3" align="center">
					<Avatar name="Sam Lee" size={32} />
					<span>Sam Lee</span>
				</Cluster>
			</ListRow>
		</List>
	{/snippet}
</Story>

<Story name="Tight (space=half)" args={{ space: 'half' }}>
	{#snippet template({ children: _c, ...args })}
		<List {...args}>
			<ListRow padding="sm">Row 1</ListRow>
			<ListRow padding="sm">Row 2</ListRow>
			<ListRow padding="sm">Row 3</ListRow>
		</List>
	{/snippet}
</Story>
