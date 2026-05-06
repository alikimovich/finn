<!--
	@component
	Horizontal flex with tokenized gap; wraps by default. The horizontal
	counterpart to `<Stack>`. Use it whenever you'd otherwise write
	`display: flex; gap: var(--space-N)`.

	Props:
	- `space` — `'1' | '2' | '3' | '4' | '5' | '6'` (default `'2'`).
	- `align` — `'start' | 'center' | 'end' | 'baseline' | 'stretch'` (default `'center'`).
	- `justify` — `'start' | 'center' | 'end' | 'between'` (optional).
	- `wrap` — boolean (default `true`).
	- `as` — `'div' | 'span'` (default `'div'`).

	@example
	```svelte
	<Cluster space="2"><span>1 USD = 0.92 EUR</span><DotSep /><span>updated</span></Cluster>
	<Cluster justify="between"><h2>Recent</h2><Button variant="ghost">Clear</Button></Cluster>
	```
-->
<script lang="ts" module>
	export type ClusterSpace = '1' | '2' | '3' | '4' | '5' | '6';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		space?: ClusterSpace;
		align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
		justify?: 'start' | 'center' | 'end' | 'between';
		wrap?: boolean;
		as?: 'div' | 'span';
		children: Snippet;
	}

	let {
		space = '2',
		align = 'center',
		justify,
		wrap = true,
		as = 'div',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="cluster align-{align}"
	class:justify-start={justify === 'start'}
	class:justify-center={justify === 'center'}
	class:justify-end={justify === 'end'}
	class:justify-between={justify === 'between'}
	class:nowrap={!wrap}
	style:gap={`var(--space-${space})`}
>
	{@render children()}
</svelte:element>

<style>
	.cluster {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		min-width: 0;
	}

	.nowrap { flex-wrap: nowrap; }

	.align-start { align-items: flex-start; }
	.align-center { align-items: center; }
	.align-end { align-items: flex-end; }
	.align-baseline { align-items: baseline; }
	.align-stretch { align-items: stretch; }

	.justify-start { justify-content: flex-start; }
	.justify-center { justify-content: center; }
	.justify-end { justify-content: flex-end; }
	.justify-between { justify-content: space-between; }
</style>
