<script lang="ts">
	import AmountField from '$lib/components/AmountField.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Cluster from '$lib/components/Cluster.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Field from '$lib/components/Field.svelte';
	import ListRow from '$lib/components/ListRow.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import type { CurrencyCode } from '$lib/types';

	const recipientName = 'Jane Doe';

	let currency = $state<CurrencyCode>('USD');
	let amount = $state('100.00');
	let note = $state('');

	function send() {
		// Placeholder send action — wires the real button up interactively.
	}
</script>

<PageHeader title="Send" subtitle="Move money to a contact, or to any email address." />

<Card padding="lg">
	<form onsubmit={(e) => e.preventDefault()}>
		<Stack space="6">
			<Field label="To" as="div">
				<Stack space="4">
					<div class="recipient-chip">
						<ListRow as="button" padding="sm" onclick={() => {}}>
							<Cluster space="3" align="center">
								<Avatar name={recipientName} size={40} />
								<span class="recipient">{recipientName}</span>
							</Cluster>
						</ListRow>
					</div>

					<EmptyState
						tone="subtle"
						description="No contacts yet — type an email to send a one-off transfer."
					/>
				</Stack>
			</Field>

			<AmountField
				label="Amount"
				bind:value={amount}
				{currency}
				onCurrencySelect={(c) => (currency = c)}
			/>

			<Field label="Note" optional>
				<input type="text" bind:value={note} placeholder="What's this for?" />
			</Field>

			<div class="actions">
				<Button variant="primary" type="submit" onclick={send}>Send</Button>
			</div>
		</Stack>
	</form>
</Card>

<style>
	/* The selected-recipient chip hugs its avatar + name rather than
	   filling the row, matching the design. */
	.recipient-chip {
		display: inline-flex;
	}

	.recipient-chip :global(.list-row) {
		display: inline-flex;
	}

	.recipient-chip :global(.surface) {
		width: auto;
		padding-right: var(--space-5);
	}

	.recipient {
		font-size: var(--text-md);
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
	}
</style>
