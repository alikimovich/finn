<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		label: string;
		icon?: Snippet;
		soon?: boolean;
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
		<span class="soon">soon</span>
	{/if}
</a>

<style>
	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		font-weight: 500;
		font-size: 13.5px;
		line-height: 1;
		transition: background-color 120ms ease, color 120ms ease;
	}

	.nav-item:hover {
		background: var(--accent-soft);
		color: var(--text);
	}

	.nav-item.active {
		background: var(--accent-soft);
		color: var(--text);
		font-weight: 600;
	}

	.icon {
		display: inline-flex;
		width: 16px;
		height: 16px;
		align-items: center;
		justify-content: center;
		color: var(--text-subtle);
	}

	.active .icon {
		color: var(--text);
	}

	.label {
		flex: 1;
	}

	.soon {
		font-size: 10.5px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-subtle);
		background: var(--bg);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}
</style>
