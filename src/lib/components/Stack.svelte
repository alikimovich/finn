<script lang="ts" module>
	export type StackSpace = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		space?: StackSpace;
		align?: 'start' | 'center' | 'end' | 'stretch';
		children: Snippet;
	}

	let { space = '3', align = 'stretch', children }: Props = $props();
</script>

<div class="stack align-{align}" style:gap={`var(--space-${space})`}>
	{@render children()}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.align-start { align-items: flex-start; }
	.align-center { align-items: center; }
	.align-end { align-items: flex-end; }
	.align-stretch { align-items: stretch; }
</style>
