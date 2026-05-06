<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		padding?: 'sm' | 'md' | 'lg';
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
