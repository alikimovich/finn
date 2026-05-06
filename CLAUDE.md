# finn — agent guide

This file is read by AI coding assistants (Claude Code, Cursor, etc.). It
exists so a fresh agent can build a route or component **using the
established design system on the first try**, without re-deriving the
patterns by reading every file.

If anything in this file is wrong or incomplete, fix it here first, then
update the code.

---

## Project shape

- **Stack:** SvelteKit + Svelte 5 (runes mode forced) + TypeScript, Vite,
  Bun. Plain CSS with design tokens. No Tailwind, no CSS-in-JS.
- **Routes:** `/convert` (live FX), `/rates`, `/contacts`, `/send`,
  `/stories`, `/design` (dev token + component gallery).
- **Layout:** every route renders inside `+layout.svelte` with sidebar on
  the left and content centered at `--layout-content-max` (880px).

```
src/
├── app.css                tokens + reset (single source of truth)
├── lib/
│   ├── components/        all reusable UI lives here
│   ├── data/              static currency list
│   ├── server/            Frankfurter client
│   ├── stores/            localStorage-backed stores
│   ├── types.ts
│   └── utils/             format, convert
└── routes/                pages
```

---

## The two rules

1. **No magic values.** Never write a `px`, hex, `rgba()`, duration, or
   radius literal in component or route CSS. Every value comes from a
   token in `src/app.css`. If the right token doesn't exist, add one
   first, document it here, then use it.
2. **Prefer composition over ad-hoc CSS.** If you'd otherwise write
   `display: flex; flex-direction: column; gap: var(--space-N)`, use
   `<Stack>`. If you'd write `display: flex; gap: ...`, use `<Cluster>`.
   Drop to raw CSS only when the layout needs something a primitive can't
   express (custom grid templates, per-child positioning).

---

## Component inventory — what exists, when to use it

Import from `$lib/components/{Name}.svelte`.

### Layout primitives — reach for these first

| Component  | Use when                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| `Stack`    | Vertical column of items with a tokenized gap. Default for forms, lists. |
| `Cluster`  | Horizontal row of items with a tokenized gap, wrap by default.           |
| `DotSep`   | Middle-dot (`·`) separator for inline meta lines inside a `Cluster`.     |

### Form controls

| Component        | Use when                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| `Field`          | **Every form row.** Wraps an uppercase label around any input. Renders `<label>`. |
| `Input`          | Text/number input. `size="xl"` for the display amount input pattern.              |
| `SearchField`    | Magnifier-iconed text input. Use for any "search this list" pattern.              |
| `CurrencyPicker` | Currency selection — pill trigger + searchable popover. Use anywhere a user picks a currency. |
| `Button`         | All buttons. Variants: `primary` / `secondary` / `ghost`. Sizes: `sm` / `md`.     |
| `IconButton`     | Square icon-only button. Requires `aria-label`. For row actions, dialog close, etc. |

### Containers

| Component    | Use when                                                                |
| ------------ | ----------------------------------------------------------------------- |
| `Card`       | Any "elevated surface" group of content. `padding`: `sm` / `md` / `lg`. |
| `Dialog`     | Modal. Built-in backdrop, Escape, footer snippet. Use for add/edit forms. |
| `EmptyState` | Zero-data display. Use for empty lists, no-search-results, placeholders. |

### Lists

| Component | Use when                                                      |
| --------- | ------------------------------------------------------------- |
| `List`    | A `<ul>` with tokenized vertical gap. Use for any vertical list. |
| `ListRow` | A row inside `List`. Renders as `div`/`a`/`button` via `as`. Built-in hover, padding. |

### Page chrome

| Component      | Use when                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `PageHeader`   | **Every route page opens with this.** Title + optional subtitle + actions. |
| `SectionLabel` | Tiny uppercase label introducing a group/section.                          |
| `Sidebar`/`NavItem` | Used once in `+layout.svelte`. Don't re-use elsewhere.                |

### Bits

| Component   | Use when                                                          |
| ----------- | ----------------------------------------------------------------- |
| `Icon`      | **Every icon.** Never put `<svg>` in a route. Add new glyphs to `Icon.svelte`. |
| `Avatar`    | Initials avatar with deterministic palette. Pair with visible name. |
| `Badge`     | Small uppercase status label.                                      |
| `Sparkline` | Tiny line chart with semantic tone (`up`/`down`/`neutral`).        |

### Read the JSDoc

Every component has a `<!-- @component -->` block at the top with props,
defaults, and a usage example. When in doubt, open the component file.

### Live preview

`/design` is a dev gallery showing every token + component variant. Run
`bun run dev` and visit it to confirm what something looks like before
authoring it.

---

## Composition recipes — common page patterns

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

`<input>`/`<textarea>` placed inside `<Field>` are styled automatically.
**Don't** wrap them in your own `<label>`.

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
        <Cluster space="3" align="center">…</Cluster>
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

### A primary action

```svelte
<Button variant="primary" size="md" onclick={submit}>Send</Button>
```

Never `<button>` directly. Never inline-style a button. Use the `variant`
prop.

---

## Anti-patterns — do not do these

These are the things that come out of an agent that hasn't read this
file. **Catch yourself before writing them:**

1. **Raw `<button>`/`<input>`/`<label>` in a route or page-level
   component.** Always use `<Button>`, `<Input>`, and `<Field>`. The only
   place raw `<input>` is acceptable is *inside* a `<Field>` (which is
   how `<Field>` is designed to be used).
2. **`<svg>` in a route.** Always go through `<Icon>`. If a glyph is
   missing, add it to `Icon.svelte`.
3. **`style={{...}}` or `style="..."` on a primitive.** `<Button
   style={{...}}>`, `<Card style={{...}}>` etc. is a code smell — it
   means the primitive is missing a variant. Add the variant; don't
   override.
4. **`display: flex` + `gap: var(--space-N)` in a route's `<style>`.**
   Use `<Stack>` or `<Cluster>` instead.
5. **Hardcoded `12px`, `#fff`, `rgba(...)`** in any CSS. Use the token.
6. **Custom `.row` / `.list-item` classes for vertical lists.** Use
   `<List>` + `<ListRow>`.
7. **Custom modal/dialog implementation.** Use `<Dialog>`.
8. **Custom empty-state CSS.** Use `<EmptyState>`.
9. **Wrapping a control in `<label>` yourself.** `<Field>` is the label.

---

## Tokens — what's available

All tokens are CSS custom properties on `:root` in `src/app.css`. Open
that file for the full list — the categories are:

- **Color** — surface (3-tier neutral) + text (3-tier) + border + accent
  + semantic (success/danger) + 7-pair avatar palette + overlay.
- **Radius** — `--radius-sm/md/lg/pill/circle`.
- **Space** — `--space-half/1/2/3/4/5/6/7/8` (4-pt scale + 2px micro).
- **Sizing** — layout, control heights, control padding, icon sizes.
- **Typography** — font family, size scale (`--text-2xs` through
  `--text-display`), weight, tracking, leading.
- **Shadow** — `--shadow-sm/md/lg`.
- **Motion** — `--dur-1..5`, `--ease-standard/emphatic/spring`.
- **Z-index** — `--z-popover` (20), `--z-dialog` (50).

Pair `font-variant-numeric: tabular-nums` on the leaf element rendering
amounts and rates so columns align.

---

## Workflow

1. **Read this file** if you're starting a UI task.
2. **Open `/design`** if unsure what something looks like.
3. **Read the component's JSDoc** before using it.
4. **Run `bun run check`** before considering work done.
5. **ESLint will flag** raw controls, inline styles, and hex/px literals.
   Don't disable rules — fix the code.

---

## Adding a new component

1. Sketch in `/design` first.
2. Create `src/lib/components/Name.svelte`. Use only tokens.
3. Add a `<!-- @component description, props, example -->` block.
4. Add a section to `/design`'s preview page.
5. Update this file's component inventory.

## Adding a new token

1. Add to `:root` in `src/app.css` in the appropriate group.
2. Replace any matching literal in components and routes.
3. Render it in the corresponding `/design` token section.
