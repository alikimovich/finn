<!--
	@component
	Form-row wrapper that pairs an uppercase label with any control. Use
	this for **every form row**. `<input>` and `<textarea>` placed inside
	are styled automatically — don't wrap them in your own `<label>`.

	Renders `<label>` by default (clicking the label focuses its input);
	pass `as="div"` when wrapping a non-form-control like
	`<CurrencyPicker>`.

	Props:
	- `label` — string (required).
	- `optional` — boolean (default `false`). Adds an "(optional)" hint.
	- `as` — `'label' | 'div'` (default `'label'`).
	- `children` — the control.

	@example
	```svelte
	<Field label="Name">
	  <input bind:value={name} type="text" required />
	</Field>

	<Field label="Email" optional>
	  <input bind:value={email} type="email" />
	</Field>

	<Field label="Currency" as="div">
	  <CurrencyPicker selected={code} onSelect={(c) => (code = c)} />
	</Field>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		optional?: boolean;
		as?: 'label' | 'div';
		children: Snippet;
	}

	let { label, optional = false, as = 'label', children }: Props = $props();
</script>

{#if as === 'label'}
	<label class="field">
		<span class="field-label">
			{label}
			{#if optional}<span class="optional">(optional)</span>{/if}
		</span>
		{@render children()}
	</label>
{:else}
	<div class="field">
		<span class="field-label">
			{label}
			{#if optional}<span class="optional">(optional)</span>{/if}
		</span>
		{@render children()}
	</div>
{/if}

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.field-label {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--tracking-caps-sm);
		color: var(--color-text-muted);
	}

	.optional {
		text-transform: none;
		letter-spacing: var(--tracking-normal);
		font-weight: var(--weight-regular);
		color: var(--color-text-subtle);
		margin-left: var(--space-1);
	}

	/* Style native form controls placed inside Field consistently. */
	.field :global(input[type='text']),
	.field :global(input[type='email']),
	.field :global(input[type='number']),
	.field :global(input[type='search']),
	.field :global(textarea) {
		width: 100%;
		font-family: inherit;
		font-size: var(--text-base);
		color: var(--color-text);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		transition: border-color var(--dur-2) var(--ease-standard);
	}

	.field :global(input:focus),
	.field :global(textarea:focus) {
		border-color: var(--color-accent);
	}

	.field :global(textarea) {
		resize: vertical;
		line-height: var(--leading-normal);
		min-height: 72px;
	}
</style>
