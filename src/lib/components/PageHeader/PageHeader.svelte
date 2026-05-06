<!--
	@component
	**Every route page opens with this.** Title + optional subtitle +
	optional actions snippet on the right.

	Props:
	- `title` — string (required).
	- `subtitle` — string (optional).
	- Snippet: `actions`.

	@example
	```svelte
	<PageHeader title="Convert" subtitle="Live FX rates from the European Central Bank." />

	<PageHeader title="Contacts" subtitle="People you send to and receive from.">
	  {#snippet actions()}
	    <Button variant="primary"><Icon name="plus" size="sm" />Add contact</Button>
	  {/snippet}
	</PageHeader>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Page title (`<h1>`). */
		title: string;
		/** Supporting copy under the title. */
		subtitle?: string;
		/** Action snippet rendered on the right (e.g. an "Add" button). */
		actions?: Snippet;
	}

	let { title, subtitle, actions }: Props = $props();
</script>

<header class="page-header" class:has-actions={Boolean(actions)}>
	<div class="text">
		<h1>{title}</h1>
		{#if subtitle}
			<p class="subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.page-header {
		margin-bottom: var(--space-5);
	}

	.has-actions {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-4);
	}

	h1 {
		font-size: var(--text-3xl);
		letter-spacing: var(--tracking-display);
	}

	.subtitle {
		color: var(--color-text-muted);
		font-size: var(--text-base);
		margin-top: var(--space-1);
	}
</style>
