<!--
	Visual gallery of every design token. Pair with src/lib/tokens.md for
	the full written reference. Edit one, edit the other.
-->
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Stack from '$lib/components/Stack';
	import Cluster from '$lib/components/Cluster';
	import SectionLabel from '$lib/components/SectionLabel';

	const { Story } = defineMeta({
		title: 'Docs/Tokens',
		tags: ['autodocs']
	});

	const surfaceColors = [
		{ name: '--color-bg', value: '#faf9f6' },
		{ name: '--color-surface', value: '#ffffff' },
		{ name: '--color-surface-sunken', value: '#f1efe8' }
	];

	const textColors = [
		{ name: '--color-text', value: '#14140f' },
		{ name: '--color-text-muted', value: '#65655d' },
		{ name: '--color-text-subtle', value: '#74746c' },
		{ name: '--color-text-on-accent', value: '#faf9f6' }
	];

	const borderColors = [
		{ name: '--color-border', value: '#ebe9e2' },
		{ name: '--color-border-strong', value: '#d9d6cc' }
	];

	const accentColors = [
		{ name: '--color-accent', value: '#14140f' },
		{ name: '--color-accent-hover', value: '#2a2a23' },
		{ name: '--color-accent-soft', value: '#f1efe8' }
	];

	const semanticColors = [
		{ name: '--color-success', value: '#2f7a4f' },
		{ name: '--color-danger', value: '#b8423b' }
	];

	const radii = [
		{ name: '--radius-sm', value: '6px' },
		{ name: '--radius-md', value: '10px' },
		{ name: '--radius-lg', value: '14px' },
		{ name: '--radius-pill', value: '999px' }
	];

	const spaces = [
		['--space-half', '2px'],
		['--space-1', '4px'],
		['--space-2', '8px'],
		['--space-3', '12px'],
		['--space-4', '16px'],
		['--space-5', '24px'],
		['--space-6', '32px'],
		['--space-7', '48px'],
		['--space-8', '64px']
	] as const;

	const fontSizes = [
		['--text-2xs', '10.5px'],
		['--text-xs', '11.5px'],
		['--text-sm', '12.5px'],
		['--text-base', '13.5px'],
		['--text-md', '14px'],
		['--text-lg', '15px'],
		['--text-xl', '16px'],
		['--text-2xl', '18px'],
		['--text-3xl', '24px'],
		['--text-display', '36px']
	] as const;

	const shadows = [
		'--shadow-sm',
		'--shadow-md',
		'--shadow-lg'
	] as const;

	const durations = [
		['--dur-1', '80ms'],
		['--dur-2', '120ms'],
		['--dur-3', '140ms'],
		['--dur-4', '160ms'],
		['--dur-5', '360ms']
	] as const;

	const avatarTones = [1, 2, 3, 4, 5, 6, 7] as const;
</script>

<Story name="Color">
	<Stack space="6">
		<div>
			<SectionLabel as="h2" text="Surface" />
			<div class="swatch-grid">
				{#each surfaceColors as token (token.name)}
					<div class="swatch">
						<div
							class="swatch-chip"
							style:background={`var(${token.name})`}
						></div>
						<code>{token.name}</code>
						<span class="value">{token.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<SectionLabel as="h2" text="Text" />
			<div class="swatch-grid">
				{#each textColors as token (token.name)}
					<div class="swatch">
						<div
							class="swatch-chip"
							style:background={`var(${token.name})`}
						></div>
						<code>{token.name}</code>
						<span class="value">{token.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<SectionLabel as="h2" text="Border" />
			<div class="swatch-grid">
				{#each borderColors as token (token.name)}
					<div class="swatch">
						<div
							class="swatch-chip"
							style:background={`var(${token.name})`}
						></div>
						<code>{token.name}</code>
						<span class="value">{token.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<SectionLabel as="h2" text="Accent" />
			<div class="swatch-grid">
				{#each accentColors as token (token.name)}
					<div class="swatch">
						<div
							class="swatch-chip"
							style:background={`var(${token.name})`}
						></div>
						<code>{token.name}</code>
						<span class="value">{token.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<SectionLabel as="h2" text="Semantic" />
			<div class="swatch-grid">
				{#each semanticColors as token (token.name)}
					<div class="swatch">
						<div
							class="swatch-chip"
							style:background={`var(${token.name})`}
						></div>
						<code>{token.name}</code>
						<span class="value">{token.value}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<SectionLabel as="h2" text="Avatar palette" />
			<Cluster space="3">
				{#each avatarTones as tone (tone)}
					<div
						class="avatar-swatch"
						style:background={`var(--avatar-${tone}-bg)`}
						style:color={`var(--avatar-${tone}-fg)`}
					>
						{tone}
					</div>
				{/each}
			</Cluster>
		</div>
	</Stack>
</Story>

<Story name="Spacing">
	<Stack space="3">
		{#each spaces as [name, value] (name)}
			<div class="row">
				<code class="row-name">{name}</code>
				<div class="bar" style:width={`var(${name})`}></div>
				<span class="value">{value}</span>
			</div>
		{/each}
	</Stack>
</Story>

<Story name="Radius">
	<Cluster space="4">
		{#each radii as token (token.name)}
			<div class="radius-swatch">
				<div
					class="radius-box"
					style:border-radius={`var(${token.name})`}
				></div>
				<code>{token.name}</code>
				<span class="value">{token.value}</span>
			</div>
		{/each}
	</Cluster>
</Story>

<Story name="Typography">
	<Stack space="3">
		{#each fontSizes as [name, value] (name)}
			<div class="type-row">
				<span class="type-sample" style:font-size={`var(${name})`}>
					The quick brown fox
				</span>
				<code>{name}</code>
				<span class="value">{value}</span>
			</div>
		{/each}
	</Stack>
</Story>

<Story name="Shadow">
	<Cluster space="5">
		{#each shadows as name (name)}
			<div class="shadow-card" style:box-shadow={`var(${name})`}>
				<code>{name}</code>
			</div>
		{/each}
	</Cluster>
</Story>

<Story name="Motion (duration)">
	<Stack space="3">
		{#each durations as [name, value] (name)}
			<div class="row">
				<code class="row-name">{name}</code>
				<div class="motion-bar" style:animation-duration={`var(${name})`}></div>
				<span class="value">{value}</span>
			</div>
		{/each}
	</Stack>
</Story>

<style>
	.swatch-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.swatch {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.swatch-chip {
		width: 100%;
		height: 64px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.value {
		color: var(--color-text-subtle);
		font-size: var(--text-xs);
		font-family: var(--font-mono);
	}

	code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text);
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.row-name {
		min-width: 120px;
	}

	.bar {
		height: 16px;
		background: var(--color-accent);
		border-radius: var(--radius-sm);
	}

	.radius-swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.radius-box {
		width: 64px;
		height: 64px;
		background: var(--color-accent-soft);
		border: 1px solid var(--color-border-strong);
	}

	.type-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
	}

	.type-sample {
		flex: 1;
		color: var(--color-text);
		font-family: var(--font-sans);
	}

	.shadow-card {
		width: 120px;
		height: 80px;
		background: var(--color-surface);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.motion-bar {
		height: 16px;
		width: 80px;
		background: var(--color-accent);
		border-radius: var(--radius-sm);
		animation-name: pulse;
		animation-iteration-count: infinite;
		animation-timing-function: var(--ease-standard);
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scaleX(1);
		}
		50% {
			transform: scaleX(1.6);
		}
	}

	.avatar-swatch {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-circle);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--weight-semibold);
	}
</style>
