<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md';
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		children,
		...rest
	}: Props = $props();
</script>

<button {type} class="btn variant-{variant} size-{size}" {...rest}>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		border-radius: var(--radius-md);
		font-weight: var(--weight-medium);
		line-height: var(--leading-tight);
		transition:
			background-color var(--dur-2) var(--ease-standard),
			border-color var(--dur-2) var(--ease-standard),
			color var(--dur-2) var(--ease-standard),
			transform var(--dur-1) var(--ease-standard);
		white-space: nowrap;
	}

	.btn:active {
		transform: translateY(1px);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.size-sm {
		font-size: var(--text-sm);
		padding: 0 var(--control-pad-x-sm);
		height: var(--control-height-sm);
	}

	.size-md {
		font-size: var(--text-base);
		padding: 0 var(--control-pad-x-md);
		height: var(--control-height-md);
	}

	.variant-primary {
		background: var(--color-accent);
		color: var(--color-text-on-accent);
		border: 1px solid var(--color-accent);
	}

	.variant-primary:hover:not(:disabled) {
		background: var(--color-accent-hover);
		border-color: var(--color-accent-hover);
	}

	.variant-secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border-strong);
	}

	.variant-secondary:hover:not(:disabled) {
		background: var(--color-accent-soft);
	}

	.variant-ghost {
		background: transparent;
		color: var(--color-text-muted);
		border: 1px solid transparent;
	}

	.variant-ghost:hover:not(:disabled) {
		background: var(--color-accent-soft);
		color: var(--color-text);
	}
</style>
