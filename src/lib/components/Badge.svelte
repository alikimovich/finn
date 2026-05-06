<!--
	@component
	Small uppercase label for status, "soon" hints, or saved confirmations.

	Props:
	- `variant` — `'neutral' | 'soft' | 'success'` (default `'neutral'`).
	- `children` — text content.

	@example
	```svelte
	<Badge variant="neutral">soon</Badge>
	<Badge variant="soft">Coming soon</Badge>
	<Badge variant="success">Saved ✓</Badge>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'neutral' | 'soft' | 'success';
		children: Snippet;
	}

	let { variant = 'neutral', children }: Props = $props();
</script>

<span class="badge variant-{variant}">
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-2xs);
		font-weight: var(--weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--tracking-caps);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		line-height: var(--leading-tight);
	}

	.variant-neutral {
		background: var(--color-bg);
		color: var(--color-text-subtle);
	}

	.variant-soft {
		background: var(--color-accent-soft);
		color: var(--color-text-muted);
	}

	.variant-success {
		background: var(--color-accent-soft);
		color: var(--color-success);
	}
</style>
