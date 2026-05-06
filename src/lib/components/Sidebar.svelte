<!--
	@component
	The fixed app sidebar — brand mark, two nav groups, footer. Used once
	in `+layout.svelte`. **Don't re-use elsewhere.**
-->
<script lang="ts">
	import NavItem from './NavItem.svelte';
	import SectionLabel from './SectionLabel.svelte';
	import Icon from './Icon.svelte';
</script>

<aside class="sidebar">
	<div class="brand">
		<span class="dot" aria-hidden="true"></span>
		<span class="wordmark">finn</span>
	</div>

	<nav class="nav" aria-label="Primary">
		<SectionLabel text="Money" />
		<NavItem href="/convert" label="Convert">
			{#snippet icon()}<Icon name="convert" />{/snippet}
		</NavItem>
		<NavItem href="/send" label="Send" soon>
			{#snippet icon()}<Icon name="send" />{/snippet}
		</NavItem>
		<NavItem href="/rates" label="Rates">
			{#snippet icon()}<Icon name="rates" />{/snippet}
		</NavItem>
	</nav>

	<nav class="nav" aria-label="Network">
		<SectionLabel text="People" />
		<NavItem href="/contacts" label="Contacts">
			{#snippet icon()}<Icon name="people" />{/snippet}
		</NavItem>
		<NavItem href="/stories" label="Stories" soon>
			{#snippet icon()}<Icon name="stories" />{/snippet}
		</NavItem>
	</nav>

	<div class="footer">
		<span class="hint">v0.1 · ECB rates via Frankfurter</span>
	</div>
</aside>

<style>
	.sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		width: var(--layout-sidebar-width);
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		padding: var(--space-5) var(--space-4);
		border-right: 1px solid var(--color-border);
		background: var(--color-bg);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
	}

	.dot {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: var(--radius-circle);
		background: var(--color-accent);
	}

	.wordmark {
		font-weight: var(--weight-semibold);
		font-size: var(--text-lg);
		letter-spacing: var(--tracking-display);
	}

	.nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav :global(.section-label) {
		padding: 0 var(--space-3);
		margin-bottom: var(--space-2);
	}

	.footer {
		margin-top: auto;
		padding: var(--space-3);
		border-top: 1px solid var(--color-border);
	}

	.hint {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
</style>
