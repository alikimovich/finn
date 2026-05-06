<!--
	@component
	Centered empty/zero-data display. Use this for empty lists,
	no-search-results states, and "coming soon" placeholders. Don't roll
	your own.

	Props:
	- `title` — string (optional).
	- `description` — string (optional).
	- `tone` — `'default' | 'subtle'` (default `'default'`). `subtle` for
	  inline filter-empty states (e.g. "no results match…").
	- Snippets: `icon`, `action`.

	@example
	```svelte
	<EmptyState title="No contacts yet" description="Add the people you most often send money to.">
	  {#snippet icon()}<Icon name="user" size="lg" />{/snippet}
	  {#snippet action()}<Button variant="secondary" size="sm">Add</Button>{/snippet}
	</EmptyState>

	<EmptyState tone="subtle" description={`No contacts match "${query}".`} />
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Headline above the description. */
		title?: string;
		/** Supporting text under the title. */
		description?: string;
		/** Decorative glyph rendered above the title — typically an `<Icon>`. */
		icon?: Snippet;
		/** Optional action button (e.g. "Add your first contact"). */
		action?: Snippet;
		/**
		 * Visual weight. `subtle` is the inline filter-empty form
		 * (e.g. "no results match…"); `default` is the full empty state.
		 * @default 'default'
		 */
		tone?: 'default' | 'subtle';
	}

	let { title, description, icon, action, tone = 'default' }: Props = $props();
</script>

<div class="empty tone-{tone}">
	{#if icon}
		<div class="empty-icon">
			{@render icon()}
		</div>
	{/if}
	{#if title}
		<p class="empty-title">{title}</p>
	{/if}
	{#if description}
		<p class="empty-sub">{description}</p>
	{/if}
	{#if action}
		<div class="empty-action">
			{@render action()}
		</div>
	{/if}
</div>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		text-align: center;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}

	.tone-default {
		padding: var(--space-7) var(--space-5);
	}

	.tone-subtle {
		padding: var(--space-5);
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}

	.empty-icon {
		color: var(--color-text-subtle);
		margin-bottom: var(--space-2);
	}

	.empty-title {
		font-size: var(--text-md);
		font-weight: var(--weight-semibold);
		color: var(--color-text);
	}

	.empty-sub {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		max-width: 40ch;
	}

	.empty-action {
		margin-top: var(--space-3);
	}
</style>
