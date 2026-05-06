<!--
	@component
	Used inside `<Sidebar>`. Active state is derived from the current
	route via `$app/state`. Don't use outside the sidebar.

	Props:
	- `href` — string (required).
	- `label` — string (required).
	- `soon` — boolean (default `false`). Adds a "soon" badge.
	- Snippet: `icon`.

	@example
	```svelte
	<NavItem href="/convert" label="Convert">
	  {#snippet icon()}<Icon name="convert" />{/snippet}
	</NavItem>
	<NavItem href="/send" label="Send" soon>…</NavItem>
	```
-->
<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import Badge from '../Badge';

	interface Props {
		/** Route this item links to. */
		href: string;
		/** Visible label. */
		label: string;
		/** Leading icon snippet — usually an `<Icon>`. */
		icon?: Snippet;
		/**
		 * Marks the item as "coming soon" with a small badge.
		 * @default false
		 */
		soon?: boolean;
		/**
		 * How the active state is determined: exact path equality, or
		 * prefix match (covers nested routes).
		 * @default 'prefix'
		 */
		match?: 'exact' | 'prefix';
	}

	let { href, label, icon, soon = false, match = 'prefix' }: Props = $props();

	const active = $derived.by(() => {
		const path = page.url.pathname;
		return match === 'exact' ? path === href : path === href || path.startsWith(href + '/');
	});
</script>

<a {href} class="nav-item" class:active aria-current={active ? 'page' : undefined}>
	{#if icon}
		<span class="icon">{@render icon()}</span>
	{/if}
	<span class="label">{label}</span>
	{#if soon}
		<Badge variant="neutral">soon</Badge>
	{/if}
</a>

<style>
	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-weight: var(--weight-medium);
		font-size: var(--text-base);
		line-height: var(--leading-tight);
		transition:
			background-color var(--dur-2) var(--ease-standard),
			color var(--dur-2) var(--ease-standard);
	}

	.nav-item:hover {
		background: var(--color-accent-soft);
		color: var(--color-text);
	}

	.nav-item.active {
		background: var(--color-accent-soft);
		color: var(--color-text);
		font-weight: var(--weight-semibold);
	}

	.icon {
		display: inline-flex;
		width: var(--icon-md);
		height: var(--icon-md);
		align-items: center;
		justify-content: center;
		color: var(--color-text-subtle);
	}

	.active .icon {
		color: var(--color-text);
	}

	.label {
		flex: 1;
	}
</style>
