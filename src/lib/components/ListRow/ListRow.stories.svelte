<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ListRow from '../ListRow';
	import List from '../List';
	import Cluster from '../Cluster';
	import Icon from '../Icon';

	const { Story } = defineMeta({
		title: 'Lists/ListRow',
		component: ListRow,
		tags: ['autodocs'],
		argTypes: {
			as: { control: 'select', options: ['div', 'a', 'button'] },
			padding: { control: 'select', options: ['sm', 'md'] }
		}
	});
</script>

<Story name="Static (div)" args={{ as: 'div', padding: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<List>
			<ListRow {...args}>
				<Cluster space="3" align="center">
					<Icon name="user" size="md" />
					<span>Static row</span>
				</Cluster>
			</ListRow>
		</List>
	{/snippet}
</Story>

<Story name="Link (a)" args={{ as: 'a', href: '#', padding: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<List>
			<ListRow {...args}>
				<Cluster space="3" align="center">
					<Icon name="convert" size="md" />
					<span>Link row</span>
				</Cluster>
			</ListRow>
		</List>
	{/snippet}
</Story>

<Story name="Button" args={{ as: 'button', padding: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<List>
			<ListRow {...args}>
				<Cluster space="3" align="center">
					<Icon name="rates" size="md" />
					<span>Button row</span>
				</Cluster>
			</ListRow>
		</List>
	{/snippet}
</Story>
