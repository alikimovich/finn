<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EmptyState from '../EmptyState';
	import Icon from '../Icon';
	import Button from '../Button';

	const { Story } = defineMeta({
		title: 'Containers/EmptyState',
		component: EmptyState,
		tags: ['autodocs'],
		argTypes: {
			tone: { control: 'select', options: ['default', 'subtle'] }
		}
	});
</script>

<Story
	name="Default"
	args={{
		title: 'No contacts yet',
		description: 'Add the people you most often send money to.'
	}}
>
	{#snippet template(args)}
		<EmptyState {...args}>
			{#snippet icon()}<Icon name="user" size="lg" />{/snippet}
			{#snippet action()}<Button variant="secondary" size="sm">Add contact</Button>{/snippet}
		</EmptyState>
	{/snippet}
</Story>

<Story
	name="Subtle (filter empty)"
	args={{ description: 'No contacts match "alex".', tone: 'subtle' }}
/>

<Story name="Title only" args={{ title: 'Coming soon' }} />
