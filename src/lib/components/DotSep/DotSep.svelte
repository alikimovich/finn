<!--
	@component
	The middle-dot separator (`·`) used between meta items inside a
	`<Cluster>`. Always rendered in `--color-text-subtle`. No props.

	@example
	```svelte
	<Cluster space="2">
	  <span>foo</span> <DotSep /> <span>bar</span> <DotSep /> <span>baz</span>
	</Cluster>
	```
-->
<span class="dot-sep" aria-hidden="true">·</span>

<style>
	.dot-sep {
		color: var(--color-text-subtle);
	}
</style>
