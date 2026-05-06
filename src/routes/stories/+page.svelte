<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Stack from '$lib/components/Stack.svelte';
</script>

<PageHeader
	title="Stories"
	subtitle="Short-form financial advice from people you follow."
/>

<Card>
	<Stack space="3" align="start">
		<Badge variant="soft">Coming soon</Badge>
		<p>
			A daily feed of bite-sized financial tips, market notes, and recipes for
			better money habits.
		</p>
	</Stack>
</Card>

<style>
	p {
		max-width: 60ch;
	}
</style>
