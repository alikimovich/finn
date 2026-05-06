---
name: design-system
description: Use this skill BEFORE writing or editing any UI in finn — building a screen, page, route, form, dialog, list, button, or component. It gives you the component inventory pointer, composition recipes, anti-patterns to avoid, and the rules for translating a Figma design into the right primitives. Triggers on phrases like "build a screen", "add a page", "make a form", "create a route", "design", "component", "send screen", "convert", "contacts", "figma", any figma.com URL, or any task involving `.svelte` files under `src/routes/` or `src/lib/components/`.
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

## When implementing from Figma

If the source is a Figma file (or any pixel-perfect spec), read it
**carefully** before picking primitives. Use the Figma MCP
(`get_design_context`) to fetch the design context — the response
includes the typography styles, which is your map to the right
primitive. Common failure modes from past builds:

1. **Match the label size to the right primitive.** Two uppercase-label
   styles look similar but mean different things:
   - **10.5px / `--text-2xs` / 0.06em tracking** → `<SectionLabel>` +
     standalone control below. Used for prominent section headings
     inside a card.
   - **12.5px / `--text-sm` / 0.04em tracking** → `<Field>` wrapping the
     control. Used for inline form-row labels.
   Defaulting to `<Field>` for every form row is the most common
   mistake. Figma's "Page title", "Section label", "Field label" styles
   each map to a specific primitive — read the type style name first.

2. **Respect placement — read the Figma layout before composing.**
   - Two elements drawn on the same row in Figma → one `<Cluster>`.
     If they sit at the row's edges (e.g. currency picker on the left,
     amount on the right), use `<Cluster justify="between">`.
   - Stacking them vertically as separate `<Stack>` rows is a different
     design.
   - Trailing actions (Send button on the right of a card) → wrap in a
     `<Cluster justify="end">` or use the parent's `align="end"`.

3. **Don't relabel or rephrase copy.** If Figma says "BALANCE", use
   "BALANCE" — even if it reads semantically wrong for the field.
   Surface the question to the user instead of silently substituting
   "TO" / "RECIPIENT" / your own guess. Same goes for subtitles,
   button labels, helper text.

4. **Render the visual state Figma shows.** A button drawn as a filled
   primary in Figma should be `<Button variant="primary">` even if your
   first instinct is "this should be disabled until a recipient is
   entered." Wire interactivity (`disabled`, validation) separately;
   don't downgrade the rendered variant to match a hypothesis about
   logic.

5. **Map every literal you read to a token.** Figma exposes raw values
   (24px, -0.24px, #14140f); your job is to translate them to tokens
   from `src/lib/tokens.md` before writing CSS:
   - 24px → `--text-3xl`; 36px → `--text-display`; 13.5px → `--text-base`.
   - `-0.02em` tracking → `--tracking-display`; `0.06em` →
     `--tracking-caps`; `0.04em` → `--tracking-caps-sm`.
   - Spacing values 4/8/12/16/24/32/48/64 → `--space-1..8`.
   ESLint will block hex/px/ms literals in route CSS — but inline
   styles on primitives (`<Stack space="3">`) should already be the
   token-shaped value, not a Figma px reading.

6. **Reuse a built reference.** `src/routes/contacts/+page.svelte` and
   `src/routes/convert/+page.svelte` are the established composition
   patterns for finn — open one before building a similar screen
   instead of re-deriving from the Figma alone.

7. **Recognize existing primitives — don't reimplement them.** Before
   writing any markup, scan the Figma frame for shapes you've already
   seen in the CLAUDE.md inventory: a sidebar with brand+nav+footer is
   `<Sidebar>`, a dashed empty box is `<EmptyState>`, an
   inline-bulleted meta line is `<Cluster>` + `<DotSep>`, an initials
   circle is `<Avatar>`, an uppercase status pill is `<Badge>`. Under
   "match Figma exactly" pressure, agents often build a parallel div
   tree instead of using the primitive that already produces the
   pixels — use the primitive.

8. **Map Figma named type styles directly to tokens.** The Figma MCP
   response lists named styles (e.g. `Page title / h1`, `Body / base`,
   `Caption / sm`, `Amount display`, `Badge`). Those names *are* the
   token mapping — don't recompute from the raw 13.5px / -0.24px
   values:
   - `Page title / h1` → `--text-3xl` + `--tracking-display`
   - `Body / base` → `--text-base`
   - `Caption / sm` → `--text-sm`
   - `Amount display` → `--text-display` + `--tracking-display`
   - `Badge` → `--text-2xs` + `--tracking-caps`

9. **Build the states Figma doesn't show.** A Figma frame typically
   only renders the happy path. The screen still needs: an empty state
   (`<EmptyState>`), loading feedback, validation errors, disabled
   wiring, focus rings (token-driven, already in `app.css`), and hover
   transitions. If the design doesn't specify these, default to the
   project's existing patterns — don't invent new ones and don't omit
   them.

10. **Don't ship Figma asset URLs.** The MCP returns asset constants
    like `imgFrame = "https://figma.com/api/mcp/asset/…"` — those URLs
    expire after 7 days. Treat them as ephemeral references for
    *understanding* the design, never production sources. Replace each
    with the project equivalent: an `<Icon>` glyph (extend the
    `IconName` union if missing), a `<CurrencyPicker>` flag emoji, or
    a file saved into `static/`.

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
