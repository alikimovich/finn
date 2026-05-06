<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import CurrencyPicker from '$lib/components/CurrencyPicker.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Field from '$lib/components/Field.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchField from '$lib/components/SearchField.svelte';
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

<PageHeader title="Contacts" subtitle="People you send to and receive from.">
	{#snippet actions()}
		<Button variant="primary" size="md" onclick={openAdd}>
			<Icon name="plus" size="sm" strokeWidth={1.6} />
			Add contact
		</Button>
	{/snippet}
</PageHeader>

{#if $contacts.length > 0}
	<div class="search-wrap">
		<SearchField bind:value={query} placeholder="Search contacts" />
	</div>
{/if}

{#if $contacts.length === 0}
	<EmptyState
		title="No contacts yet"
		description="Add the people you most often send money to."
	>
		{#snippet icon()}
			<Icon name="user" size="lg" strokeWidth={1.4} />
		{/snippet}
		{#snippet action()}
			<Button variant="secondary" size="sm" onclick={openAdd}>
				Add your first contact
			</Button>
		{/snippet}
	</EmptyState>
{:else if filtered.length === 0}
	<EmptyState tone="subtle" description={`No contacts match "${query}".`} />
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
					<IconButton aria-label="Edit {c.name}" onclick={() => openEdit(c)}>
						<Icon name="edit" size="sm" />
					</IconButton>
					<IconButton variant="danger" aria-label="Delete {c.name}" onclick={() => remove(c.id)}>
						<Icon name="trash" size="sm" />
					</IconButton>
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
		<Field label="Name">
			<input
				bind:value={formName}
				type="text"
				placeholder="Jane Doe"
				autocomplete="off"
				required
			/>
		</Field>

		<Field label="Email" optional>
			<input
				bind:value={formEmail}
				type="email"
				placeholder="jane@example.com"
				autocomplete="off"
			/>
		</Field>

		<Field label="Preferred currency" as="div">
			<CurrencyPicker
				selected={formCurrency}
				onSelect={(code) => (formCurrency = code)}
			/>
		</Field>

		<Field label="Notes" optional>
			<textarea
				bind:value={formNotes}
				placeholder="Anything to remember about this contact"
				rows="3"
			></textarea>
		</Field>
	</form>

	{#snippet footer()}
		<Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
		<Button variant="primary" size="sm" onclick={save} disabled={!formName.trim()}>
			{mode.kind === 'edit' ? 'Save changes' : 'Add contact'}
		</Button>
	{/snippet}
</Dialog>

<style>
	.search-wrap {
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
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: border-color var(--dur-2) var(--ease-standard);
	}

	.row:hover {
		border-color: var(--color-border-strong);
	}

	.row:hover .actions {
		opacity: 1;
	}

	.meta {
		flex: 1;
		min-width: 0;
	}

	.name {
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
	}

	.sub {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: 2px;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.currency {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.dot-sep {
		color: var(--color-text-subtle);
	}

	.added {
		color: var(--color-text-subtle);
	}

	.actions {
		display: flex;
		gap: 2px;
		opacity: 0.4;
		transition: opacity var(--dur-2) var(--ease-standard);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
</style>
