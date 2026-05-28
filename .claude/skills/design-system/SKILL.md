---
name: design-system
description: Use this skill BEFORE writing or editing any UI in finn — building a screen, page, route, form, dialog, list, button, or component. It gives you the component inventory pointer, composition recipes, anti-patterns to avoid, and the rules for translating a Figma design or rough sketch into the right primitives. Triggers on phrases like "build a screen", "add a page", "make a form", "create a route", "design", "component", "send screen", "convert", "contacts", "figma", "sketch", "wireframe", "mockup", any figma.com URL, any image/jpg/png input describing a UI, or any task involving `.svelte` files under `src/routes/` or `src/lib/components/`.
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
- "Form row with a label + bordered control"  →  `<Field>` (don't wrap `<input>` in your own `<label>`)
- "Currency picker + amount input on one row"  →  `<AmountField>` (the convert / send amount pattern — never compose by hand from `<Field>` + `<Input size="xl">`; Field's CSS clobbers the xl variant)
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

## Step 4 — Run `bun run check`

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
   - **If one child is a full-width control** (`<Input>`, `<Input size="xl">`,
     `<textarea>`) **and the row should not wrap**, pass `wrap={false}`.
     Default Cluster wraps, and a `width: 100%` Input next to anything
     else forces the Input onto its own line. The amount-row pattern
     (currency picker + amount input on the same row) is
     `<Cluster space="4" wrap={false}>` — see the Amount row recipe
     below and `src/routes/convert/+page.svelte` for the live example.

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

## When implementing from a rough sketch

A hand-drawn sketch (paper, whiteboard, napkin photo, low-fidelity wireframe)
is **intent, not spec**. It shows what the user wants the screen to *do*,
not exactly how it should look. Your job is to make the thing actually work
— that means filling in everything a sketch can't capture, and using
judgment when the sketch is ambiguous, contradictory, or impractical.

This is the opposite of the Figma rules above: with Figma, fidelity to
the source is the goal. With a sketch, fidelity to the source's *intent*
is the goal.

1. **Read the sketch for intent, not pixels.** A box labeled "TO" is a
   recipient picker — pick the right primitive (`<Field>` + recipient
   search, or `<List>` of contacts) based on what makes the flow work,
   not on whether the sketch drew a square or a rectangle. Squiggles,
   uneven spacing, and rough arrows are noise; the labels and the
   ordering are signal.

2. **Don't replicate sketch artifacts as UI.** Annotations like "Quick
   send (contacts)", arrows pointing between regions, dashed
   placeholders, or scratched-out alternatives are the user thinking
   out loud — not elements to render. Translate them: a "Quick send"
   arrow into a contacts area means *those two things connect*, not
   "draw an arrow on the page."

3. **Fill in everything the sketch omits.** A sketch typically only
   shows the happy path of one state. The working screen needs all of:
   empty state (`<EmptyState>`), loading, validation errors, disabled
   wiring on the submit button, focus rings, hover transitions, and
   error recovery. Default to the project's existing patterns
   (`/contacts`, `/convert`) when the sketch is silent — don't invent
   new ones, don't omit them.

4. **Make logical composition decisions when the sketch is ambiguous.**
   If two elements are drawn near each other but it's unclear whether
   they're one row or stacked, pick whichever composition makes the
   flow work better and is consistent with the rest of finn. The
   sketch can't dictate `<Cluster>` vs `<Stack>` — you decide based on
   what reads well and matches the established vocabulary.

5. **Improve obviously-broken bits.** If the sketch shows the Send
   button before the amount field, or omits a confirmation step that
   the flow clearly needs, fix it. A sketch is a draft — the user
   expects you to apply product sense, not ship a literal transcription
   of a 30-second drawing. When you make a non-trivial deviation,
   mention it briefly in your final summary so the user can push back.

6. **Use existing copy, not sketch shorthand.** "TO", "AMT", "$", and
   other abbreviations in a sketch are space-saving shorthand, not
   final copy. Write proper labels ("Recipient", "Amount") consistent
   with the rest of the app — unless the sketch's exact wording is
   clearly intentional (e.g. branded terminology).

7. **Pick primitives the same way you would from a brief.** The
   decision tree in Step 2 still applies: a vertical column is
   `<Stack>`, a row of things is `<Cluster>`, a form row is `<Field>`,
   a currency selector is `<CurrencyPicker>`. The sketch doesn't
   change which primitive is right — it only tells you *which screen*
   to build.

8. **When in doubt between two reasonable interpretations, pick one
   and ship it.** Don't stop and ask the user about every ambiguity in
   a rough drawing — that defeats the point of a sketch. Reserve
   questions for the genuinely load-bearing decisions (e.g. "is this a
   one-step or two-step flow?"). Surface your interpretation in the
   final summary.

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
9. **`<Input>` inside `<Field>`.** Field's CSS targets descendant
   `<input>` elements and clobbers Input variants — most visibly,
   `size="xl"`'s 36px borderless display gets reset to 12.5px bordered.
   Inside a Field, use a bare `<input>`/`<textarea>`. For the
   currency-picker + amount-input pattern, use `<AmountField>`.

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

### An amount row (currency picker + amount input)

Use `<AmountField>`. It bundles the SectionLabel-style label, the
non-wrapping row, the CurrencyPicker, and the `<Input size="xl">`
display input — the entire pattern is one primitive.

```svelte
<AmountField
  label="Amount"
  bind:value={amount}
  currency={code}
  onCurrencySelect={(c) => (code = c)}
/>
```

For a converter pair (two currencies on a swap row):

```svelte
<AmountField
  label="You send"
  bind:value={fromAmount}
  currency={from}
  excludeCurrency={to}
  onCurrencySelect={selectFrom}
  oninput={onFromInput}
/>
<AmountField
  label="They get"
  bind:value={toAmount}
  currency={to}
  excludeCurrency={from}
  onCurrencySelect={selectTo}
  oninput={onToInput}
/>
```

Don't compose by hand from `<Field>` + `<Input size="xl">` — Field's
`:global(input)` selector targets the bare `<input>` element Input
renders and overrides the 36px display variant with Field's 12.5px
bordered style. `AmountField` exists to skip that failure mode.

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
