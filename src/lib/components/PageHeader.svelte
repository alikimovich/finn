<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		actions?: Snippet;
	}

	let { title, subtitle, actions }: Props = $props();
</script>

<header class="page-header" class:has-actions={Boolean(actions)}>
	<div class="text">
		<h1>{title}</h1>
		{#if subtitle}
			<p class="subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.page-header {
		margin-bottom: var(--space-5);
	}

	.has-actions {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-4);
	}

	h1 {
		font-size: var(--text-3xl);
		letter-spacing: var(--tracking-display);
	}

	.subtitle {
		color: var(--color-text-muted);
		font-size: var(--text-base);
		margin-top: var(--space-1);
	}
</style>
