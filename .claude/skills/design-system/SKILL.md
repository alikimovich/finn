---
name: design-system
description: Use this skill BEFORE writing or editing any UI in finn — building a screen, page, route, form, dialog, list, button, or component. It gives you the component inventory pointer, composition recipes, and the anti-patterns to avoid. Triggers on phrases like "build a screen", "add a page", "make a form", "create a route", "design", "component", "send screen", "convert", "contacts", or any task involving `.svelte` files under `src/routes/` or `src/lib/components/`.
---

# finn — design system skill

Follow this **before** authoring code for any UI task.

## Step 1 — Read the inventory

The repo root `CLAUDE.md` lists every primitive, what it's for, and how
to import it (named imports from `$lib/components`). Open it once per
session and you'll know the menu.

## Step 2 — Match the task to a primitive

Decision tree for the most common cases:

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

## Step 3 — Read the JSDoc

Each component has a `<!-- @component -->` block at the top, plus
per-prop `/** … */` JSDoc on the `Props` interface. Both surface in IDE
hover and on the Storybook **Docs** tab. Open the file (or the matching
story) before composing with a primitive you haven't used before.

## Step 4 — Verify visually in Storybook

```
bun run storybook
```

Storybook (port 6006) is the canonical token + component workshop. Each
component lives in its own folder
(`src/lib/components/{Name}/{Name}.svelte`) with the collocated
`{Name}.stories.svelte`. For tokens, see **Docs → Tokens** (visual) and
`src/lib/tokens.md` (written reference).

## Step 5 — Run `bun run check`

Type-check before considering work done. ESLint will additionally flag
raw controls, inline styles, hex/px/rgba/ms literals in route CSS, and
bare `<input>`/`<textarea>` outside `<Field>` — don't disable rules; fix
the code. The `Stop` hook re-runs ESLint on the files you edited and
surfaces any violations as additional context.

---

## Anti-patterns — do not do these

These are the things that come out of an agent that hasn't read this
skill. **Catch yourself before writing them:**

1. **Raw `<button>` / `<input>` / `<select>` / `<svg>` in a route.**
   Use `<Button>` / `<Field>` (with bare `<input>` inside) /
   `<CurrencyPicker>` / `<Icon>`. The only place a bare `<input>` is
   acceptable is inside `<Field>`.
2. **Inventing a primitive.** "Let me write a custom `.row` class…" —
   stop. Use `<List>` + `<ListRow>`.
3. **Custom `<label>` wrapper around a control.** `<Field>` is the
   label.
4. **Custom modal/dialog implementation.** Use `<Dialog>`.
5. **Custom empty-state CSS.** Use `<EmptyState>`.
6. **`style={…}` or `style="…"` on a primitive.** Smell — the primitive
   is missing a variant. Add the variant; don't override.
7. **`display: flex` + `gap: var(--space-N)` in a route's `<style>`.**
   Use `<Stack>` or `<Cluster>`.
8. **Hardcoded `12px`, `#fff`, `rgba(...)`, `200ms`** in CSS. Use the
   token (`var(--space-3)`, `var(--color-text-muted)`, `var(--dur-3)`).

---

## Composition recipes

### A form row inside a dialog or card

```svelte
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
```

`<input>`/`<textarea>` placed inside `<Field>` are styled
automatically. Don't wrap them in your own `<label>`.

### A page with a list

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

### An action bar / inline meta line

```svelte
<Cluster justify="between">
  <h2>Recent</h2>
  <Button variant="ghost">Clear</Button>
</Cluster>

<Cluster space="2">
  <span>1 USD = 0.92 EUR</span>
  <DotSep />
  <span>updated 2 min ago</span>
</Cluster>
```

### A form inside a Dialog

```svelte
<Dialog open={isOpen} title="New contact" onClose={close}>
  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
    <Stack space="4">
      <Field label="Name"><input bind:value={name} type="text" required /></Field>
      <Field label="Email" optional><input bind:value={email} type="email" /></Field>
    </Stack>
  </form>

  {#snippet footer()}
    <Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
    <Button variant="primary" size="sm" onclick={save}>Save</Button>
  {/snippet}
</Dialog>
```
