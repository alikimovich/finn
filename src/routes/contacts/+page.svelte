<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import CurrencyPicker from '$lib/components/CurrencyPicker.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { contacts } from '$lib/stores/contacts';
	import { getCurrency } from '$lib/data/currencies';
	import { formatRelativeTime } from '$lib/utils/format';
	import type { Contact, CurrencyCode } from '$lib/types';

	type Mode = { kind: 'closed' } | { kind: 'add' } | { kind: 'edit'; contact: Contact };

	let mode = $state<Mode>({ kind: 'closed' });
	let query = $state('');

	let formName = $state('');
	let formEmail = $state('');
	let formCurrency = $state<CurrencyCode>('USD');
	let formNotes = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return $contacts;
		return $contacts.filter(
			(c) =>
				c.name.toLowerCase().includes(q) ||
				c.email?.toLowerCase().includes(q) ||
				c.preferredCurrency.toLowerCase().includes(q)
		);
	});

	function openAdd() {
		formName = '';
		formEmail = '';
		formCurrency = 'USD';
		formNotes = '';
		mode = { kind: 'add' };
	}

	function openEdit(c: Contact) {
		formName = c.name;
		formEmail = c.email ?? '';
		formCurrency = c.preferredCurrency;
		formNotes = c.notes ?? '';
		mode = { kind: 'edit', contact: c };
	}

	function close() {
		mode = { kind: 'closed' };
	}

	function save() {
		const trimmed = formName.trim();
		if (!trimmed) return;
		const payload = {
			name: trimmed,
			email: formEmail.trim() || undefined,
			preferredCurrency: formCurrency,
			notes: formNotes.trim() || undefined
		};
		if (mode.kind === 'add') {
			contacts.add(payload);
		} else if (mode.kind === 'edit') {
			contacts.update(mode.contact.id, payload);
		}
		close();
	}

	function remove(id: string) {
		contacts.remove(id);
	}
</script>

<header class="header">
	<div>
		<h1>Contacts</h1>
		<p class="subtitle">People you send to and receive from.</p>
	</div>
	<Button variant="primary" size="md" onclick={openAdd}>
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="M8 3v10M3 8h10" />
		</svg>
		Add contact
	</Button>
</header>

{#if $contacts.length > 0}
	<div class="search">
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="7" cy="7" r="5" />
			<path d="m11 11 3 3" />
		</svg>
		<input
			bind:value={query}
			type="text"
			placeholder="Search contacts"
			autocomplete="off"
		/>
	</div>
{/if}

{#if $contacts.length === 0}
	<div class="empty">
		<div class="empty-icon" aria-hidden="true">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="9" r="4" />
				<path d="M3 21c0-4.5 4-7 9-7s9 2.5 9 7" />
			</svg>
		</div>
		<p class="empty-title">No contacts yet</p>
		<p class="empty-sub">Add the people you most often send money to.</p>
		<Button variant="secondary" size="sm" onclick={openAdd}>Add your first contact</Button>
	</div>
{:else if filtered.length === 0}
	<div class="empty subtle">
		<p>No contacts match "{query}".</p>
	</div>
{:else}
	<ul class="list">
		{#each filtered as c (c.id)}
			{@const cur = getCurrency(c.preferredCurrency)}
			<li class="row">
				<Avatar name={c.name} />
				<div class="meta">
					<div class="name">{c.name}</div>
					<div class="sub">
						{#if c.email}
							<span>{c.email}</span>
							<span class="dot-sep">·</span>
						{/if}
						<span class="currency">
							<span aria-hidden="true">{cur?.flag}</span>
							{c.preferredCurrency}
						</span>
						<span class="dot-sep">·</span>
						<span class="added">Added {formatRelativeTime(c.createdAt)}</span>
					</div>
				</div>
				<div class="actions">
					<button
						class="icon-btn"
						type="button"
						onclick={() => openEdit(c)}
						aria-label="Edit {c.name}"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M11 2.5 13.5 5 5.5 13H3v-2.5L11 2.5Z" />
						</svg>
					</button>
					<button
						class="icon-btn danger"
						type="button"
						onclick={() => remove(c.id)}
						aria-label="Delete {c.name}"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 4h10M5 4V2.5h6V4M6 7v5M10 7v5M4.5 4l.5 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-9" />
						</svg>
					</button>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<Dialog
	open={mode.kind !== 'closed'}
	title={mode.kind === 'edit' ? 'Edit contact' : 'New contact'}
	onClose={close}
>
	<form class="form" onsubmit={(e) => { e.preventDefault(); save(); }}>
		<label class="field">
			<span class="label">Name</span>
			<input
				bind:value={formName}
				type="text"
				placeholder="Jane Doe"
				autocomplete="off"
				required
			/>
		</label>

		<label class="field">
			<span class="label">Email <span class="optional">(optional)</span></span>
			<input
				bind:value={formEmail}
				type="email"
				placeholder="jane@example.com"
				autocomplete="off"
			/>
		</label>

		<div class="field">
			<span class="label">Preferred currency</span>
			<CurrencyPicker
				selected={formCurrency}
				onSelect={(code) => (formCurrency = code)}
			/>
		</div>

		<label class="field">
			<span class="label">Notes <span class="optional">(optional)</span></span>
			<textarea
				bind:value={formNotes}
				placeholder="Anything to remember about this contact"
				rows="3"
			></textarea>
		</label>
	</form>

	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
		<Button variant="primary" size="sm" onclick={save} disabled={!formName.trim()}>
			{mode.kind === 'edit' ? 'Save changes' : 'Add contact'}
		</Button>
	{/snippet}
</Dialog>

<style>
	.header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-5);
	}

	h1 {
		font-size: 24px;
		letter-spacing: -0.02em;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 13.5px;
		margin-top: var(--space-1);
	}

	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 0 var(--space-4);
		height: 40px;
		color: var(--text-subtle);
		margin-bottom: var(--space-3);
	}

	.search:focus-within {
		border-color: var(--border-strong);
	}

	.search input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 13.5px;
		color: var(--text);
	}

	.search input::placeholder {
		color: var(--text-subtle);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		text-align: center;
		padding: var(--space-7) var(--space-5);
		border: 1px dashed var(--border);
		border-radius: var(--radius-md);
	}

	.empty.subtle {
		padding: var(--space-5);
		color: var(--text-subtle);
	}

	.empty-icon {
		color: var(--text-subtle);
		margin-bottom: var(--space-2);
	}

	.empty-title {
		font-size: 14px;
		font-weight: 600;
	}

	.empty-sub {
		color: var(--text-muted);
		font-size: 13px;
		margin-bottom: var(--space-3);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition: border-color 120ms ease;
	}

	.row:hover {
		border-color: var(--border-strong);
	}

	.row:hover .actions {
		opacity: 1;
	}

	.meta {
		flex: 1;
		min-width: 0;
	}

	.name {
		font-weight: 600;
		font-size: 14px;
	}

	.sub {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: 2px;
		font-size: 12.5px;
		color: var(--text-muted);
	}

	.currency {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.dot-sep {
		color: var(--text-subtle);
	}

	.added {
		color: var(--text-subtle);
	}

	.actions {
		display: flex;
		gap: 2px;
		opacity: 0.4;
		transition: opacity 120ms ease;
	}

	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		transition: background-color 120ms ease, color 120ms ease;
	}

	.icon-btn:hover {
		background: var(--accent-soft);
		color: var(--text);
	}

	.icon-btn.danger:hover {
		background: rgba(184, 66, 59, 0.1);
		color: var(--danger);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.label {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.optional {
		text-transform: none;
		letter-spacing: normal;
		font-weight: 400;
		color: var(--text-subtle);
	}

	.form input[type='text'],
	.form input[type='email'],
	.form textarea {
		width: 100%;
		font-family: inherit;
		font-size: 13.5px;
		color: var(--text);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		outline: none;
		transition: border-color 120ms ease;
	}

	.form input:focus,
	.form textarea:focus {
		border-color: var(--accent);
	}

	.form textarea {
		resize: vertical;
		line-height: 1.5;
		min-height: 72px;
	}
</style>
