---
name: design-system
description: Use this skill BEFORE writing or editing any UI in finn — building a screen, page, route, form, dialog, list, button, or component. It gives you the component inventory, the right primitive for common patterns, and the anti-patterns to avoid. Triggers on phrases like "build a screen", "add a page", "make a form", "create a route", "design", "component", "send screen", "convert", "contacts", or any task involving `.svelte` files under `src/routes/` or `src/lib/components/`.
---

# finn — design system skill

When the user asks you to build or edit any piece of UI in finn, follow
this skill **before** authoring code.

## Step 1 — Read the inventory (CLAUDE.md)

The repo root has `CLAUDE.md` with the full component inventory and
composition recipes. **Read it first.** It will save you from
re-deriving patterns by reading every file.

## Step 2 — Match the task to a primitive

Mental decision tree for the most common cases:

- "Vertical column of fields / sections / items"  →  `<Stack>`
- "Horizontal row of things with a gap"  →  `<Cluster>`
- "Inline meta line with bullets between items"  →  `<Cluster>` + `<DotSep>`
- "Form row with a label"  →  `<Field>` (don't wrap `<input>` in your own `<label>`)
- "User picks a currency"  →  `<CurrencyPicker>` (never `<select>`)
- "A button"  →  `<Button>` (never raw `<button>`)
- "An icon"  →  `<Icon>` (never raw `<svg>` in a route)
- "An icon-only action button"  →  `<IconButton>` (with `aria-label`)
- "A vertical list of clickable rows"  →  `<List>` + `<ListRow>`
- "A modal / popup"  →  `<Dialog>`
- "Empty state / no results"  →  `<EmptyState>`
- "A page heading"  →  `<PageHeader>` (every route opens with this)
- "A small status label"  →  `<Badge>`
- "A person's avatar"  →  `<Avatar>` (paired with their visible name)

## Step 3 — Read the JSDoc on the primitive you picked

Each component has a `<!-- @component -->` block at the top with its
props, defaults, and a usage example. Open the file before composing
with it.

## Step 4 — Avoid these anti-patterns

The most common ways an agent goes off the rails:

1. **Inventing a primitive.** "Let me write a custom `.row` class…" —
   stop. Use `<List>` + `<ListRow>`.
2. **Using raw `<button>` / `<input>` / `<select>` in a route.** Always
   `<Button>` / `<Field>` (with bare `<input>`) / `<CurrencyPicker>`.
3. **Inline `style={{...}}` on a primitive.** This is a smell — the
   primitive is missing a variant. Either use a different variant or add
   one to the primitive.
4. **Hardcoding `12px`, `#fff`, `rgba(...)`** in component CSS. Always
   use a token from `src/app.css` (e.g. `var(--space-3)`,
   `var(--color-text-muted)`).
5. **`display: flex; gap: var(--space-N)` in a route's `<style>`.** Use
   `<Stack>` or `<Cluster>` instead.
6. **`<svg>` directly in a route.** Add the glyph to `Icon.svelte`'s
   `IconName` union and use `<Icon>`.
7. **Wrapping a control in a custom `<label>`.** `<Field>` is the label.

## Step 5 — Verify visually

`/design` is a live token + component preview gallery. If you're unsure
how a primitive looks or composes, run `bun run dev` and visit
`http://localhost:5173/design` — it renders every variant of every
component.

## Step 6 — Run `bun run check`

Type-check before considering work done. ESLint will additionally flag
raw controls and inline styles — don't disable rules; fix the code.

---

## Quick reference — example: a form inside a Dialog

```svelte
<Dialog open={isOpen} title="New contact" onClose={close}>
  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
    <Stack space="4">
      <Field label="Name">
        <input bind:value={name} type="text" required />
      </Field>
      <Field label="Email" optional>
        <input bind:value={email} type="email" />
      </Field>
      <Field label="Currency" as="div">
        <CurrencyPicker selected={code} onSelect={(c) => (code = c)} />
      </Field>
    </Stack>
  </form>

  {#snippet footer()}
    <Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
    <Button variant="primary" size="sm" onclick={save}>Save</Button>
  {/snippet}
</Dialog>
```

## Quick reference — example: a list page

```svelte
<PageHeader title="Contacts" subtitle="People you send to.">
  {#snippet actions()}
    <Button variant="primary"><Icon name="plus" size="sm" />Add</Button>
  {/snippet}
</PageHeader>

{#if items.length === 0}
  <EmptyState title="No contacts yet" description="Add your first.">
    {#snippet icon()}<Icon name="user" size="lg" />{/snippet}
  </EmptyState>
{:else}
  <List space="2">
    {#each items as item (item.id)}
      <ListRow padding="sm">
        <Cluster space="3" align="center">
          <Avatar name={item.name} />
          <span>{item.name}</span>
        </Cluster>
      </ListRow>
    {/each}
  </List>
{/if}
```
