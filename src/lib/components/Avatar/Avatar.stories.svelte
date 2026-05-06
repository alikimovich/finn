<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from '../Avatar';
	import Cluster from '../Cluster';

	const { Story } = defineMeta({
		title: 'Bits/Avatar',
		component: Avatar,
		tags: ['autodocs']
	});
</script>

<Story name="Default" args={{ name: 'Jane Doe', size: 40 }} />

<Story name="With name" args={{ name: 'Alex Kim', size: 40 }}>
	{#snippet template(args)}
		<Cluster space="3" align="center">
			<Avatar {...args} />
			<span>{args.name}</span>
		</Cluster>
	{/snippet}
</Story>

<Story name="All palette tones">
	<Cluster space="3" align="center">
		<Avatar name="Aida B" />
		<Avatar name="Beni C" />
		<Avatar name="Chen D" />
		<Avatar name="Diana E" />
		<Avatar name="Ethan F" />
		<Avatar name="Fiona G" />
		<Avatar name="Greg H" />
	</Cluster>
</Story>

<Story name="Small (24px)" args={{ name: 'Sam Lee', size: 24 }} />

<Story name="Large (64px)" args={{ name: 'Olivia M', size: 64 }} />
