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
