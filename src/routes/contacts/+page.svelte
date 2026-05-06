<script lang="ts">
	import {
		Avatar,
		Button,
		Cluster,
		CurrencyPicker,
		Dialog,
		DotSep,
		EmptyState,
		Field,
		Icon,
		IconButton,
		List,
		ListRow,
		PageHeader,
		SearchField,
		Stack
	} from '$lib/components';
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
	<List space="2">
		{#each filtered as c (c.id)}
			{@const cur = getCurrency(c.preferredCurrency)}
			<ListRow padding="sm">
				<Cluster space="3" align="center">
					<Avatar name={c.name} />
					<div class="meta">
						<div class="name">{c.name}</div>
						<Cluster space="2" align="center">
							{#if c.email}
								<span>{c.email}</span>
								<DotSep />
							{/if}
							<span class="currency">
								<span aria-hidden="true">{cur?.flag}</span>
								{c.preferredCurrency}
							</span>
							<DotSep />
							<span class="added">Added {formatRelativeTime(c.createdAt)}</span>
						</Cluster>
					</div>
					<div class="actions">
						<IconButton aria-label="Edit {c.name}" onclick={() => openEdit(c)}>
							<Icon name="edit" size="sm" />
						</IconButton>
						<IconButton variant="danger" aria-label="Delete {c.name}" onclick={() => remove(c.id)}>
							<Icon name="trash" size="sm" />
						</IconButton>
					</div>
				</Cluster>
			</ListRow>
		{/each}
	</List>
{/if}

<Dialog
	open={mode.kind !== 'closed'}
	title={mode.kind === 'edit' ? 'Edit contact' : 'New contact'}
	onClose={close}
>
	<form onsubmit={(e) => { e.preventDefault(); save(); }}>
		<Stack space="4">
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
					aria-label="Preferred currency"
				/>
			</Field>

			<Field label="Notes" optional>
				<textarea
					bind:value={formNotes}
					placeholder="Anything to remember about this contact"
					rows="3"
				></textarea>
			</Field>
		</Stack>
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

	.meta {
		flex: 1;
		min-width: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.name {
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
		color: var(--color-text);
		margin-bottom: var(--space-half);
	}

	.currency {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.added {
		color: var(--color-text-subtle);
	}

	.actions {
		display: flex;
		gap: var(--space-half);
		opacity: 0.4;
		transition: opacity var(--dur-2) var(--ease-standard);
	}

	:global(li):hover .actions,
	:global(li):focus-within .actions {
		opacity: 1;
	}
</style>
