<script lang="ts">
	import NavItem from './NavItem.svelte';
</script>

<aside class="sidebar">
	<div class="brand">
		<span class="dot" aria-hidden="true"></span>
		<span class="wordmark">finn</span>
	</div>

	<nav class="nav" aria-label="Primary">
		<div class="section-label">Money</div>
		<NavItem href="/convert" label="Convert">
			{#snippet icon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 5h9M9 2l3 3-3 3M13 11H4M7 14l-3-3 3-3" />
				</svg>
			{/snippet}
		</NavItem>
		<NavItem href="/send" label="Send" soon>
			{#snippet icon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2 7 9M14 2l-5 12-2-5-5-2 12-5Z" />
				</svg>
			{/snippet}
		</NavItem>
		<NavItem href="/rates" label="Rates" soon>
			{#snippet icon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M2 12 6 8l3 3 5-7" />
					<path d="M10 4h4v4" />
				</svg>
			{/snippet}
		</NavItem>
	</nav>

	<nav class="nav" aria-label="Network">
		<div class="section-label">People</div>
		<NavItem href="/contacts" label="Contacts" soon>
			{#snippet icon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="8" cy="6" r="3" />
					<path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
				</svg>
			{/snippet}
		</NavItem>
		<NavItem href="/stories" label="Stories" soon>
			{#snippet icon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="2" y="3" width="12" height="10" rx="2" />
					<path d="M2 7h12" />
				</svg>
			{/snippet}
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
		width: 240px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		padding: var(--space-5) var(--space-4);
		border-right: 1px solid var(--border);
		background: var(--bg);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
	}

	.wordmark {
		font-weight: 600;
		font-size: 15px;
		letter-spacing: -0.02em;
	}

	.nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.section-label {
		font-size: 10.5px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-subtle);
		padding: 0 var(--space-3);
		margin-bottom: var(--space-2);
	}

	.footer {
		margin-top: auto;
		padding: var(--space-3);
		border-top: 1px solid var(--border);
	}

	.hint {
		font-size: 11.5px;
		color: var(--text-subtle);
	}
</style>
