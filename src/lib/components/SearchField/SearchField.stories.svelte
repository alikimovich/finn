<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SearchField from '../SearchField';

	const { Story } = defineMeta({
		title: 'Form/SearchField',
		component: SearchField,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['card', 'plain'] }
		}
	});
</script>

<Story
	name="Card (default)"
	args={{ value: '', placeholder: 'Search contacts', variant: 'card' }}
/>

<Story
	name="Plain (popover)"
	args={{ value: '', placeholder: 'Search currency', variant: 'plain' }}
/>
