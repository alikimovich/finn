<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from '../Dialog';
	import Button from '../Button';
	import Field from '../Field';
	import Stack from '../Stack';

	const { Story } = defineMeta({
		title: 'Containers/Dialog',
		component: Dialog,
		tags: ['autodocs']
	});
</script>

<Story name="With form">
	{#snippet template()}
		{@const noop = () => {}}
		<Dialog open={true} title="New contact" onClose={noop}>
			<Stack space="4">
				<Field label="Name">
					<input type="text" placeholder="Jane Doe" />
				</Field>
				<Field label="Email" optional>
					<input type="email" placeholder="jane@example.com" />
				</Field>
			</Stack>
			{#snippet footer()}
				<Button variant="ghost" size="sm" onclick={noop}>Cancel</Button>
				<Button variant="primary" size="sm" onclick={noop}>Save</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Title only (no footer)">
	{#snippet template()}
		{@const noop = () => {}}
		<Dialog open={true} title="Heads up" onClose={noop}>
			<p>This dialog has body text but no footer actions.</p>
		</Dialog>
	{/snippet}
</Story>
