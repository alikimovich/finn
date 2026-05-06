# finn — design tokens

Single source of truth for the visual language. All tokens live on `:root`
in `src/app.css` and are consumed via `var(--token-name)`. **Never write a
literal value** (hex, rgba, px, ms) in component or route CSS — if the
right token doesn't exist, add one to `app.css` first, document it here,
then use it.

This file is the human-readable reference for the same tokens visualized
in Storybook (Docs → Tokens).

---

## Color

### Surface (page chrome and panels)

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#faf9f6` | Page background. The default body color. |
| `--color-surface` | `#ffffff` | Cards, dialogs, popovers. Anything that should look "lifted." |
| `--color-surface-sunken` | `#f1efe8` | Inset surfaces (e.g. accent-soft hover targets). |

### Text

| Token | Value | Use |
| --- | --- | --- |
| `--color-text` | `#14140f` | Default body text and headings. |
| `--color-text-muted` | `#65655d` | Secondary copy (subtitles, helper text). |
| `--color-text-subtle` | `#74746c` | Tertiary copy (hints, placeholders). |
| `--color-text-on-accent` | `#faf9f6` | Text rendered on `--color-accent` surfaces (primary buttons). |

### Border

| Token | Value | Use |
| --- | --- | --- |
| `--color-border` | `#ebe9e2` | Default 1px borders for cards, list rows, inputs. |
| `--color-border-strong` | `#d9d6cc` | Hover/active border. Currency picker pill. |

### Accent / brand

| Token | Value | Use |
| --- | --- | --- |
| `--color-accent` | `#14140f` | Primary button fill, focus rings. |
| `--color-accent-hover` | `#2a2a23` | Primary button hover. |
| `--color-accent-soft` | `#f1efe8` | Hover/selected fill on neutral surfaces. |

### Semantic

| Token | Value | Use |
| --- | --- | --- |
| `--color-success` | `#2f7a4f` | Up tones, saved confirmations. |
| `--color-danger` | `#b8423b` | Destructive action color. |
| `--color-danger-soft` | `rgba(184,66,59,0.1)` | Destructive hover background. |

### Overlay

| Token | Value | Use |
| --- | --- | --- |
| `--color-overlay` | `rgba(20,20,15,0.32)` | Dialog backdrop. |

### Avatar palette

Seven paired tones (`bg` + `fg`). `<Avatar>` picks one deterministically
from a hash of the name.

`--avatar-{1..7}-bg`, `--avatar-{1..7}-fg`.

---

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | `6px` | Badges, small chips, IconButton. |
| `--radius-md` | `10px` | Buttons, inputs, list rows. |
| `--radius-lg` | `14px` | Cards, dialogs. |
| `--radius-pill` | `999px` | Currency picker pill, fully-rounded. |
| `--radius-circle` | `50%` | Avatars, dots. |

---

## Spacing (4-pt scale + 2px micro)

Used as `var(--space-N)` for `gap`, `padding`, `margin`. Always pass
through `<Stack space="…">` or `<Cluster space="…">` for layout — only
fall back to raw CSS for grids or per-child positioning a primitive can't
express.

| Token | Value |
| --- | --- |
| `--space-half` | `2px` |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `24px` |
| `--space-6` | `32px` |
| `--space-7` | `48px` |
| `--space-8` | `64px` |

---

## Sizing

### Layout

| Token | Value |
| --- | --- |
| `--layout-sidebar-width` | `240px` |
| `--layout-content-max` | `880px` |
| `--popover-width` | `320px` |
| `--popover-max-height` | `380px` |
| `--dialog-max-width` | `440px` |

### Controls

| Token | Value |
| --- | --- |
| `--control-height-sm` | `28px` |
| `--control-height-md` | `36px` |
| `--control-height-lg` | `40px` |
| `--control-pad-x-sm` | `var(--space-3)` |
| `--control-pad-x-md` | `var(--space-4)` |

### Icons

| Token | Value |
| --- | --- |
| `--icon-xs` | `10px` |
| `--icon-sm` | `14px` |
| `--icon-md` | `16px` |
| `--icon-lg` | `22px` |

---

## Typography

### Family

- `--font-sans` — Inter (variable when supported), system fallback.
- `--font-mono` — SF Mono / Menlo / Consolas.

### Size scale

| Token | Value | Typical use |
| --- | --- | --- |
| `--text-2xs` | `10.5px` | Badge text. |
| `--text-xs` | `11.5px` | Footer hints. |
| `--text-sm` | `12.5px` | Section labels, secondary copy. |
| `--text-base` | `13.5px` | Body text. |
| `--text-md` | `14px` | Form controls. |
| `--text-lg` | `15px` | Dialog titles, picker code. |
| `--text-xl` | `16px` | Sidebar wordmark. |
| `--text-2xl` | `18px` | Sub-section headlines. |
| `--text-3xl` | `24px` | Page titles. |
| `--text-display` | `36px` | Converter amount input. |

### Weight

`--weight-regular` (400), `--weight-medium` (500), `--weight-semibold` (600).

### Tracking

| Token | Value | Use |
| --- | --- | --- |
| `--tracking-display` | `-0.02em` | Page titles, converter amount. |
| `--tracking-tight` | `-0.01em` | Headings. |
| `--tracking-normal` | `0` | Body. |
| `--tracking-wide` | `0.02em` | Currency codes. |
| `--tracking-caps-sm` | `0.04em` | Field labels. |
| `--tracking-caps` | `0.06em` | Section labels, badges. |

### Leading

`--leading-tight` (1), `--leading-snug` (1.2), `--leading-normal` (1.5).

> Pair `font-variant-numeric: tabular-nums` on leaf elements rendering
> amounts and rates so columns align.

---

## Shadow

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-sm` | subtle | Cards, default surfaces. |
| `--shadow-md` | medium | Popovers. |
| `--shadow-lg` | large | Dialogs. |

---

## Motion

### Duration

| Token | Value | Use |
| --- | --- | --- |
| `--dur-1` | `80ms` | Tap depress. |
| `--dur-2` | `120ms` | Hover state changes. |
| `--dur-3` | `140ms` | Backdrop fade. |
| `--dur-4` | `160ms` | Dialog rise. |
| `--dur-5` | `360ms` | Larger transitions. |

### Easing

- `--ease-standard` — `ease`. The default.
- `--ease-emphatic` — `cubic-bezier(0.4, 0.8, 0.2, 1)`. Dialog rise.
- `--ease-spring` — `cubic-bezier(0.5, 1.4, 0.4, 1)`. Playful affordances.

---

## Z-index

| Token | Value | Use |
| --- | --- | --- |
| `--z-popover` | `20` | Currency picker, dropdowns. |
| `--z-dialog` | `50` | Modal layer. |

---

## Adding a new token

1. Add it to the matching group in `:root` in `src/app.css`.
2. Add a row to the table here with its value and intended use.
3. Replace any matching literal across the codebase.
4. Render it in the Storybook **Docs → Tokens** preview if it's
   visually-significant (color, space, radius).
