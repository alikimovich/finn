<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="Stories"
	subtitle="Short-form financial advice from people you follow."
/>

<Card>
	<div class="placeholder">
		<Badge variant="soft">Coming soon</Badge>
		<p>
			A daily feed of bite-sized financial tips, market notes, and recipes for
			better money habits.
		</p>
	</div>
</Card>

<style>
	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) 0;
	}

	.placeholder p {
		max-width: 60ch;
		margin: 0;
	}
</style>
