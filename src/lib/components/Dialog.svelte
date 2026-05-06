<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './IconButton.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		open: boolean;
		title?: string;
		onClose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, onClose, children, footer }: Props = $props();

	function onKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div
		class="backdrop"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		onclick={onBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		tabindex="-1"
	>
		<div class="panel" role="document">
			{#if title}
				<header class="head">
					<h2>{title}</h2>
					<IconButton aria-label="Close dialog" onclick={onClose}>
						<Icon name="close" size="sm" />
					</IconButton>
				</header>
			{/if}
			<div class="body">
				{@render children()}
			</div>
			{#if footer}
				<footer class="foot">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: var(--color-overlay);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-5);
		z-index: var(--z-dialog);
		animation: fade var(--dur-3) var(--ease-standard);
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.panel {
		width: 100%;
		max-width: var(--dialog-max-width);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: rise var(--dur-4) var(--ease-emphatic);
	}

	@keyframes rise {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4) var(--space-5);
		border-bottom: 1px solid var(--color-border);
	}

	.head h2 {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-tight);
	}

	.body {
		padding: var(--space-5);
	}

	.foot {
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
		padding: var(--space-4) var(--space-5);
		border-top: 1px solid var(--color-border);
		background: var(--color-bg);
	}
</style>
