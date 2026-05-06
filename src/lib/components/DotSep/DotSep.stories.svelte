<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DotSep from '../DotSep';
	import Cluster from '../Cluster';

	const { Story } = defineMeta({
		title: 'Layout/DotSep',
		component: DotSep,
		tags: ['autodocs']
	});
</script>

<Story name="Inline meta line">
	<Cluster space="2">
		<span>1 USD = 0.92 EUR</span>
		<DotSep />
		<span>updated 2 min ago</span>
		<DotSep />
		<span>ECB</span>
	</Cluster>
</Story>
