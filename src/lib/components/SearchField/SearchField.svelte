<!--
	@component
	Magnifier-iconed text input. Use for any "search this list"
	pattern.

	Props:
	- `value` — string (bindable).
	- `placeholder` — string.
	- `variant` — `'card' | 'plain'` (default `'card'`). `card` for stand-alone
	  use; `plain` for placement inside a popover (no border, divider underneath).

	@example
	```svelte
	<SearchField bind:value={query} placeholder="Search contacts" />
	```
-->
<script lang="ts">
	import Icon from '../Icon';

	interface Props {
		/** Bindable query string. */
		value: string;
		/**
		 * Placeholder text inside the field.
		 * @default 'Search'
		 */
		placeholder?: string;
		/**
		 * Surface treatment. `card` for stand-alone use; `plain` for
		 * placement inside a popover (no border, divider underneath).
		 * @default 'card'
		 */
		variant?: 'plain' | 'card';
	}

	let {
		value = $bindable(),
		placeholder = 'Search',
		variant = 'card'
	}: Props = $props();
</script>

<div class="search variant-{variant}">
	<span class="search-icon">
		<Icon name="search" size="sm" />
	</span>
	<input bind:value type="text" {placeholder} autocomplete="off" />
</div>

<style>
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text-subtle);
		transition: border-color var(--dur-2) var(--ease-standard);
	}

	.variant-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0 var(--space-4);
		height: var(--control-height-lg);
	}

	.variant-card:focus-within {
		border-color: var(--color-border-strong);
	}

	.variant-plain {
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.search-icon {
		display: inline-flex;
		flex-shrink: 0;
	}

	input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		font-size: var(--text-base);
		color: var(--color-text);
	}

	input::placeholder {
		color: var(--color-text-subtle);
	}
</style>
