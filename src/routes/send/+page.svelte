<script lang="ts">
	import {
		AmountField,
		Avatar,
		Button,
		Card,
		Cluster,
		EmptyState,
		Field,
		List,
		ListRow,
		PageHeader,
		Stack
	} from '$lib/components';
	import { contacts } from '$lib/stores/contacts';
	import { getCurrency } from '$lib/data/currencies';
	import { formatAmount } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { Contact, CurrencyCode } from '$lib/types';

	type Phase = 'entry' | 'submitting' | 'success' | 'error';

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let phase = $state<Phase>('entry');
	let errorMsg = $state('');

	let recipient = $state('');
	let amount = $state('');
	let currency = $state<CurrencyCode>('USD');
	let note = $state('');

	let selectedContact = $state<Contact | null>(null);
	let lastSent = $state<{
		recipient: string;
		amount: number;
		currency: CurrencyCode;
	} | null>(null);

	const recipientResolution = $derived.by(() => {
		const value = recipient.trim();
		if (!value) return { kind: 'empty' } as const;
		if (selectedContact) {
			const match =
				selectedContact.name.toLowerCase() === value.toLowerCase() ||
				selectedContact.email?.toLowerCase() === value.toLowerCase();
			if (match) return { kind: 'contact', contact: selectedContact } as const;
		}
		const contactMatch = $contacts.find(
			(c) =>
				c.name.toLowerCase() === value.toLowerCase() ||
				c.email?.toLowerCase() === value.toLowerCase()
		);
		if (contactMatch) return { kind: 'contact', contact: contactMatch } as const;
		if (EMAIL_RE.test(value)) return { kind: 'email', email: value } as const;
		return { kind: 'invalid' } as const;
	});

	const recipientSuggestions = $derived.by(() => {
		const q = recipient.trim().toLowerCase();
		if (!q) return $contacts;
		if (recipientResolution.kind === 'contact') return [];
		return $contacts.filter(
			(c) =>
				c.name.toLowerCase().includes(q) ||
				c.email?.toLowerCase().includes(q)
		);
	});

	const amountNumber = $derived(Number(amount.replace(/,/g, '')) || 0);
	const recipientValid = $derived(
		recipientResolution.kind === 'contact' || recipientResolution.kind === 'email'
	);
	const amountValid = $derived(amountNumber > 0);
	const canSubmit = $derived(recipientValid && amountValid && phase !== 'submitting');

	const recipientHint = $derived.by(() => {
		if (recipientResolution.kind !== 'invalid') return '';
		return 'Enter a contact name or a valid email address.';
	});

	function onAmountInput(e: Event) {
		const el = e.target as HTMLInputElement;
		const cleaned = el.value.replace(/[^\d.]/g, '');
		const parts = cleaned.split('.');
		const next = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
		if (next !== el.value) {
			el.value = next;
			amount = next;
		} else {
			amount = next;
		}
	}

	function pickContact(c: Contact) {
		selectedContact = c;
		recipient = c.name;
		if (c.preferredCurrency) currency = c.preferredCurrency;
	}

	function onRecipientInput() {
		selectedContact = null;
	}

	async function submit() {
		if (!canSubmit) return;
		const willFail = page.url.searchParams.get('fail') === '1';
		phase = 'submitting';
		errorMsg = '';
		await new Promise((r) => setTimeout(r, 1000));
		if (willFail) {
			phase = 'error';
			errorMsg = "We couldn't reach the network. Check your connection and try again.";
			return;
		}
		const recipientLabel =
			recipientResolution.kind === 'contact'
				? recipientResolution.contact.name
				: recipientResolution.kind === 'email'
					? recipientResolution.email
					: recipient.trim();
		lastSent = {
			recipient: recipientLabel,
			amount: amountNumber,
			currency
		};
		phase = 'success';
	}

	function reset() {
		recipient = '';
		amount = '';
		note = '';
		currency = 'USD';
		selectedContact = null;
		errorMsg = '';
		phase = 'entry';
	}

	function retry() {
		errorMsg = '';
		phase = 'entry';
	}
</script>

<PageHeader
	title="Send"
	subtitle="Move money to a contact, or to any email address."
/>

{#if phase === 'success' && lastSent}
	<Card padding="lg">
		<Stack space="5" align="center">
			<div class="success-mark" aria-hidden="true">✓</div>
			<Stack space="2" align="center">
				<p class="success-headline">
					Sent {formatAmount(lastSent.amount, lastSent.currency)}
					{lastSent.currency} to {lastSent.recipient}
				</p>
				<p class="success-sub">It’s on its way.</p>
			</Stack>
			<Cluster space="3" justify="center">
				<Button variant="secondary" onclick={reset}>Send another</Button>
				<Button variant="primary" onclick={() => goto('/convert')}>
					Back to convert
				</Button>
			</Cluster>
		</Stack>
	</Card>
{:else}
	<Card padding="lg">
		<Stack space="6">
			<div class="section">
				<Stack space="3">
					<Field label="TO">
						<input
							bind:value={recipient}
							type="text"
							placeholder="jane@example.com"
							autocomplete="off"
							oninput={onRecipientInput}
						/>
					</Field>

					{#if recipientHint}
						<p class="field-hint">{recipientHint}</p>
					{/if}

					{#if $contacts.length === 0}
						<EmptyState
							tone="subtle"
							description="No contacts yet — type an email to send a one-off transfer."
						/>
					{:else if recipientSuggestions.length > 0}
						<List space="half">
							{#each recipientSuggestions as c (c.id)}
								{@const cur = getCurrency(c.preferredCurrency)}
								<ListRow as="button" padding="sm" onclick={() => pickContact(c)}>
									<Cluster space="3" align="center">
										<Avatar name={c.name} />
										<div class="contact-meta">
											<div class="contact-name">{c.name}</div>
											<Cluster space="2" align="center">
												{#if c.email}
													<span class="contact-sub">{c.email}</span>
												{/if}
												<span class="contact-sub">
													<span aria-hidden="true">{cur?.flag}</span>
													{c.preferredCurrency}
												</span>
											</Cluster>
										</div>
									</Cluster>
								</ListRow>
							{/each}
						</List>
					{/if}
				</Stack>
			</div>

			<AmountField
				label="Amount"
				bind:value={amount}
				{currency}
				onCurrencySelect={(code) => (currency = code)}
				oninput={onAmountInput}
			/>

			<Field label="Note" optional>
				<input
					bind:value={note}
					type="text"
					placeholder="What’s this for?"
					autocomplete="off"
				/>
			</Field>

			{#if phase === 'error'}
				<div class="error" role="alert">
					<p class="error-title">Send failed</p>
					<p class="error-msg">{errorMsg}</p>
					<Cluster space="2">
						<Button variant="secondary" size="sm" onclick={retry}>
							Try again
						</Button>
					</Cluster>
				</div>
			{/if}

			<Cluster justify="end">
				<Button
					variant="primary"
					onclick={submit}
					disabled={!canSubmit}
				>
					{phase === 'submitting' ? 'Sending…' : 'Send'}
				</Button>
			</Cluster>
		</Stack>
	</Card>
{/if}

<style>
	.field-hint {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.contact-meta {
		flex: 1;
		min-width: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.contact-name {
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
		color: var(--color-text);
	}

	.contact-sub {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}

	.error {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-sunken);
	}

	.error-title {
		font-weight: var(--weight-semibold);
		color: var(--color-text);
	}

	.error-msg {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.success-mark {
		width: var(--space-7);
		height: var(--space-7);
		border-radius: var(--radius-circle);
		background: var(--color-accent-soft);
		color: var(--color-text);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-2xl);
		font-weight: var(--weight-semibold);
	}

	.success-headline {
		font-size: var(--text-xl);
		font-weight: var(--weight-semibold);
		color: var(--color-text);
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.success-sub {
		color: var(--color-text-muted);
		font-size: var(--text-base);
		text-align: center;
	}
</style>
