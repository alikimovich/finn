# finn — design system

The single source of truth for the visual language of the app. If a value
is not in this document, it should not appear in the codebase.

- **Tokens** live in `src/app.css` as CSS custom properties on `:root`.
- **Components** live in `src/lib/components/` as Svelte 5 components.
- **Preview** is at the `/design` route — visit it to see every token and
  component variant rendered live.

The two rules:

1. **No magic values.** Every `px`, hex, duration, or radius must come from
   a token. If the right token does not exist, add one to `app.css` first.
2. **Prefer composition.** A repeated pattern across two pages should
   become a component before it appears in a third.

---

## Tokens

All tokens are CSS custom properties on `:root`. Reference them with
`var(--token-name)` from any component or route.

### Color

Surfaces, text, and borders form a 3-tier neutral scale. Accent is the
near-black brand color used for primary actions and the brand mark.
Semantic colors are reserved for state.

| Token                       | Use                                              |
| --------------------------- | ------------------------------------------------ |
| `--color-bg`                | App background, sidebar, dialog footer           |
| `--color-surface`           | Cards, popovers, dialogs, raised rows            |
| `--color-surface-sunken`    | Subtle inset surfaces (alias of accent-soft)     |
| `--color-text`              | Primary copy, headings                           |
| `--color-text-muted`        | Secondary copy, subtitles, button labels (ghost) |
| `--color-text-subtle`       | Tertiary copy, captions, dot separators          |
| `--color-text-on-accent`    | Text on the accent fill                          |
| `--color-border`            | Default 1px hairlines                            |
| `--color-border-strong`     | Hover/focus emphasis on hairlines                |
| `--color-accent`            | Brand mark, primary button, focus accent         |
| `--color-accent-hover`      | Primary button hover                             |
| `--color-accent-soft`       | Active nav, hover wash on neutral controls       |
| `--color-success`           | Up trends, success badges                        |
| `--color-danger`            | Destructive actions, down trends                 |
| `--color-danger-soft`       | Destructive hover wash                           |
| `--color-overlay`           | Modal backdrop                                   |
| `--avatar-{1..7}-bg/-fg`    | Paired backgrounds + foregrounds for `<Avatar>`  |

### Radius

| Token            | Px     | Use                                             |
| ---------------- | ------ | ----------------------------------------------- |
| `--radius-sm`    | 6 px   | Nav items, badges, small icon buttons           |
| `--radius-md`    | 10 px  | Inputs, default buttons, cards, popovers        |
| `--radius-lg`    | 14 px  | Hero cards, dialogs                             |
| `--radius-pill`  | 999 px | Currency picker trigger                         |
| `--radius-circle`| 50%    | Avatars, brand dot, swap control                |

### Space (4-pt scale + half-step)

| Token          | Px   | Typical use                          |
| -------------- | ---- | ------------------------------------ |
| `--space-half` | 2    | Micro gaps inside dense rows         |
| `--space-1`    | 4    | Hairline gaps, badge padding         |
| `--space-2`    | 8    | Tight cluster gaps, icon + label     |
| `--space-3`    | 12   | Default row padding-x                |
| `--space-4`    | 16   | Default row padding-y, form gap      |
| `--space-5`    | 24   | Card padding-md, page gutter         |
| `--space-6`    | 32   | Card padding-lg, content gutter      |
| `--space-7`    | 48   | Section spacing, content top pad     |
| `--space-8`    | 64   | Content bottom pad                   |

`--space-half` exists for micro-gaps that 4 px would loosen too much
(e.g. between `IconButton`s in a row). Stack/Cluster/List support it via
`space="half"`.

### Sizing

Layout, control, and icon sizes are tokenized so geometry stays consistent
without hand-tuning.

| Token                     | Value | Use                                   |
| ------------------------- | ----- | ------------------------------------- |
| `--layout-sidebar-width`  | 240px | Sidebar width                         |
| `--layout-content-max`    | 880px | Centered content max-width            |
| `--popover-width`         | 320px | Currency picker popover               |
| `--popover-max-height`    | 380px | Currency picker popover               |
| `--dialog-max-width`      | 440px | Dialog panel                          |
| `--control-height-sm`     | 28px  | Small button, icon button             |
| `--control-height-md`     | 36px  | Default button, default input         |
| `--control-height-lg`     | 40px  | Currency picker, search field         |
| `--control-pad-x-sm`      | 12px  | Small button horizontal padding       |
| `--control-pad-x-md`      | 16px  | Default button horizontal padding     |
| `--icon-xs / sm / md / lg`| 10/14/16/22 | Icon component sizes            |

### Typography

A single sans-serif family (Inter, with InterVariable when supported) and
a scalar size scale. Tabular numerals are applied at the call site for
amounts and rates (`font-variant-numeric: tabular-nums`).

| Token            | Value     | Use                                    |
| ---------------- | --------- | -------------------------------------- |
| `--font-sans`    | Inter…    | Default UI font                        |
| `--font-mono`    | system mono | Code in DESIGN preview only          |
| `--text-2xs`     | 10.5px    | Section labels, badges                 |
| `--text-xs`      | 11.5px    | Footnotes, table meta                  |
| `--text-sm`      | 12.5px    | Caption, secondary meta                |
| `--text-base`    | 13.5px    | Body, default control text             |
| `--text-md`      | 14px      | List item titles, currency code        |
| `--text-lg`      | 15px      | Wordmark, dialog title                 |
| `--text-xl`      | 16px      | Rate values, currency-picker label     |
| `--text-2xl`     | 18px      | Inline flag glyphs                     |
| `--text-3xl`     | 24px      | Page title (`h1`)                      |
| `--text-display` | 36px      | Amount input                           |

| Token                | Value        |
| -------------------- | ------------ |
| `--weight-regular`   | 400          |
| `--weight-medium`    | 500          |
| `--weight-semibold`  | 600          |
| `--tracking-display` | -0.02em      |
| `--tracking-tight`   | -0.01em      |
| `--tracking-normal`  | 0            |
| `--tracking-wide`    | 0.02em       |
| `--tracking-caps-sm` | 0.04em       |
| `--tracking-caps`    | 0.06em       |
| `--leading-tight`    | 1            |
| `--leading-snug`     | 1.2          |
| `--leading-normal`   | 1.5          |

### Shadow

| Token         | Use                              |
| ------------- | -------------------------------- |
| `--shadow-sm` | Cards (resting elevation)        |
| `--shadow-md` | Popovers                         |
| `--shadow-lg` | Dialog panel                     |

### Motion

Duration tokens pair with easing tokens — a small number of combinations
covers the whole UI.

| Duration       | Use                                   |
| -------------- | ------------------------------------- |
| `--dur-1` 80ms | Button press feedback                 |
| `--dur-2` 120ms| Standard color/border transitions     |
| `--dur-3` 140ms| Backdrop fade                         |
| `--dur-4` 160ms| Dialog rise                           |
| `--dur-5` 360ms| Swap-button rotation (spring)         |

| Easing             | Use                                  |
| ------------------ | ------------------------------------ |
| `--ease-standard`  | Default — `ease`                     |
| `--ease-emphatic`  | Cubic — dialog rise                  |
| `--ease-spring`    | Cubic — overshoot for swap rotation  |

### Z-index

| Token          | Layer                  |
| -------------- | ---------------------- |
| `--z-popover`  | 20 — currency popover  |
| `--z-dialog`   | 50 — modal backdrop    |

---

## Components

Imported from `$lib/components/{Name}.svelte`. Every component consumes
tokens; no component contains hardcoded `px`, hex, or duration values.

### Primitives

#### `Icon`

Single-source icon library. All icons are 16×16 viewbox, currentColor
stroke, with `stroke-width` defaulting to 1.5.

```svelte
<Icon name="convert" />
<Icon name="plus" size="sm" strokeWidth={1.6} />
```

| Prop          | Type                                      | Default |
| ------------- | ----------------------------------------- | ------- |
| `name`        | `IconName` (exported union)               | —       |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg'`            | `'md'`  |
| `strokeWidth` | `number`                                  | `1.5`   |

Available names: `arrow-right`, `check`, `chevron-down`, `close`,
`convert`, `edit`, `people`, `plus`, `rates`, `search`, `send`,
`stories`, `swap-vertical`, `trash`, `trend-up`, `user`.

#### `Avatar`

Initials avatar with deterministic palette (1 of 7 paired tones based on
a hash of the name).

```svelte
<Avatar name="Jane Doe" size={40} />
```

#### `Badge`

Small uppercase label.

```svelte
<Badge variant="neutral">soon</Badge>
<Badge variant="soft">Coming soon</Badge>
<Badge variant="success">Saved ✓</Badge>
```

#### `SectionLabel`

Tiny uppercase label used to introduce a group (sidebar sections, form
section heads, list groupings). Render as `div` (default) or `h2` for
proper page outlines.

```svelte
<SectionLabel text="Money" />
<SectionLabel as="h2" text="Recent" />
```

### Controls

#### `Button`

```svelte
<Button variant="primary" size="md" onclick={save}>Save</Button>
```

| Prop      | Values                                      |
| --------- | ------------------------------------------- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'`       |
| `size`    | `'sm' \| 'md'`                              |

Accepts all native button attributes. Children render inside; pair with
an `Icon` for leading-icon buttons.

#### `IconButton`

Square icon-only button. Requires `aria-label`.

```svelte
<IconButton aria-label="Edit"><Icon name="edit" size="sm" /></IconButton>
<IconButton variant="danger" aria-label="Delete"><Icon name="trash" size="sm" /></IconButton>
```

#### `Input`

```svelte
<Input bind:value placeholder="…" />
<Input bind:value size="xl" align="right" />
```

`size="xl"` is the display variant used by the converter's amount input —
36px, semibold, tabular numerals, focus-borderless.

#### `SearchField`

Magnifier-iconed text input. `variant="card"` (default) for stand-alone
use; `variant="plain"` for placement inside a popover (no border, divider
underneath).

```svelte
<SearchField bind:value={query} placeholder="Search contacts" />
```

#### `Field`

Form-row wrapper that pairs an uppercase label with any control. Renders
as `<label>` by default (clicking the label focuses its input); pass
`as="div"` when wrapping a non-form-control like `<CurrencyPicker>`.

```svelte
<Field label="Name">
  <input bind:value={name} type="text" />
</Field>

<Field label="Email" optional>
  <input bind:value={email} type="email" />
</Field>

<Field label="Preferred currency" as="div">
  <CurrencyPicker selected={code} onSelect={...} />
</Field>
```

`<input>` and `<textarea>` placed inside `Field` are styled automatically
via the `:global()` selectors on the field wrapper.

### Layout primitives

#### `Stack`

Vertical flex with a tokenized gap. Use it whenever you'd otherwise write
`display: flex; flex-direction: column; gap: var(--space-N)`.

```svelte
<Stack space="4">
  <Field label="Name">…</Field>
  <Field label="Email">…</Field>
</Stack>
```

| Prop    | Values                                              | Default     |
| ------- | --------------------------------------------------- | ----------- |
| `space` | `'1' \| '2' \| '3' \| '4' \| '5' \| '6' \| '7' \| '8'` | `'3'`       |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'`         | `'stretch'` |

Half-step gaps (`--space-half`) are not exposed here — they're nearly
always component-internal.

#### `Cluster`

Horizontal flex with wrap-by-default. The horizontal counterpart to
`Stack`. Used for inline meta lines (with `DotSep`), button groups,
icon + label rows, and any "things in a line, with a gap".

```svelte
<Cluster space="2">
  <span>1 USD = 0.92 EUR</span>
  <DotSep />
  <span>1 EUR = 1.09 USD</span>
</Cluster>

<Cluster justify="between">
  <h2>Recent</h2>
  <Button variant="ghost">Clear</Button>
</Cluster>
```

| Prop      | Values                                                       | Default    |
| --------- | ------------------------------------------------------------ | ---------- |
| `space`   | `'1' \| '2' \| '3' \| '4' \| '5' \| '6'`                     | `'2'`      |
| `align`   | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`    | `'center'` |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'`                  | (none)     |
| `wrap`    | `boolean`                                                    | `true`     |
| `as`      | `'div' \| 'span'`                                            | `'div'`    |

#### `DotSep`

The middle-dot separator (`·`) used between meta items. Always
`--color-text-subtle`. No props.

```svelte
<Cluster space="2">
  <span>foo</span> <DotSep /> <span>bar</span> <DotSep /> <span>baz</span>
</Cluster>
```

### Lists

#### `List`

Resets a `<ul>` and stacks its `<li>` children with a tokenized gap.

```svelte
<List space="2">
  <ListRow as="a" href="/convert?from=USD&to=EUR">…</ListRow>
  <ListRow as="a" href="/convert?from=EUR&to=GBP">…</ListRow>
</List>
```

| Prop    | Values                                       | Default |
| ------- | -------------------------------------------- | ------- |
| `space` | `'half' \| '1' \| '2' \| '3' \| '4'`         | `'2'`   |

#### `ListRow`

The hover-bordered row used in every list across the app (recent
conversions, contacts, rates). Renders an `<li>` wrapping an inner
element selected by `as`.

```svelte
<!-- static row -->
<ListRow padding="sm">…</ListRow>

<!-- linked row -->
<ListRow as="a" href={`/convert?from=${from}&to=${to}`} padding="md">…</ListRow>

<!-- click-to-load row -->
<ListRow as="button" onclick={() => load(item)} padding="sm">…</ListRow>
```

| Prop         | Values                       | Default |
| ------------ | ---------------------------- | ------- |
| `as`         | `'div' \| 'a' \| 'button'`   | `'div'` |
| `padding`    | `'sm' \| 'md'`               | `'sm'`  |
| `href`       | `string` (when `as="a"`)     | —       |
| `onclick`    | `(e) => void` (when `as="button"`) | — |
| `aria-label` | `string`                     | —       |

The row provides the surface (background, border, hover, padding); inner
layout (grid, flex, etc.) is the consumer's responsibility — usually a
`Cluster` or a small grid wrapper.

### Containers

#### `Card`

```svelte
<Card padding="lg">…</Card>
```

`padding`: `'sm'` (`--space-4`), `'md'` (`--space-5`), `'lg'` (`--space-6`).

#### `Dialog`

Modal with backdrop, title bar, body, and optional footer snippet.
Dismisses on Escape and backdrop click.

```svelte
<Dialog open={isOpen} title="New contact" onClose={close}>
  …body…
  {#snippet footer()}
    <Button variant="ghost" onclick={close}>Cancel</Button>
    <Button variant="primary" onclick={save}>Add</Button>
  {/snippet}
</Dialog>
```

#### `EmptyState`

Centered empty/zero-data display.

```svelte
<EmptyState
  title="No contacts yet"
  description="Add the people you most often send money to."
>
  {#snippet icon()}<Icon name="user" size="lg" />{/snippet}
  {#snippet action()}<Button variant="secondary" size="sm">Add</Button>{/snippet}
</EmptyState>

<!-- subtle / inline form -->
<EmptyState tone="subtle" description='No contacts match "lukas".' />
```

### Page chrome

#### `Sidebar`

The fixed app sidebar (brand mark, two nav groups, footer). Used once in
`+layout.svelte` — not re-usable elsewhere.

#### `NavItem`

Used inside `Sidebar`. Active state derived from `$app/state.page`.

```svelte
<NavItem href="/convert" label="Convert">
  {#snippet icon()}<Icon name="convert" />{/snippet}
</NavItem>
<NavItem href="/send" label="Send" soon>…</NavItem>
```

#### `PageHeader`

Title + optional subtitle + optional actions snippet. Every route page
opens with this.

```svelte
<PageHeader title="Convert" subtitle="Live FX rates from the European Central Bank." />

<PageHeader title="Contacts" subtitle="People you send to and receive from.">
  {#snippet actions()}
    <Button variant="primary"><Icon name="plus" size="sm" />Add contact</Button>
  {/snippet}
</PageHeader>
```

### Domain

#### `CurrencyPicker`

Pill-shaped trigger (flag + code + chevron) opening a searchable popover
of all currencies, with a "Popular" group when no query is active.

```svelte
<CurrencyPicker selected={code} exclude={otherCode} onSelect={(c) => (code = c)} />
```

#### `Sparkline`

Line chart of N points, height-normalized. Tone is semantic, not a raw
color.

```svelte
<Sparkline points={[12, 14, 13, 16, 18]} tone="up" />
```

`tone`: `'neutral' | 'up' | 'down'` — maps to `--color-text-muted`,
`--color-success`, `--color-danger`.

---

## Storybook preview — `/design`

The `/design` route is a live preview gallery rendered with the actual
runtime components. Visit it locally:

```sh
bun run dev
# then open http://localhost:5173/design
```

It renders, in order:

- **Tokens** — Colors, Typography (size / weight / tracking), Space,
  Radius, Shadow, Motion (hover the tiles to play each duration/easing
  pair).
- **Components** — Icons, Avatars, Badges, Buttons, Icon buttons, Inputs,
  Search field, Form fields, Cards, Empty states, Page header, Currency
  picker, Sparklines, Dialog.

A jump-link rail at the top lets you navigate any section by anchor.

The route is dev-facing: it is intentionally not linked in the sidebar.
Add new component variants here whenever you introduce or change a
component.

---

## Conventions

### Authoring rules

- **Never write a `px`, hex, duration, or radius literal in component or
  route CSS.** If a token does not exist for what you need, add one to
  `app.css` and update this document.
- **Never inline `rgba()` or `#hex`** in component styles. Add a token
  (e.g. `--color-danger-soft`) instead.
- **Component CSS is scoped.** Use `:global()` only when styling
  user-supplied children (as `Field` does for `<input>`/`<textarea>`).
- **Prefer `Stack` and `Cluster` over ad-hoc flex CSS.** Reach for them
  whenever the only thing you'd write is `flex-direction + gap`. Drop to
  raw flex/grid when you need things they don't express (positioning,
  custom alignment per-child, complex grid templates).
- **List + ListRow for any vertical list of clickable rows.** No more
  per-page `.row` classes.
- **No `<svg>` in routes.** Always go through `<Icon>`. To add a new
  glyph, add it to the `IconName` union and the switch in `Icon.svelte`.
- **Page chrome stays consistent.** Every route opens with `<PageHeader>`
  and lays content out at `--layout-content-max`.

### Numeric data

Amounts and rates are typeset with `font-variant-numeric: tabular-nums`
so columns align. Apply this on the leaf element that renders the number,
not on the entire row.

### Accessibility

- `IconButton` requires `aria-label`.
- `Dialog` traps Escape and clicks on the backdrop close it.
- `Avatar` is `aria-hidden` — always pair it with the visible name.
- `NavItem` sets `aria-current="page"` when active.
- Section labels are visual only (`SectionLabel as="div"`); when a section
  is a real document landmark, render it as `as="h2"`.

### Adding a new component

1. Sketch in `/design` first — confirm the variants you need.
2. Create `src/lib/components/Name.svelte`. Use only tokens.
3. Add a section to `/design`'s preview page.
4. Document props and a usage example in this file under **Components**.
5. Replace any in-place duplications across routes with the new
   component.

### Adding a new token

1. Add it to `:root` in `src/app.css` in the appropriate group.
2. Document it in the relevant table in this file.
3. Replace any matching literal in components and routes.
4. Render it in the corresponding `/design` token section if it is
   visually meaningful.
