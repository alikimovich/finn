<script lang="ts">
	interface Props {
		points: number[];
		width?: number;
		height?: number;
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	}

	let {
		points,
		width = 96,
		height = 28,
		stroke = 'currentColor',
		fill = 'none',
		strokeWidth = 1.5
	}: Props = $props();

	const path = $derived.by(() => {
		if (points.length < 2) return '';
		const min = Math.min(...points);
		const max = Math.max(...points);
		const range = max - min || 1;
		const stepX = width / (points.length - 1);
		const padY = strokeWidth;
		const usableH = height - padY * 2;
		return points
			.map((p, i) => {
				const x = i * stepX;
				const y = padY + usableH - ((p - min) / range) * usableH;
				return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
			})
			.join(' ');
	});

	const areaPath = $derived.by(() => {
		if (!path || fill === 'none') return '';
		return `${path} L ${width} ${height} L 0 ${height} Z`;
	});
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	role="img"
	aria-hidden="true"
	class="sparkline"
>
	{#if areaPath}
		<path d={areaPath} {fill} stroke="none" />
	{/if}
	<path
		d={path}
		{stroke}
		stroke-width={strokeWidth}
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>
</svg>

<style>
	.sparkline {
		display: block;
	}
</style>
