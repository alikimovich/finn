<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'size'> {
		value: string | number;
		size?: 'md' | 'xl';
		align?: 'left' | 'right';
	}

	let {
		value = $bindable(),
		size = 'md',
		align = 'left',
		type = 'text',
		...rest
	}: Props = $props();
</script>

<input
	{type}
	bind:value
	class="input size-{size} align-{align}"
	{...rest}
/>

<style>
	.input {
		width: 100%;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		transition:
			border-color var(--dur-2) var(--ease-standard),
			background-color var(--dur-2) var(--ease-standard);
	}

	.input:focus {
		border-color: var(--color-border-strong);
		background: var(--color-surface);
	}

	.input::placeholder {
		color: var(--color-text-subtle);
	}

	.size-md {
		height: var(--control-height-md);
		padding: 0 var(--space-3);
		font-size: var(--text-base);
	}

	.size-xl {
		font-size: var(--text-display);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-display);
		line-height: var(--leading-snug);
		padding: var(--space-2) 0;
		font-variant-numeric: tabular-nums;
	}

	.size-xl:focus {
		border-color: transparent;
		background: transparent;
	}

	.align-left {
		text-align: left;
	}

	.align-right {
		text-align: right;
	}

	/* Hide native number spinners */
	.input[type='number']::-webkit-outer-spin-button,
	.input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
