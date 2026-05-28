# How to set up design tokens in your project

Tokens are the single source of truth for *every* visual decision: color, spacing, radius, type, shadow, motion, z-index. They're not a "theming" feature — they're the vocabulary your codebase speaks. Without them, the ESLint `no-css-literals` rule has nothing to point at, and the design-system skill's "map every literal to a token" rule is hollow. Set this up *first*, before writing any components.

## 1. One file, on `:root`, plain CSS custom properties

Put every token in `src/app.css` (or your equivalent global stylesheet) as a CSS custom property on `:root`. No SCSS variables, no JS theme object, no Tailwind config. The reason is reach: CSS custom properties work in every framework, every style block, every inline style, every browser devtool — and they're the only mechanism a linter can usefully grep against.

```css
:root {
    /* ---------- Color · Surface ---------- */
    --color-bg: #faf9f6;
    --color-surface: #ffffff;
    --color-surface-sunken: #f1efe8;

    /* ---------- Color · Text ---------- */
    --color-text: #14140f;
    --color-text-muted: #65655d;
    /* ... */
}
```

Group with section-comment headers (`/* ---------- Color · Surface ---------- */`). The grouping *is* the documentation — when an agent skims the file, the headers tell it what categories exist.

## 2. The category list — what to include, in this order

The order matters because earlier groups are referenced by later groups (sizing references space, shadows reference color). Don't reorder.

1. **Color · Surface** — page background, card surface, sunken/inset surface.
2. **Color · Text** — body, muted (secondary), subtle (tertiary), `on-accent` (the contrast color used on top of `accent`).
3. **Color · Border** — default border, strong border (for inputs, dividers).
4. **Color · Accent / Brand** — primary action color, hover state, soft (low-opacity wash for hover backgrounds).
5. **Color · Semantic** — success, danger, plus a `danger-soft` rgba for error backgrounds.
6. **Color · Overlay** — the dialog/scrim color (an rgba of your near-black).
7. **Avatar palette** — N paired bg/fg colors (`--avatar-1-bg` + `--avatar-1-fg`, etc.) for deterministic initial-circle backgrounds. Pair them so any fg sits accessibly on its matching bg.
8. **Radius** — `sm` / `md` / `lg` / `pill` (999px) / `circle` (50%).
9. **Spacing** — a 4-point scale `--space-1: 4px` through `--space-8: 64px`, plus a `--space-half: 2px` for the rare hairline gap. Don't have a `--space-9`; that's a sign you need a layout primitive, not a bigger token.
10. **Sizing · Layout** — sidebar width, content max-width, popover dimensions, dialog max-width. These are the few "this is wider than a control" measurements.
11. **Sizing · Controls** — `--control-height-sm/md/lg` (28/36/40px), `--control-pad-x-sm/md`.
12. **Sizing · Icons** — `xs/sm/md/lg` (10/14/16/22px).
13. **Typography · Family** — `--font-sans`, `--font-mono`, with a system-font fallback stack and a `@supports (font-variation-settings)` upgrade to the variable font.
14. **Typography · Size** — a tight scale (`2xs/xs/sm/base/md/lg/xl/2xl/3xl/display`). Half-pixel values (10.5px, 12.5px, 13.5px) are deliberate — they hit the optical size your fonts were drawn for.
15. **Typography · Weight** — `regular/medium/semibold` (400/500/600). Skip 700 unless you actually use it.
16. **Typography · Tracking** — `display` (-0.02em, for large numerals), `tight` (-0.01em, for headings), `normal`, `wide`, `caps-sm` (0.04em), `caps` (0.06em). The two `caps-*` values are what uppercase section labels and field labels use — naming them as tokens prevents the "is it 0.05 or 0.06?" debate.
17. **Typography · Leading** — `tight` (1), `snug` (1.2), `normal` (1.5).
18. **Shadow** — `sm/md/lg`. Express them with rgba of your text color, not pure black, so they tint correctly.
19. **Motion · Duration** — `--dur-1` through `--dur-5` (80/120/140/160/360ms). Five steps is plenty.
20. **Motion · Easing** — `--ease-standard`, `--ease-emphatic` (cubic-bezier for entrances), `--ease-spring` (cubic-bezier with overshoot for playful microinteractions).
21. **Z-index** — only the layers you actually use (`--z-popover: 20`, `--z-dialog: 50`). Don't pre-declare 8 layers.

## 3. Naming rules

- **Semantic, not literal.** `--color-text-muted`, not `--color-gray-500`. The literal name dies the moment you change the palette; the semantic name survives forever. Same for `--color-accent` — name it by role so it survives a rebrand.
- **Role · variant.** Two-part name where the first segment is the role (`color-text`, `space`, `dur`) and the second is the variant (`muted`, `1`, `2`). Keep it consistent.
- **No T-shirt sizes for spacing.** Space is `--space-1..8`, not `--space-xs/sm/md`. Numeric scales let you reason about ratios (`--space-4` is double `--space-2`); T-shirt sizes don't.
- **T-shirt sizes for typography and icons.** Typography is `--text-2xs..3xl/display`, icons are `--icon-xs..lg`. The mapping from "I want a heading" to a size is more discoverable with names than with numbers.
- **Don't smuggle in component-specific tokens.** `--button-padding` doesn't belong here; it belongs in `Button.svelte` as `padding: 0 var(--control-pad-x-md)`. The token system describes the *language*, not every word in it.

## 4. The two sources stay in sync

Tokens have two representations, and the contract is that they're both updated in the same PR:

1. **Your global stylesheet** (e.g. `src/app.css`, `styles/globals.css`) — the source of truth (CSS custom properties on `:root`).
2. **A human-readable token reference** (e.g. `tokens.md` next to the stylesheet) — one row per token: name, value, intended use. This is what an agent skims when it asks "is there a token for X?"

If a token exists in one place but not the other, it's effectively missing. The contract between these two files needs to be stated somewhere the agent will read it before editing UI.

## 5. The reset + accessibility belong in the same file

After the `:root` block, `app.css` contains:

- **A minimal reset.** `box-sizing: border-box` on `*`, zero margins/padding on `html/body`, `font: inherit` on form controls, zero margin on headings/`<p>`.
- **The body baseline.** `background: var(--color-bg)`, `color: var(--color-text)`, `font-family: var(--font-sans)`, `font-size: var(--text-base)`, font smoothing, `font-feature-settings` to enable any OpenType features your font ships.
- **Focus rings.** `:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible` with a 2px outline in `--color-accent` and 2px offset. Token-driven so every component inherits it automatically — components shouldn't define their own focus styles.
- **Reduced-motion override.** `@media (prefers-reduced-motion: reduce)` collapsing animation/transition durations to 0.01ms. Token-defined motion still respects this because the override hits any element with animation/transition.
- **Two utility classes.** `.sr-only` (visually hidden, screen-reader exposed) and `.skip-link` (the "skip to content" link that floats in on focus). These two utilities are universal — adding them to `app.css` is cheaper than making everyone reinvent them.

Keep these *in `app.css`*, not in a separate `reset.css` or `accessibility.css`. They're part of the same contract as the tokens — global, foundational, applied everywhere.

## 6. The escape hatch: when you *must* use a literal

Three places literals are acceptable, and the ESLint rule should exempt them:

- **`0` values** (`0px`, `0ms`) — there's no useful token, and tokenizing zero adds nothing.
- **`1px` hairlines** — the universal CSS border width. Every component has them; tokenizing as `--border-width: 1px` is ceremony without payoff.
- **rgba inside token *definitions* themselves** — `--color-overlay: rgba(20, 20, 15, 0.32)` uses literal values because *this is the definition*. The rule should only fire in component/route style blocks, not in `app.css`.

Anything else gets tokenized.

## 7. Seeding the scale — picking values

Don't agonize. The values in this project are a reasonable starting point:

- **Spacing:** 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- **Radius:** 6 / 10 / 14 / 999 / 50%.
- **Type:** 10.5 / 11.5 / 12.5 / 13.5 / 14 / 15 / 16 / 18 / 24 / 36.
- **Control heights:** 28 / 36 / 40.
- **Icons:** 10 / 14 / 16 / 22.
- **Durations:** 80 / 120 / 140 / 160 / 360 ms.

You'll tweak two or three values once you build the first real screen. That's fine — change them in `app.css`, and every component picks up the change because they all reference the token name. This is the payoff for the discipline.

## 8. Cross-references — what other prompts depend on this

- The **`no-css-literals` ESLint rule** assumes tokens exist for every category it bans (color, spacing, motion, sizing). If you ban `px` but don't have a spacing scale, the rule fires on legitimate code with nowhere to go.
- The **design-system skill's Figma rule** ("map every literal you read to a token") references the named scales above. The skill should list the actual mappings: `24px → --text-3xl`, `0.06em → --tracking-caps`, etc.
- **Component documentation** references tokens by name in code examples. Keep example values aligned with the actual scale so copy-paste produces working code.

## 9. Definition-of-done for the token setup

- [ ] Your global stylesheet exists with the 21 grouped categories above, each section commented.
- [ ] Every value is a CSS custom property on `:root`, no SCSS variables, no JS theme object.
- [ ] A human-readable token reference exists with one row per token (name, value, intended use).
- [ ] Reset, body baseline, `:focus-visible` ring, `prefers-reduced-motion` override, `.sr-only`, and `.skip-link` all live in the global stylesheet.
- [ ] No component-specific tokens (`--button-padding`, etc.) in the global file.
- [ ] No literals outside the three documented exceptions (0-values, 1px hairlines, token definitions themselves).
- [ ] The ESLint `no-css-literals` rule fires in component/route style blocks but not in the global stylesheet.

## 10. Style rules for the tokens themselves

- **Resist the urge to add tokens preemptively.** Add `--color-warning` when you build the first warning-colored thing, not before. Tokens you never use are clutter — and they make `tokens.md` harder to scan.
- **A token's name should survive a redesign.** `--color-accent` works whether your brand is near-black, neon green, or royal blue. `--color-near-black` doesn't.
- **One token does one thing.** `--space-4: 16px` is used for gaps, padding, margins — that's fine, it's all "16px of space." But if you find yourself wishing `--space-4` meant 16px for spacing but 18px for type, you actually wanted two tokens.
- **Half-step values are deliberate.** `--space-half: 2px` and the `.5px` typography values aren't bugs. They're the small adjustments that make optical sizing work. Don't round them to "be tidier."
- **When you change a token's value, grep for it first.** A `--color-accent` change ripples everywhere; verify the new value still reads correctly on `--color-text-on-accent` and in `--color-accent-soft` before merging.
