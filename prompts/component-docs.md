# Component documentation conventions

Every reusable UI component in your repo should be discoverable in two places at once: in the editor (on hover) and in the project's component inventory. The same source of truth feeds both, so you only write it once.

## 1. File layout — one folder per component

```
src/lib/components/        (Svelte example; same shape for React/Vue: src/components/Button/Button.tsx)
├── index.ts              ← barrel; routes import from here
└── Button/
    ├── Button.{ext}      the component
    └── index.ts          re-exports default + any exported types
```

The barrel re-exports every component as a named export so consumers write `import { Button, Card } from '$lib/components'` rather than reaching into folders. If your framework conventionally uses a different layout (e.g. flat `components/` for React), follow the framework convention — the *principle* is "one canonical import path per primitive", not the specific folder shape.

## 2. The top-of-file description block

At the top of every component source file, add a documentation block describing the component. In Svelte this is an HTML comment beginning with `@component`; in React/Vue/TS it's a JSDoc/TSDoc block on the default export or component function. This block is what an agent reads to decide whether to use the component. It must contain:

- **One paragraph** on what the component is and **when to use it** (and when *not* to — e.g. "never render a raw `<button>` in a route").
- A **Props** bullet list — short prose summary of each prop, including the default and any cross-references to related primitives.
- An `@example` fenced code block showing 2–3 realistic usages.

```svelte
<!--
    @component
    The standard button. Use this for **every** clickable action — never
    render a raw `<button>` in a route or page-level component. Pair with
    the project Icon primitive for leading-icon buttons.

    Props:
    - `variant` — `'primary' | 'secondary' | 'ghost'` (default `'primary'`).
      Use `primary` for the main action on a screen, `secondary` for
      alternates, `ghost` for low-emphasis (e.g. dialog Cancel).
    - `size` — `'sm' | 'md'` (default `'md'`).
    - All native `<button>` attributes (`onclick`, `disabled`, `type`, etc.).

    @example
    ```svelte
    <Button variant="primary" onclick={save}>Save</Button>
    <Button variant="ghost" size="sm" onclick={close}>Cancel</Button>
    ```
-->
```

The React/Vue equivalents use a JSDoc block above the component function with the same three parts (one-paragraph description, Props list, `@example`).

## 3. Per-prop JSDoc — every field on the `Props` interface

Declare a `Props` interface (or `PropsWithChildren`/`defineProps`/whatever your framework uses) and put a `/** … */` block on every field. Include a `@default` tag for any prop with a default. These doc comments are what shows on hover in the editor whenever a consumer types the prop name.

```ts
interface Props extends HTMLButtonAttributes {
    /**
     * Visual emphasis. `primary` is the main action on a screen,
     * `secondary` is for alternates, `ghost` for low-emphasis (e.g.
     * a Cancel button in a dialog footer).
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'ghost';
    /**
     * Control height. `sm` matches the 28px row-action size,
     * `md` is the default 36px form-control size.
     * @default 'md'
     */
    size?: 'sm' | 'md';
    /** Button label / icon-and-label content. */
    children: Snippet;
}
```

Rules:
- Every prop gets a JSDoc — no exceptions, even one-liners.
- Lead with the *purpose*, not the type (the type is already on the field).
- Mention the *when* and *why*, not just the *what*: "`primary` is the main action on a screen" beats "the primary variant."
- If a prop accepts a literal union, gloss each value.

## 4. Pair every component with an inventory row

The per-file documentation is for *consumers who already know which primitive to use*. An agent that doesn't yet know the primitive exists won't find it by reading individual source files. That's why each component needs a matching one-line row in your project's component inventory — a separate, scannable index that points at the primitives by category and explains *when* to reach for each one. Where that inventory lives is covered in the next step; the rule here is: **adding or renaming a component is incomplete until the inventory row is added or updated in the same PR.**

## 5. Definition-of-done checklist for any new component

- [ ] Folder created for the component with the source file and an `index.{ts,js}` (or follow your framework's conventional shape).
- [ ] Top-of-file documentation block with description, Props bullets, and `@example`.
- [ ] `Props` interface declared, every field has `/** … */` JSDoc, defaults tagged with `@default`.
- [ ] Component exported from the barrel so consumers import from one canonical path.
- [ ] Row added to the project's component inventory (covered in the next prompt).

A PR that adds a component without all five is incomplete.
