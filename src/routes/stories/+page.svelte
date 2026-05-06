<script lang="ts">
	import { Badge, Card, PageHeader, Stack } from '$lib/components';
</script>

<PageHeader
	title="Stories"
	subtitle="Short-form financial advice from people you follow."
/>

<Card>
	<Stack space="3" align="start">
		<Badge variant="soft">Coming soon</Badge>
		<p>
			A daily feed of bite-sized financial tips, market notes, and recipes for
			better money habits.
		</p>
	</Stack>
</Card>

<style>
	p {
		max-width: 60ch;
	}
</style>
