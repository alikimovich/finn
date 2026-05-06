<!--
	@component
	Modal with backdrop, title bar, body, and optional footer snippet.
	Dismisses on Escape and backdrop click. Use this for **every** modal —
	don't roll your own.

	Props:
	- `open` — boolean (required).
	- `title` — string (required).
	- `onClose` — `() => void` (required).
	- `children` — body content.
	- Snippet: `footer`.

	@example
	```svelte
	<Dialog open={isOpen} title="New contact" onClose={close}>
	  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
	    <Stack space="4">…</Stack>
	  </form>
	  {#snippet footer()}
	    <Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
	    <Button variant="primary" size="sm" onclick={save}>Save</Button>
	  {/snippet}
	</Dialog>
	```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import IconButton from '../IconButton';
	import Icon from '../Icon';

	interface Props {
		/** Whether the dialog is currently visible. */
		open: boolean;
		/** Title text rendered in the header bar. */
		title?: string;
		/** Called on backdrop click, close button, or Escape. */
		onClose: () => void;
		/** Body content of the dialog. */
		children: Snippet;
		/** Optional footer snippet — typically the action buttons. */
		footer?: Snippet;
	}

	let { open, title, onClose, children, footer }: Props = $props();

	let panelEl: HTMLDivElement | undefined = $state();
	let titleId = `dialog-title-${Math.random().toString(36).slice(2, 9)}`;
	let returnFocusEl: HTMLElement | null = null;

	const FOCUSABLE =
		'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

	$effect(() => {
		if (open && panelEl) {
			returnFocusEl = document.activeElement as HTMLElement | null;
			tick().then(() => {
				const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
				first?.focus();
			});
		} else if (!open && returnFocusEl) {
			returnFocusEl.focus();
			returnFocusEl = null;
		}
	});

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
			return;
		}
		if (e.key === 'Tab' && panelEl) {
			const focusables = Array.from(
				panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)
			).filter((el) => !el.hasAttribute('inert'));
			if (focusables.length === 0) {
				e.preventDefault();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement as HTMLElement | null;
			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
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
		onclick={onBackdropClick}
		role="presentation"
	>
		<div
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
			aria-label={title ? undefined : 'Dialog'}
			bind:this={panelEl}
		>
			{#if title}
				<header class="head">
					<h2 id={titleId}>{title}</h2>
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
