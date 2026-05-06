<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Field from '../Field';
	import Stack from '../Stack';

	const { Story } = defineMeta({
		title: 'Form/Field',
		component: Field,
		tags: ['autodocs'],
		argTypes: {
			as: { control: 'select', options: ['label', 'div'] },
			optional: { control: 'boolean' }
		}
	});
</script>

<Story name="Text" args={{ label: 'Name' }}>
	{#snippet template({ children: _c, ...args })}
		<Field {...args}>
			<input type="text" placeholder="Jane Doe" />
		</Field>
	{/snippet}
</Story>

<Story name="Optional" args={{ label: 'Email', optional: true }}>
	{#snippet template({ children: _c, ...args })}
		<Field {...args}>
			<input type="email" placeholder="jane@example.com" />
		</Field>
	{/snippet}
</Story>

<Story name="Stacked form">
	<Stack space="4">
		<Field label="Name">
			<input type="text" placeholder="Jane Doe" />
		</Field>
		<Field label="Email" optional>
			<input type="email" placeholder="jane@example.com" />
		</Field>
		<Field label="Note" optional>
			<textarea placeholder="What's this for?"></textarea>
		</Field>
	</Stack>
</Story>
