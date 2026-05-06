<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import IconButton from '../IconButton';
	import Icon from '../Icon';

	const { Story } = defineMeta({
		title: 'Form/IconButton',
		component: IconButton,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['ghost', 'danger'] },
			size: { control: 'select', options: ['sm', 'md'] }
		}
	});
</script>

<Story name="Edit" args={{ 'aria-label': 'Edit', variant: 'ghost', size: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<IconButton {...args}>
			<Icon name="edit" size="sm" />
		</IconButton>
	{/snippet}
</Story>

<Story name="Delete (danger)" args={{ 'aria-label': 'Delete', variant: 'danger', size: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<IconButton {...args}>
			<Icon name="trash" size="sm" />
		</IconButton>
	{/snippet}
</Story>

<Story name="Medium" args={{ 'aria-label': 'Close', variant: 'ghost', size: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<IconButton {...args}>
			<Icon name="close" size="sm" />
		</IconButton>
	{/snippet}
</Story>
