<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>finn</title>
</svelte:head>

<div class="shell">
	<Sidebar />
	<main class="main">
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

	.content {
		width: 100%;
		max-width: 880px;
		padding: var(--space-7) var(--space-6) var(--space-8);
	}
</style>
