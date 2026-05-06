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

	Amount-row pattern — pass `wrap={false}` or the `width: 100%` Input
	will be pushed to its own line by the default wrapping behavior:

	```svelte
	<Cluster space="4" wrap={false}>
		<CurrencyPicker selected={code} onSelect={(c) => (code = c)} />
		<Input bind:value={amount} size="xl" align="right" />
	</Cluster>
	```
-->
<script lang="ts" module>
	export type ClusterSpace = '1' | '2' | '3' | '4' | '5' | '6';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Horizontal gap between children, mapped to `--space-{N}` tokens.
		 * @default '2'
		 */
		space?: ClusterSpace;
		/**
		 * Cross-axis (vertical) alignment of children.
		 * @default 'center'
		 */
		align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
		/**
		 * Main-axis (horizontal) distribution. `between` pushes the first
		 * child left and the last right (use for action bars).
		 */
		justify?: 'start' | 'center' | 'end' | 'between';
		/**
		 * Whether children wrap to a new line when they overflow.
		 * @default true
		 */
		wrap?: boolean;
		/**
		 * Wrapping element. Use `'span'` when nesting inside text.
		 * @default 'div'
		 */
		as?: 'div' | 'span';
		/** Children, rendered left-to-right with `space` between them. */
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
