<!--
	@component
	Elevated surface for grouping related content. The default container
	for forms, summaries, and any "panel of stuff."

	Props:
	- `padding` — `'sm' | 'md' | 'lg'` (default `'md'`). Maps to
	  `--space-4` / `--space-5` / `--space-6`.
	- `children` — content.

	@example
	```svelte
	<Card padding="lg">
	  <Stack space="4">…</Stack>
	</Card>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Inner padding. Maps to `--space-4` / `--space-5` / `--space-6`.
		 * @default 'lg'
		 */
		padding?: 'sm' | 'md' | 'lg';
		/** Card body. */
		children: Snippet;
	}

	let { padding = 'lg', children }: Props = $props();
</script>

<div class="card padding-{padding}">
	{@render children()}
</div>

<style>
	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.padding-sm {
		padding: var(--space-4);
	}

	.padding-md {
		padding: var(--space-5);
	}

	.padding-lg {
		padding: var(--space-6);
	}
</style>
