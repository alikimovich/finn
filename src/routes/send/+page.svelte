<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Stack from '$lib/components/Stack.svelte';
</script>

<PageHeader
	title="Send"
	subtitle="Move money to a contact or bank account in any supported currency."
/>

<Card>
	<Stack space="3" align="start">
		<Badge variant="soft">Coming soon</Badge>
		<p>
			Linked banks, contacts, and one-tap transfers in the same FX engine that
			powers Convert.
		</p>
	</Stack>
</Card>

<style>
	p {
		max-width: 60ch;
	}
</style>
