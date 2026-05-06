# finn — agent guide

If anything in this file is wrong or incomplete, fix it here first, then
update the code.

---

## Project shape

- **Stack:** SvelteKit + Svelte 5 (runes mode forced) + TypeScript, Vite, Bun. Plain CSS with design tokens. No Tailwind, no CSS-in-JS.
- **Routes:** `/convert` (live FX), `/rates`, `/contacts`, `/send`,
  `/stories`, `/design` (legacy in-app gallery — superseded by Storybook).
- **Layout:** every route renders inside `+layout.svelte` with sidebar on
  the left and content centered at `--layout-content-max` (880px).
- **Design system workshop:** `bun run storybook` (port 6006). Stories
  are collocated next to each component. Autodocs come from the
  `<!-- @component -->` block at the top of each `.svelte` file plus
  per-prop JSDoc on its `Props` interface — the same JSDoc surfaces on
  hover in your editor.

```
src/
├── app.css                tokens + reset (single source of truth)
├── lib/
│   ├── components/        all reusable UI; one folder per component
│   │   ├── index.ts       barrel — import from here in routes
│   │   └── Button/
│   │       ├── Button.svelte         the component
│   │       ├── Button.stories.svelte Storybook stories (collocated)
│   │       └── index.ts              re-exports default + any types
│   ├── data/              static currency list
│   ├── docs/              Storybook docs pages (Tokens, Introduction)
│   ├── server/            Frankfurter client
│   ├── stores/            localStorage-backed stores
│   ├── tokens.md          written token reference
│   ├── types.ts
│   └── utils/             format, convert
└── routes/                pages
```

---

## The two rules

1. **No magic values.** Never write a `px`, hex, `rgba()`, duration, or
   radius literal in component or route CSS. Every value comes from a
   token in `src/app.css`. If the right token doesn't exist, add one
   first, document it in `src/lib/tokens.md`, then use it.
2. **Prefer composition over ad-hoc CSS.** If you'd otherwise write
   `display: flex; flex-direction: column; gap: var(--space-N)`, use
   `<Stack>`. If you'd write `display: flex; gap: ...`, use `<Cluster>`.
   Drop to raw CSS only when the layout needs something a primitive
   can't express (custom grid templates, per-child positioning).

> Composition recipes and the full anti-pattern list live in
> `.claude/skills/design-system/SKILL.md`. Read that skill before
> authoring or editing UI.

---

## Component inventory — what exists, when to use it

Import as named exports from `$lib/components`:

```ts
import { Button, Card, Stack, Field, type IconName } from '$lib/components';
```

The barrel (`src/lib/components/index.ts`) re-exports every primitive
and the few exported types (`IconName`, `StackSpace`, `ClusterSpace`).
Each component still lives in its own folder
(`src/lib/components/{Name}/`) with `{Name}.svelte`,
`{Name}.stories.svelte`, and `index.ts`. Don't import via the per-folder
path from routes; use the barrel.

### Layout primitives — reach for these first

| Component  | Use when                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| `Stack`    | Vertical column of items with a tokenized gap. Default for forms, lists. |
| `Cluster`  | Horizontal row of items with a tokenized gap, wrap by default.           |
| `DotSep`   | Middle-dot (`·`) separator for inline meta lines inside a `Cluster`.     |

### Form controls

| Component        | Use when                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| `Field`          | **Every form row** with a single bordered control. Wraps an uppercase label around `<input>`/`<textarea>`. Renders `<label>`. **Don't put `<Input size="xl">` inside Field** — Field's CSS clobbers the variant. Use `AmountField` instead. |
| `AmountField`    | **Currency picker + amount input on one row** (the convert "You send"/"They get" rows, the send AMOUNT row). Bundles SectionLabel + non-wrapping flex row + `<Input size="xl">`. Use this — don't compose by hand. |
| `Input`          | Text/number input. `size="xl"` for the 36px display amount pattern (only outside Field — see `AmountField`). |
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

---

## Tokens — what's available

Tokens live as CSS custom properties on `:root` in `src/app.css`. The
**human-readable reference** is `src/lib/tokens.md`. The **visual
reference** is the **Docs → Tokens** Storybook page (rendered from
`src/lib/docs/Tokens.stories.svelte`). Keep all three in sync.

Categories: color (surface, text, border, accent, semantic, avatar
palette), radius, space (4-pt scale + 2px micro), sizing (layout,
control heights, icons), typography (size, weight, tracking, leading),
shadow, motion (duration, easing), z-index.

Pair `font-variant-numeric: tabular-nums` on the leaf element rendering
amounts and rates so columns align.

---

## Workflow

1. **Read this file** for the inventory and import path.
2. **Invoke the `design-system` skill** (or read its SKILL.md) for
   recipes, anti-patterns, and the per-task decision tree.
3. **Open Storybook** (`bun run storybook`) if unsure what something
   looks like — every component has a collocated story.
4. **Read the component's JSDoc** before using it (same docs show on
   hover in your editor and on the Storybook **Docs** tab).
5. **Run `bun run check`** before considering work done. ESLint flags
   raw controls, inline styles, CSS literals, and bare inputs outside
   `<Field>`. The `Stop` hook re-runs ESLint on files you edited.

---

## Adding a new component

1. Create `src/lib/components/{Name}/` and inside it:
   - `{Name}.svelte` — the component (use only tokens).
   - `{Name}.stories.svelte` — sketch the API in Storybook first.
   - `index.ts` — `export { default } from './{Name}.svelte';` (plus
     `export type { … } from './{Name}.svelte';` if the `<script module>`
     exports types).
2. Add the new component to the barrel `src/lib/components/index.ts`.
3. Add a `<!-- @component description + example -->` block at the top
   of `{Name}.svelte`.
4. Add `/** … */` JSDoc to **every field** of the `Props` interface.
5. Update this file's component inventory.

## Adding a new token

1. Add to `:root` in `src/app.css` in the appropriate group.
2. Add a row to `src/lib/tokens.md` with the value and intended use.
3. Render it in `src/lib/docs/Tokens.stories.svelte` if it's
   visually-significant (color, space, radius, shadow, typography size).
4. Replace any matching literal across components and routes.
