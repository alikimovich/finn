<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from '../Input';

	const { Story } = defineMeta({
		title: 'Form/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'select', options: ['md', 'xl'] },
			align: { control: 'select', options: ['left', 'right'] }
		}
	});
</script>

<Story
	name="Default"
	args={{ value: '', placeholder: 'Type something…', size: 'md' }}
/>

<Story
	name="Display (xl, right-aligned)"
	args={{ value: '1,234.56', size: 'xl', align: 'right', type: 'text' }}
/>

<Story name="Number" args={{ value: 100, size: 'md', type: 'number' }} />
