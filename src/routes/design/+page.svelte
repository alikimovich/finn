<script lang="ts">
	import {
		Avatar,
		Badge,
		Button,
		Card,
		Cluster,
		CurrencyPicker,
		Dialog,
		DotSep,
		EmptyState,
		Field,
		Icon,
		IconButton,
		Input,
		List,
		ListRow,
		PageHeader,
		SearchField,
		SectionLabel,
		Sparkline,
		Stack,
		type IconName
	} from '$lib/components';
	import type { CurrencyCode } from '$lib/types';

	const colorTokens = [
		{ group: 'Surface', items: [
			{ name: '--color-bg' },
			{ name: '--color-surface' },
			{ name: '--color-surface-sunken' }
		] },
		{ group: 'Text', items: [
			{ name: '--color-text' },
			{ name: '--color-text-muted' },
			{ name: '--color-text-subtle' },
			{ name: '--color-text-on-accent' }
		] },
		{ group: 'Border', items: [
			{ name: '--color-border' },
			{ name: '--color-border-strong' }
		] },
		{ group: 'Accent', items: [
			{ name: '--color-accent' },
			{ name: '--color-accent-hover' },
			{ name: '--color-accent-soft' }
		] },
		{ group: 'Semantic', items: [
			{ name: '--color-success' },
			{ name: '--color-danger' },
			{ name: '--color-danger-soft' }
		] },
		{ group: 'Overlay', items: [{ name: '--color-overlay' }] }
	];

	const radiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'];

	const spaceTokens = [
		'--space-half', '--space-1', '--space-2', '--space-3',
		'--space-4', '--space-5', '--space-6', '--space-7', '--space-8'
	];

	const textTokens = [
		'--text-2xs', '--text-xs', '--text-sm', '--text-base',
		'--text-md', '--text-lg', '--text-xl', '--text-2xl',
		'--text-3xl', '--text-display'
	];

	const weightTokens = [
		{ name: '--weight-regular', label: 'Regular' },
		{ name: '--weight-medium', label: 'Medium' },
		{ name: '--weight-semibold', label: 'Semibold' }
	];

	const trackingTokens = [
		'--tracking-display',
		'--tracking-tight',
		'--tracking-normal',
		'--tracking-wide',
		'--tracking-caps-sm',
		'--tracking-caps'
	];

	const shadowTokens = ['--shadow-sm', '--shadow-md', '--shadow-lg'];

	const motionTokens = [
		{ dur: '--dur-1', ease: '--ease-standard' },
		{ dur: '--dur-2', ease: '--ease-standard' },
		{ dur: '--dur-3', ease: '--ease-standard' },
		{ dur: '--dur-4', ease: '--ease-emphatic' },
		{ dur: '--dur-5', ease: '--ease-spring' }
	];

	const iconNames: IconName[] = [
		'arrow-right', 'check', 'chevron-down', 'close', 'convert',
		'edit', 'people', 'plus', 'rates', 'search', 'send',
		'stories', 'swap-vertical', 'trash', 'trend-up', 'user'
	];

	const sparklineUp = [12, 14, 13, 16, 18, 17, 20, 22, 21, 25];
	const sparklineDown = [25, 24, 23, 25, 22, 21, 19, 18, 16, 14];

	let pickerCode = $state<CurrencyCode>('USD');
	let dialogOpen = $state(false);
	let inputValue = $state('Sample text');
	let amount = $state('1,200.50');
	let searchValue = $state('');
	let formField = $state('');

	const sections = [
		{ id: 'colors', label: 'Colors' },
		{ id: 'typography', label: 'Typography' },
		{ id: 'space', label: 'Space' },
		{ id: 'radius', label: 'Radius' },
		{ id: 'shadow', label: 'Shadow' },
		{ id: 'motion', label: 'Motion' },
		{ id: 'icons', label: 'Icons' },
		{ id: 'avatars', label: 'Avatars' },
		{ id: 'badges', label: 'Badges' },
		{ id: 'buttons', label: 'Buttons' },
		{ id: 'icon-buttons', label: 'Icon buttons' },
		{ id: 'inputs', label: 'Inputs' },
		{ id: 'search', label: 'Search field' },
		{ id: 'fields', label: 'Form fields' },
		{ id: 'cards', label: 'Cards' },
		{ id: 'empty', label: 'Empty states' },
		{ id: 'page-headers', label: 'Page header' },
		{ id: 'currency-picker', label: 'Currency picker' },
		{ id: 'sparklines', label: 'Sparklines' },
		{ id: 'dialog', label: 'Dialog' },
		{ id: 'stack-cluster', label: 'Stack & Cluster' },
		{ id: 'lists', label: 'List & ListRow' },
		{ id: 'dot-sep', label: 'DotSep' }
	];
</script>

<PageHeader
	title="Design system"
	subtitle="Tokens and components that compose the finn UI."
/>

<nav class="rail" aria-label="Design system sections">
	{#each sections as s (s.id)}
		<a href={`#${s.id}`}>{s.label}</a>
	{/each}
</nav>

<!-- ===== Colors ===== -->
<section id="colors" class="section">
	<SectionLabel as="h2" text="Colors" />

	{#each colorTokens as group (group.group)}
		<div class="subhead">{group.group}</div>
		<div class="swatches">
			{#each group.items as item (item.name)}
				<div class="swatch">
					<div class="chip" style:background={`var(${item.name})`}></div>
					<code>{item.name}</code>
				</div>
			{/each}
		</div>
	{/each}

	<div class="subhead">Avatar palette</div>
	<div class="swatches">
		{#each [1, 2, 3, 4, 5, 6, 7] as i (i)}
			<div class="swatch">
				<div class="chip-pair">
					<div class="chip" style:background={`var(--avatar-${i}-bg)`}></div>
					<div class="chip" style:background={`var(--avatar-${i}-fg)`}></div>
				</div>
				<code>--avatar-{i}-bg / fg</code>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Typography ===== -->
<section id="typography" class="section">
	<SectionLabel as="h2" text="Typography" />

	<div class="subhead">Size scale</div>
	<div class="rows">
		{#each textTokens as t (t)}
			<div class="text-row">
				<code>{t}</code>
				<span style:font-size={`var(${t})`}>The quick brown fox</span>
			</div>
		{/each}
	</div>

	<div class="subhead">Weight</div>
	<div class="rows">
		{#each weightTokens as w (w.name)}
			<div class="text-row">
				<code>{w.name}</code>
				<span style:font-weight={`var(${w.name})`}>{w.label} — finance is fun</span>
			</div>
		{/each}
	</div>

	<div class="subhead">Tracking</div>
	<div class="rows">
		{#each trackingTokens as t (t)}
			<div class="text-row">
				<code>{t}</code>
				<span style:letter-spacing={`var(${t})`}>FINN AND FRIENDS</span>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Space ===== -->
<section id="space" class="section">
	<SectionLabel as="h2" text="Space" />
	<div class="rows">
		{#each spaceTokens as s (s)}
			<div class="space-row">
				<code>{s}</code>
				<div class="space-bar" style:width={`var(${s})`}></div>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Radius ===== -->
<section id="radius" class="section">
	<SectionLabel as="h2" text="Radius" />
	<div class="grid-tiles">
		{#each radiusTokens as r (r)}
			<div class="tile">
				<div class="radius-box" style:border-radius={`var(${r})`}></div>
				<code>{r}</code>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Shadow ===== -->
<section id="shadow" class="section">
	<SectionLabel as="h2" text="Shadow" />
	<div class="grid-tiles">
		{#each shadowTokens as sh (sh)}
			<div class="tile">
				<div class="shadow-box" style:box-shadow={`var(${sh})`}></div>
				<code>{sh}</code>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Motion ===== -->
<section id="motion" class="section">
	<SectionLabel as="h2" text="Motion" />
	<p class="hint">Hover the boxes to play each duration / easing pair.</p>
	<div class="grid-tiles">
		{#each motionTokens as m (m.dur)}
			<div class="tile">
				<div
					class="motion-box"
					style:transition={`transform var(${m.dur}) var(${m.ease})`}
				></div>
				<code>{m.dur} · {m.ease}</code>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Icons ===== -->
<section id="icons" class="section">
	<SectionLabel as="h2" text="Icons" />
	<div class="icon-grid">
		{#each iconNames as n (n)}
			<div class="icon-tile">
				<Icon name={n} />
				<code>{n}</code>
			</div>
		{/each}
	</div>
</section>

<!-- ===== Avatars ===== -->
<section id="avatars" class="section">
	<SectionLabel as="h2" text="Avatars" />
	<div class="cluster">
		<Avatar name="Anna" size={28} />
		<Avatar name="Bea Reyes" />
		<Avatar name="Carlos Diaz" size={56} />
		<Avatar name="Diana Park" size={72} />
		<Avatar name="Eli" />
		<Avatar name="Faye Liu" />
		<Avatar name="Gabe Wu" />
	</div>
</section>

<!-- ===== Badges ===== -->
<section id="badges" class="section">
	<SectionLabel as="h2" text="Badges" />
	<div class="cluster">
		<Badge variant="neutral">soon</Badge>
		<Badge variant="soft">Coming soon</Badge>
		<Badge variant="success">Saved ✓</Badge>
	</div>
</section>

<!-- ===== Buttons ===== -->
<section id="buttons" class="section">
	<SectionLabel as="h2" text="Buttons" />
	<div class="subhead">Variants × sizes</div>
	<div class="cluster">
		<Button variant="primary" size="md">Primary</Button>
		<Button variant="secondary" size="md">Secondary</Button>
		<Button variant="ghost" size="md">Ghost</Button>
	</div>
	<div class="cluster">
		<Button variant="primary" size="sm">Primary</Button>
		<Button variant="secondary" size="sm">Secondary</Button>
		<Button variant="ghost" size="sm">Ghost</Button>
	</div>

	<div class="subhead">With icon</div>
	<div class="cluster">
		<Button variant="primary">
			<Icon name="plus" size="sm" strokeWidth={1.6} />
			Add contact
		</Button>
		<Button variant="secondary">
			<Icon name="send" size="sm" />
			Send money
		</Button>
	</div>

	<div class="subhead">Disabled</div>
	<div class="cluster">
		<Button variant="primary" disabled>Primary</Button>
		<Button variant="secondary" disabled>Secondary</Button>
		<Button variant="ghost" disabled>Ghost</Button>
	</div>
</section>

<!-- ===== Icon buttons ===== -->
<section id="icon-buttons" class="section">
	<SectionLabel as="h2" text="Icon buttons" />
	<div class="cluster">
		<IconButton aria-label="Edit"><Icon name="edit" size="sm" /></IconButton>
		<IconButton variant="danger" aria-label="Delete"><Icon name="trash" size="sm" /></IconButton>
		<IconButton size="md" aria-label="Close"><Icon name="close" size="sm" /></IconButton>
	</div>
</section>

<!-- ===== Inputs ===== -->
<section id="inputs" class="section">
	<SectionLabel as="h2" text="Inputs" />

	<div class="subhead">Sizes</div>
	<div class="stack">
		<div class="card-shell">
			<Input bind:value={inputValue} placeholder="Default" />
		</div>
		<div class="card-shell">
			<Input bind:value={amount} size="xl" align="right" />
		</div>
	</div>
</section>

<!-- ===== Search ===== -->
<section id="search" class="section">
	<SectionLabel as="h2" text="Search field" />

	<div class="subhead">Card variant</div>
	<SearchField bind:value={searchValue} placeholder="Search contacts" />

	<div class="subhead">Plain variant</div>
	<div class="card-shell">
		<SearchField bind:value={searchValue} placeholder="Search currency" variant="plain" />
	</div>
</section>

<!-- ===== Fields ===== -->
<section id="fields" class="section">
	<SectionLabel as="h2" text="Form fields" />
	<div class="form-shell">
		<Field label="Name">
			<input bind:value={formField} type="text" placeholder="Jane Doe" />
		</Field>
		<Field label="Email" optional>
			<input type="email" placeholder="jane@example.com" />
		</Field>
		<Field label="Notes" optional>
			<textarea placeholder="Anything to remember" rows="3"></textarea>
		</Field>
	</div>
</section>

<!-- ===== Cards ===== -->
<section id="cards" class="section">
	<SectionLabel as="h2" text="Cards" />
	<div class="grid-tiles">
		<div>
			<Card padding="sm">
				<p>Padding sm — for compact lists.</p>
			</Card>
			<code class="caption">padding="sm"</code>
		</div>
		<div>
			<Card padding="md">
				<p>Padding md — default container.</p>
			</Card>
			<code class="caption">padding="md"</code>
		</div>
		<div>
			<Card padding="lg">
				<p>Padding lg — hero container.</p>
			</Card>
			<code class="caption">padding="lg"</code>
		</div>
	</div>
</section>

<!-- ===== Empty states ===== -->
<section id="empty" class="section">
	<SectionLabel as="h2" text="Empty states" />

	<div class="subhead">Default with action</div>
	<EmptyState
		title="No contacts yet"
		description="Add the people you most often send money to."
	>
		{#snippet icon()}<Icon name="user" size="lg" strokeWidth={1.4} />{/snippet}
		{#snippet action()}<Button variant="secondary" size="sm">Add your first contact</Button>{/snippet}
	</EmptyState>

	<div class="subhead">Subtle</div>
	<EmptyState tone="subtle" description={`No contacts match "lukas".`} />
</section>

<!-- ===== Page header ===== -->
<section id="page-headers" class="section">
	<SectionLabel as="h2" text="Page header" />
	<div class="card-shell">
		<PageHeader title="Convert" subtitle="Live FX rates from the European Central Bank." />
	</div>
	<div class="card-shell">
		<PageHeader title="Contacts" subtitle="People you send to and receive from.">
			{#snippet actions()}
				<Button variant="primary" size="md">
					<Icon name="plus" size="sm" />
					Add contact
				</Button>
			{/snippet}
		</PageHeader>
	</div>
</section>

<!-- ===== Currency picker ===== -->
<section id="currency-picker" class="section">
	<SectionLabel as="h2" text="Currency picker" />
	<CurrencyPicker selected={pickerCode} onSelect={(c) => (pickerCode = c)} />
</section>

<!-- ===== Sparklines ===== -->
<section id="sparklines" class="section">
	<SectionLabel as="h2" text="Sparklines" />
	<div class="cluster">
		<div class="tile">
			<Sparkline points={sparklineUp} tone="up" />
			<code>tone="up"</code>
		</div>
		<div class="tile">
			<Sparkline points={sparklineDown} tone="down" />
			<code>tone="down"</code>
		</div>
		<div class="tile">
			<Sparkline points={sparklineUp} tone="neutral" />
			<code>tone="neutral"</code>
		</div>
	</div>
</section>

<!-- ===== Dialog ===== -->
<section id="dialog" class="section">
	<SectionLabel as="h2" text="Dialog" />
	<Button variant="primary" onclick={() => (dialogOpen = true)}>Open dialog</Button>
	<Dialog open={dialogOpen} title="Example dialog" onClose={() => (dialogOpen = false)}>
		<p>
			Dialogs render above an overlay, autofocus the close control, and dismiss
			on Escape or backdrop click.
		</p>
		{#snippet footer()}
			<Button variant="ghost" size="sm" onclick={() => (dialogOpen = false)}>Cancel</Button>
			<Button variant="primary" size="sm" onclick={() => (dialogOpen = false)}>Got it</Button>
		{/snippet}
	</Dialog>
</section>

<!-- ===== Stack & Cluster ===== -->
<section id="stack-cluster" class="section">
	<SectionLabel as="h2" text="Stack & Cluster" />
	<p class="hint">Layout primitives. Stack stacks vertically, Cluster wraps horizontally.</p>

	<div class="subhead">Stack — space="3"</div>
	<div class="card-shell">
		<Stack space="3">
			<div class="block">First</div>
			<div class="block">Second</div>
			<div class="block">Third</div>
		</Stack>
	</div>

	<div class="subhead">Cluster — default (space="2", align="center")</div>
	<div class="card-shell">
		<Cluster>
			<Badge variant="neutral">tag</Badge>
			<Badge variant="soft">tag</Badge>
			<Badge variant="success">tag</Badge>
			<Badge variant="neutral">tag</Badge>
		</Cluster>
	</div>

	<div class="subhead">Cluster — justify="between"</div>
	<div class="card-shell">
		<Cluster justify="between">
			<span>Left</span>
			<span>Right</span>
		</Cluster>
	</div>
</section>

<!-- ===== List & ListRow ===== -->
<section id="lists" class="section">
	<SectionLabel as="h2" text="List & ListRow" />

	<div class="subhead">as="div" — static row</div>
	<List space="2">
		<ListRow padding="sm">
			<Cluster justify="between"><span>Static row</span><span>meta</span></Cluster>
		</ListRow>
		<ListRow padding="sm">
			<Cluster justify="between"><span>Another row</span><span>meta</span></Cluster>
		</ListRow>
	</List>

	<div class="subhead">as="button" — clickable</div>
	<List space="half">
		<ListRow as="button" padding="sm" onclick={() => {}}>
			<Cluster justify="between"><span>Click me</span><span>→</span></Cluster>
		</ListRow>
		<ListRow as="button" padding="sm" onclick={() => {}}>
			<Cluster justify="between"><span>Or me</span><span>→</span></Cluster>
		</ListRow>
	</List>

	<div class="subhead">as="a" with padding="md"</div>
	<List space="2">
		<ListRow as="a" href="#lists" padding="md">
			<Cluster justify="between"><span>Anchor row</span><span>→</span></Cluster>
		</ListRow>
	</List>
</section>

<!-- ===== DotSep ===== -->
<section id="dot-sep" class="section">
	<SectionLabel as="h2" text="DotSep" />
	<p class="hint">Subtle middle-dot separator. Pair with Cluster for inline meta lines.</p>
	<div class="card-shell">
		<Cluster space="2">
			<span>1 USD = 0.92 EUR</span>
			<DotSep />
			<span>1 EUR = 1.09 USD</span>
			<DotSep />
			<span>ECB · 2026-05-05</span>
		</Cluster>
	</div>
</section>

<style>
	.rail {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-2);
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		margin-bottom: var(--space-6);
	}

	.rail a {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		transition:
			background-color var(--dur-2) var(--ease-standard),
			color var(--dur-2) var(--ease-standard);
	}

	.rail a:hover {
		background: var(--color-accent-soft);
		color: var(--color-text);
	}

	.section {
		padding-top: var(--space-7);
		border-top: 1px solid var(--color-border);
	}

	.section:first-of-type {
		padding-top: 0;
		border-top: none;
	}

	.section :global(h2.section-label) {
		margin-bottom: var(--space-4);
	}

	.subhead {
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--tracking-caps-sm);
		color: var(--color-text-muted);
		margin: var(--space-5) 0 var(--space-3);
	}

	.subhead:first-of-type {
		margin-top: 0;
	}

	code {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-3);
	}

	.swatch {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.chip {
		height: 56px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.chip-pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2px;
		height: 56px;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.chip-pair .chip {
		height: 100%;
		border: none;
		border-radius: 0;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.text-row {
		display: grid;
		grid-template-columns: 180px 1fr;
		align-items: baseline;
		gap: var(--space-4);
	}

	.space-row {
		display: grid;
		grid-template-columns: 120px 1fr;
		align-items: center;
		gap: var(--space-4);
	}

	.space-bar {
		height: 12px;
		background: var(--color-accent);
		border-radius: var(--radius-sm);
	}

	.grid-tiles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-4);
	}

	.tile {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.radius-box {
		width: 80px;
		height: 80px;
		background: var(--color-accent-soft);
		border: 1px solid var(--color-border);
	}

	.shadow-box {
		width: 100%;
		height: 80px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.motion-box {
		width: 80px;
		height: 80px;
		background: var(--color-accent);
		border-radius: var(--radius-md);
		transform: translateX(0);
	}

	.tile:hover .motion-box {
		transform: translateX(40px);
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: var(--space-3);
	}

	.icon-tile {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
	}

	.cluster {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.cluster:last-child {
		margin-bottom: 0;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.card-shell {
		padding: var(--space-3) var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.form-shell {
		padding: var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 440px;
	}

	.caption {
		display: block;
		margin-top: var(--space-2);
	}

	.hint {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.block {
		padding: var(--space-3) var(--space-4);
		background: var(--color-accent-soft);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>
