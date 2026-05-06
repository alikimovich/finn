<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Icon, { type IconName } from '../Icon';
	import Cluster from '../Cluster';

	const { Story } = defineMeta({
		title: 'Bits/Icon',
		component: Icon,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
			name: {
				control: 'select',
				options: [
					'arrow-right',
					'check',
					'chevron-down',
					'close',
					'convert',
					'edit',
					'people',
					'plus',
					'rates',
					'search',
					'send',
					'stories',
					'swap-vertical',
					'trash',
					'trend-up',
					'user'
				]
			}
		}
	});

	const allIcons: IconName[] = [
		'arrow-right',
		'check',
		'chevron-down',
		'close',
		'convert',
		'edit',
		'people',
		'plus',
		'rates',
		'search',
		'send',
		'stories',
		'swap-vertical',
		'trash',
		'trend-up',
		'user'
	];
</script>

<Story name="Default" args={{ name: 'convert', size: 'md' }} />

<Story name="All sizes">
	<Cluster space="4" align="end">
		<Icon name="convert" size="xs" />
		<Icon name="convert" size="sm" />
		<Icon name="convert" size="md" />
		<Icon name="convert" size="lg" />
	</Cluster>
</Story>

<Story name="All glyphs">
	<Cluster space="5" align="center" wrap={true}>
		{#each allIcons as iconName (iconName)}
			<Cluster space="1" align="center">
				<Icon name={iconName} size="md" />
				<code>{iconName}</code>
			</Cluster>
		{/each}
	</Cluster>
</Story>
