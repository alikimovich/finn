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
		font-weight: 500;
		line-height: 1;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease,
			transform 80ms ease;
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
		font-size: 12.5px;
		padding: 0 var(--space-3);
		height: 28px;
	}

	.size-md {
		font-size: 13.5px;
		padding: 0 var(--space-4);
		height: 36px;
	}

	.variant-primary {
		background: var(--accent);
		color: var(--accent-text-on-dark);
		border: 1px solid var(--accent);
	}

	.variant-primary:hover:not(:disabled) {
		background: #2a2a23;
		border-color: #2a2a23;
	}

	.variant-secondary {
		background: var(--surface);
		color: var(--text);
		border: 1px solid var(--border-strong);
	}

	.variant-secondary:hover:not(:disabled) {
		background: var(--accent-soft);
	}

	.variant-ghost {
		background: transparent;
		color: var(--text-muted);
		border: 1px solid transparent;
	}

	.variant-ghost:hover:not(:disabled) {
		background: var(--accent-soft);
		color: var(--text);
	}
</style>
