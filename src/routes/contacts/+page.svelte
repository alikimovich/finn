<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<header class="header">
	<h1>Contacts</h1>
	<p>People you send to and receive from.</p>
</header>

<Card>
	<div class="placeholder">
		<div class="badge">Coming soon</div>
		<p>Save recipients, link accounts, and preview their preferred currency.</p>
	</div>
</Card>

<style>
	.header {
		margin-bottom: var(--space-5);
	}
	h1 {
		font-size: 24px;
		letter-spacing: -0.02em;
	}
	p {
		color: var(--text-muted);
		font-size: 13.5px;
		margin-top: var(--space-1);
	}
	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) 0;
	}
	.badge {
		font-size: 10.5px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		background: var(--accent-soft);
		padding: 4px 8px;
		border-radius: var(--radius-sm);
	}
	.placeholder p {
		max-width: 60ch;
		margin: 0;
	}
</style>
