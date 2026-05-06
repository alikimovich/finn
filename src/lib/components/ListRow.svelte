<!--
	@component
	The row used in every list across the app. Provides surface
	(background, border, hover, padding); inner layout is the consumer's
	responsibility — usually a `<Cluster>` or small grid wrapper. Renders
	an `<li>` wrapping an inner element selected by `as`.

	Props:
	- `as` — `'div' | 'a' | 'button'` (default `'div'`).
	- `padding` — `'sm' | 'md'` (default `'sm'`).
	- `href` — string (when `as="a"`).
	- `onclick` — `(e) => void` (when `as="button"`).
	- `aria-label` — string.

	@example
	```svelte
	<ListRow padding="sm">…</ListRow>
	<ListRow as="a" href="/x" padding="md">…</ListRow>
	<ListRow as="button" onclick={() => load(item)}>…</ListRow>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		as?: 'div' | 'a' | 'button';
		padding?: 'sm' | 'md';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		'aria-label'?: string;
		children: Snippet;
	}

	let {
		as = 'div',
		padding = 'sm',
		href,
		onclick,
		'aria-label': ariaLabel,
		children
	}: Props = $props();
</script>

<li class="list-row">
	{#if as === 'a'}
		<a class="surface padding-{padding}" {href} aria-label={ariaLabel}>
			{@render children()}
		</a>
	{:else if as === 'button'}
		<button
			class="surface padding-{padding}"
			type="button"
			{onclick}
			aria-label={ariaLabel}
		>
			{@render children()}
		</button>
	{:else}
		<div class="surface padding-{padding}">
			{@render children()}
		</div>
	{/if}
</li>

<style>
	.list-row {
		min-width: 0;
	}

	.surface {
		display: block;
		width: 100%;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-align: left;
		color: inherit;
		transition:
			border-color var(--dur-2) var(--ease-standard),
			background-color var(--dur-2) var(--ease-standard);
	}

	a.surface,
	button.surface {
		cursor: pointer;
	}

	a.surface:hover,
	button.surface:hover {
		border-color: var(--color-border-strong);
	}

	.padding-sm {
		padding: var(--space-3) var(--space-4);
	}

	.padding-md {
		padding: var(--space-4) var(--space-5);
	}
</style>
