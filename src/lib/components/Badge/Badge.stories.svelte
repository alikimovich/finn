<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from '../Badge';

	const { Story } = defineMeta({
		title: 'Bits/Badge',
		component: Badge,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['neutral', 'soft', 'success'] }
		}
	});
</script>

<Story name="Neutral" args={{ variant: 'neutral' }}>
	{#snippet template({ children: _c, ...args })}
		<Badge {...args}>soon</Badge>
	{/snippet}
</Story>

<Story name="Soft" args={{ variant: 'soft' }}>
	{#snippet template({ children: _c, ...args })}
		<Badge {...args}>Coming soon</Badge>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet template({ children: _c, ...args })}
		<Badge {...args}>Saved</Badge>
	{/snippet}
</Story>
