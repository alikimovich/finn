<script lang="ts">
	import type { Snippet } from 'svelte';

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
					<button
						class="close"
						type="button"
						onclick={onClose}
						aria-label="Close dialog"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						>
							<path d="m4 4 8 8M12 4l-8 8" />
						</svg>
					</button>
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
		background: rgba(20, 20, 15, 0.32);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-5);
		z-index: 50;
		animation: fade 140ms ease;
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
		max-width: 440px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: 0 24px 60px rgba(20, 20, 15, 0.16);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: rise 160ms cubic-bezier(0.4, 0.8, 0.2, 1);
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
		border-bottom: 1px solid var(--border);
	}

	.head h2 {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		transition: background-color 120ms ease, color 120ms ease;
	}

	.close:hover {
		background: var(--accent-soft);
		color: var(--text);
	}

	.body {
		padding: var(--space-5);
	}

	.foot {
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
		padding: var(--space-4) var(--space-5);
		border-top: 1px solid var(--border);
		background: var(--bg);
	}
</style>
