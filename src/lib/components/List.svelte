<!--
	@component
	Resets a `<ul>` and stacks its `<li>` children with a tokenized gap.
	Use for **any vertical list of rows** — recent items, contacts, search
	results, etc. Pair with `<ListRow>` for the row surface.

	Props:
	- `space` — `'half' | '1' | '2' | '3' | '4'` (default `'2'`).
	- `children` — `<ListRow>` items.

	@example
	```svelte
	<List space="2">
	  {#each items as item (item.id)}
	    <ListRow padding="sm">…</ListRow>
	  {/each}
	</List>
	```
-->
<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        space?: "half" | "1" | "2" | "3" | "4";
        children: Snippet;
    }

    let { space = "2", children }: Props = $props();
</script>

<ul class="list" style:gap={`var(--space-${space})`}>
    {@render children()}
</ul>

<style>
    .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
    }
</style>
