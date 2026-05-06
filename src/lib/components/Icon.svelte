<script lang="ts" module>
	export type IconName =
		| 'arrow-right'
		| 'check'
		| 'chevron-down'
		| 'close'
		| 'convert'
		| 'edit'
		| 'people'
		| 'plus'
		| 'rates'
		| 'search'
		| 'send'
		| 'stories'
		| 'swap-vertical'
		| 'trash'
		| 'trend-up'
		| 'user';
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		strokeWidth?: number;
	}

	let { name, size = 'md', strokeWidth = 1.5 }: Props = $props();

	const sizeMap = {
		xs: 'var(--icon-xs)',
		sm: 'var(--icon-sm)',
		md: 'var(--icon-md)',
		lg: 'var(--icon-lg)'
	} as const;
</script>

<svg
	class="icon"
	style:width={sizeMap[size]}
	style:height={sizeMap[size]}
	viewBox="0 0 16 16"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'arrow-right'}
		<path d="M3 8h10M9 4l4 4-4 4" />
	{:else if name === 'check'}
		<path d="m3 8 3 3 7-7" />
	{:else if name === 'chevron-down'}
		<path d="m4 6 4 4 4-4" />
	{:else if name === 'close'}
		<path d="m4 4 8 8M12 4l-8 8" />
	{:else if name === 'convert'}
		<path d="M3 5h9M9 2l3 3-3 3M13 11H4M7 14l-3-3 3-3" />
	{:else if name === 'edit'}
		<path d="M11 2.5 13.5 5 5.5 13H3v-2.5L11 2.5Z" />
	{:else if name === 'people'}
		<circle cx="8" cy="6" r="3" />
		<path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
	{:else if name === 'plus'}
		<path d="M8 3v10M3 8h10" />
	{:else if name === 'rates'}
		<path d="M2 12 6 8l3 3 5-7" />
		<path d="M10 4h4v4" />
	{:else if name === 'search'}
		<circle cx="7" cy="7" r="5" />
		<path d="m11 11 3 3" />
	{:else if name === 'send'}
		<path d="M14 2 7 9M14 2l-5 12-2-5-5-2 12-5Z" />
	{:else if name === 'stories'}
		<rect x="2" y="3" width="12" height="10" rx="2" />
		<path d="M2 7h12" />
	{:else if name === 'swap-vertical'}
		<path d="M5 3v9M2 6l3-3 3 3M11 13V4M14 10l-3 3-3-3" />
	{:else if name === 'trash'}
		<path d="M3 4h10M5 4V2.5h6V4M6 7v5M10 7v5M4.5 4l.5 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-9" />
	{:else if name === 'trend-up'}
		<path d="M2 12 6 8l3 3 5-7" />
		<path d="M10 4h4v4" />
	{:else if name === 'user'}
		<circle cx="8" cy="6" r="3" />
		<path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
	{/if}
</svg>

<style>
	.icon {
		display: inline-block;
		flex-shrink: 0;
	}
</style>
