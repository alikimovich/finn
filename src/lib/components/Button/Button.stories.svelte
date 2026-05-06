<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '../Button';
	import Icon from '../Icon';

	const { Story } = defineMeta({
		title: 'Form/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['primary', 'secondary', 'ghost']
			},
			size: { control: 'select', options: ['sm', 'md'] },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary', size: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>Save</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary', size: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>Cancel</Button>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost', size: 'md' }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>Cancel</Button>
	{/snippet}
</Story>

<Story name="Small" args={{ variant: 'primary', size: 'sm' }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>Save</Button>
	{/snippet}
</Story>

<Story name="With Icon" args={{ variant: 'primary' }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>
			<Icon name="plus" size="sm" />
			Add contact
		</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ variant: 'primary', disabled: true }}>
	{#snippet template({ children: _c, ...args })}
		<Button {...args}>Save</Button>
	{/snippet}
</Story>
