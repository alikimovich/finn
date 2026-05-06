<script lang="ts">
	interface Props {
		text: string;
		as?: 'div' | 'h2';
	}

	let { text, as = 'div' }: Props = $props();
</script>

{#if as === 'h2'}
	<h2 class="section-label">{text}</h2>
{:else}
	<div class="section-label">{text}</div>
{/if}

<style>
	.section-label {
		font-size: var(--text-2xs);
		font-weight: var(--weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--tracking-caps);
		color: var(--color-text-subtle);
	}

	h2.section-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>
