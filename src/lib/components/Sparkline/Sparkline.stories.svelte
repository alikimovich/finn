<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sparkline from '../Sparkline';

	const { Story } = defineMeta({
		title: 'Bits/Sparkline',
		component: Sparkline,
		tags: ['autodocs'],
		argTypes: {
			tone: { control: 'select', options: ['neutral', 'up', 'down'] }
		}
	});

	const trendingUp = [12, 14, 13, 16, 18, 17, 20, 22];
	const trendingDown = [22, 20, 19, 17, 16, 14, 13, 11];
	const flat = [15, 16, 14, 16, 15, 16, 15, 16];
</script>

<Story name="Up" args={{ points: trendingUp, tone: 'up' }} />

<Story name="Down" args={{ points: trendingDown, tone: 'down' }} />

<Story name="Neutral" args={{ points: flat, tone: 'neutral' }} />

<Story
	name="Wider"
	args={{ points: trendingUp, tone: 'up', width: 200, height: 40 }}
/>
