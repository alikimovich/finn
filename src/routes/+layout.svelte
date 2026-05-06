<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	const ROUTE_TITLES: Record<string, string> = {
		'/convert': 'Convert',
		'/rates': 'Rates',
		'/contacts': 'Contacts',
		'/send': 'Send',
		'/stories': 'Stories',
		'/design': 'Design system'
	};

	const title = $derived.by(() => {
		const pathname = page.url.pathname;
		const match = ROUTE_TITLES[pathname];
		return match ? `${match} · finn` : 'finn';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title}</title>
</svelte:head>

<a class="skip-link" href="#main">Skip to main content</a>

<div class="shell">
	<Sidebar />
	<main id="main" class="main" tabindex="-1">
		<div class="content">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.shell {
		display: flex;
		min-height: 100vh;
		align-items: flex-start;
	}

	.main {
		flex: 1;
		min-width: 0;
		display: flex;
		justify-content: center;
	}

	.main:focus {
		outline: none;
	}

	.content {
		width: 100%;
		max-width: var(--layout-content-max);
		padding: var(--space-7) var(--space-6) var(--space-8);
	}
</style>
