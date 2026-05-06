<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PageHeader from '../PageHeader';
	import Button from '../Button';
	import Icon from '../Icon';

	const { Story } = defineMeta({
		title: 'Page/PageHeader',
		component: PageHeader,
		tags: ['autodocs']
	});
</script>

<Story
	name="Title only"
	args={{ title: 'Convert' }}
/>

<Story
	name="With subtitle"
	args={{
		title: 'Convert',
		subtitle: 'Live FX rates from the European Central Bank.'
	}}
/>

<Story
	name="With actions"
	args={{
		title: 'Contacts',
		subtitle: 'People you send to and receive from.'
	}}
>
	{#snippet template(args)}
		<PageHeader {...args}>
			{#snippet actions()}
				<Button variant="primary">
					<Icon name="plus" size="sm" />
					Add contact
				</Button>
			{/snippet}
		</PageHeader>
	{/snippet}
</Story>
