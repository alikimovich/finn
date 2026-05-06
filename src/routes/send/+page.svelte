<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="Send"
	subtitle="Move money to a contact or bank account in any supported currency."
/>

<Card>
	<div class="placeholder">
		<Badge variant="soft">Coming soon</Badge>
		<p>
			Linked banks, contacts, and one-tap transfers in the same FX engine that
			powers Convert.
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
