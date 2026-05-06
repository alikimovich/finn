<!--
	@component
	Initials avatar with deterministic palette (1 of 7 paired tones derived from a hash of the name).

	Props:
	- `name` — string: the person's full name (required). Initials are derived
	  from this; the same name always renders with the same color pair.
	- `size` — number (default `40`): width/height in px.

	The element is `aria-hidden` — always pair it with the visible name so
	screen readers don't lose information.

	@example
	```svelte
	<Avatar name="Jane Doe" size={40} />
	<Cluster space="3"><Avatar name={user.name} /><span>{user.name}</span></Cluster>
	```
-->
<script lang="ts">
    interface Props {
        /**
         * Person's full name. Initials are derived from this and the same
         * name always renders with the same color pair.
         */
        name: string;
        /**
         * Width/height in px.
         * @default 40
         */
        size?: number;
    }

    let { name, size = 40 }: Props = $props();

    function initials(n: string): string {
        const parts = n.trim().split(/\s+/);
        if (parts.length === 0 || !parts[0]) return "?";
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

    const tone = $derived((hash(name) % 7) + 1);
    const text = $derived(initials(name));
</script>

<span class="avatar tone-{tone}" style:--size="{size}px" aria-hidden="true">
    {text}
</span>

<style>
    .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        height: var(--size);
        border-radius: var(--radius-circle);
        font-size: calc(var(--size) * 0.36);
        font-weight: var(--weight-semibold);
        letter-spacing: var(--tracking-wide);
        flex-shrink: 0;
    }

    .tone-1 {
        background: var(--avatar-1-bg);
        color: var(--avatar-1-fg);
    }
    .tone-2 {
        background: var(--avatar-2-bg);
        color: var(--avatar-2-fg);
    }
    .tone-3 {
        background: var(--avatar-3-bg);
        color: var(--avatar-3-fg);
    }
    .tone-4 {
        background: var(--avatar-4-bg);
        color: var(--avatar-4-fg);
    }
    .tone-5 {
        background: var(--avatar-5-bg);
        color: var(--avatar-5-fg);
    }
    .tone-6 {
        background: var(--avatar-6-bg);
        color: var(--avatar-6-fg);
    }
    .tone-7 {
        background: var(--avatar-7-bg);
        color: var(--avatar-7-fg);
    }
</style>
