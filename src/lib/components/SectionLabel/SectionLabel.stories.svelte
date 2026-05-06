<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SectionLabel from '../SectionLabel';

	const { Story } = defineMeta({
		title: 'Page/SectionLabel',
		component: SectionLabel,
		tags: ['autodocs'],
		argTypes: {
			as: { control: 'select', options: ['div', 'h2'] }
		}
	});
</script>

<Story name="Default (div)" args={{ text: 'Money', as: 'div' }} />

<Story name="As heading (h2)" args={{ text: 'Recent', as: 'h2' }} />
