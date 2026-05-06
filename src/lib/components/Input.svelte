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
		outline: none;
		transition: border-color 120ms ease, background-color 120ms ease;
	}

	.input:focus {
		border-color: var(--border-strong);
		background: var(--surface);
	}

	.input::placeholder {
		color: var(--text-subtle);
	}

	.size-md {
		height: 36px;
		padding: 0 var(--space-3);
		font-size: 13.5px;
	}

	.size-xl {
		font-size: 36px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
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
