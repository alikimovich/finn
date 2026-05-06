<script lang="ts">
	interface Props {
		name: string;
		size?: number;
	}

	let { name, size = 40 }: Props = $props();

	function initials(n: string): string {
		const parts = n.trim().split(/\s+/);
		if (parts.length === 0 || !parts[0]) return '?';
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}

	function hash(s: string): number {
		let h = 0;
		for (let i = 0; i < s.length; i++) {
			h = (h << 5) - h + s.charCodeAt(i);
			h |= 0;
		}
		return Math.abs(h);
	}

	// Muted earth tones tuned for the Mercury palette
	const palette = [
		{ bg: '#e8e3d4', fg: '#5e5439' },
		{ bg: '#dfe5d6', fg: '#465339' },
		{ bg: '#e3dfe6', fg: '#4f445a' },
		{ bg: '#e7dad3', fg: '#624b3e' },
		{ bg: '#d8e1e3', fg: '#3e5258' },
		{ bg: '#e6dde3', fg: '#5b3f50' },
		{ bg: '#dde4d8', fg: '#3f5740' }
	];

	const tone = $derived(palette[hash(name) % palette.length]);
	const text = $derived(initials(name));
</script>

<span
	class="avatar"
	style="--bg: {tone.bg}; --fg: {tone.fg}; --size: {size}px;"
	aria-hidden="true"
>
	{text}
</span>

<style>
	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--bg);
		color: var(--fg);
		font-size: calc(var(--size) * 0.36);
		font-weight: 600;
		letter-spacing: 0.02em;
		flex-shrink: 0;
	}
</style>
