<!--
	@component
	Square icon-only button. Requires `aria-label`. Use for row actions,
	dialog close, and any "icon as a button" pattern.

	Props:
	- `variant` — `'default' | 'danger'` (default `'default'`).
	- `size` — `'sm' | 'md'` (default `'sm'`).
	- `aria-label` — string (required for accessibility).
	- All native `<button>` attributes.

	@example
	```svelte
	<IconButton aria-label="Edit"><Icon name="edit" size="sm" /></IconButton>
	<IconButton variant="danger" aria-label="Delete">
	  <Icon name="trash" size="sm" />
	</IconButton>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'ghost' | 'danger';
		size?: 'sm' | 'md';
		'aria-label': string;
		children: Snippet;
	}

	let {
		variant = 'ghost',
		size = 'sm',
		type = 'button',
		children,
		...rest
	}: Props = $props();
</script>

<button {type} class="icon-btn variant-{variant} size-{size}" {...rest}>
	{@render children()}
</button>

<style>
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		transition:
			background-color var(--dur-2) var(--ease-standard),
			color var(--dur-2) var(--ease-standard);
	}

	.size-sm {
		width: var(--control-height-sm);
		height: var(--control-height-sm);
	}

	.size-md {
		width: var(--control-height-md);
		height: var(--control-height-md);
	}

	.variant-ghost:hover:not(:disabled) {
		background: var(--color-accent-soft);
		color: var(--color-text);
	}

	.variant-danger:hover:not(:disabled) {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.icon-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
