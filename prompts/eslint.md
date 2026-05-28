# How to write ESLint rules that enforce your design system

Docs and skills tell an agent what to do. ESLint rules **fail the build** when it doesn't. Without the lint gate, every promise in your project's agent guide and the design-system skill is honor-code — the moment an agent is tired, distracted, or working from a vague prompt, it ships a raw `<button>` and you find out at review time. With the gate, the same mistake is a red squiggle in the editor and a CI failure.

The rules don't replace the docs — they enforce them at the call site. Three categories of rule cover ~90% of what an agent gets wrong.

## Category 1 — Restrict raw HTML elements (built-in rules)

For most "use the primitive, not the raw element" enforcement, you don't need a custom rule. Use your framework's built-in restriction rule — `svelte/no-restricted-html-elements`, `react/forbid-elements`, `vue/no-restricted-syntax`, or equivalent — scoped to your route/page directories. *Not* to your component library directory, which is where the primitives legitimately implement the raw elements.

```js
// eslint.config.js — Svelte example; the React/Vue equivalents follow the same shape
{
    files: ['src/routes/**/*.svelte'],
    rules: {
        'svelte/no-restricted-html-elements': [
            'error',
            {
                elements: ['button'],
                message: 'Use the project Button primitive (or its icon-only variant) instead of a raw <button>.'
            },
            {
                elements: ['select'],
                message: 'No raw <select>. Use the project select/picker primitive.'
            },
            {
                elements: ['svg'],
                message: 'No raw <svg> in routes. Use the project Icon primitive.'
            },
            {
                elements: ['dialog'],
                message: 'Use the project Dialog primitive.'
            },
            {
                elements: ['ul', 'ol'],
                message: 'Use the project List + Row primitives for vertical lists of rows.'
            }
        ],
        'svelte/no-inline-styles': ['error', { allowTransitions: true }]
    }
}
```

Two rules of thumb:

- **Every restriction comes with a message that names the alternative.** "Use the project Button primitive" beats "raw button not allowed." The agent reading the error needs to know what to do next. Use the actual names of your primitives in your messages — generic placeholders here become concrete names in your real config.
- **Scope by path.** Library code (e.g. `src/lib/components/**`, `src/components/**`) is exempt because primitives implement the raw elements. Routes/pages are where the rule fires.

## Category 2 — A small in-repo plugin for the rules built-ins can't express

Two rules consistently can't be expressed by built-in `restricted-element` lists, and they're the two that matter most:

1. **`no-bare-input`** — `<input>`/`<textarea>` is allowed *inside the project's field-wrapper primitive* (something like `<Field>` / `<FormField>`), banned outside it. Built-ins can't do that — they only see element names, not ancestor structure.
2. **`no-css-literals`** — hex/rgba/px/ms inside style blocks. This is a regex over CSS, not an AST element check.

Both live in a single in-repo plugin: `eslint-rules/{project}-design-system.js`. The plugin is wired up in `eslint.config.js` under the `plugins:` key, scoped to the same route paths as Category 1.

### Skeleton for the plugin file

```js
// eslint-rules/my-design-system.js — Svelte example; same shape for React/Vue.
// In-repo ESLint plugin. Two rules covering the design-system invariants
// that the stock element/inline-style rules can't express.

// Replace these with the actual names of your project's field-wrapper primitives.
const FIELD_COMPONENT_NAMES = new Set(['Field', 'SearchField']);

function hasFieldAncestor(node) {
    let p = node.parent;
    while (p) {
        if (p.type === 'SvelteElement' && p.kind === 'component') {
            if (FIELD_COMPONENT_NAMES.has(p.name?.name)) return true;
        }
        p = p.parent;
    }
    return false;
}

const noBareInput = {
    meta: {
        type: 'problem',
        docs: { description: 'Bare <input>/<textarea> in routes must be wrapped in a field primitive.' },
        messages: {
            bareInput: 'Wrap <{{name}}> in the project field primitive (e.g. <Field label="…">) instead of using a bare element.'
        },
        schema: []
    },
    create(context) {
        return {
            SvelteElement(node) {
                if (node.kind !== 'html') return;
                const tag = node.name?.name;
                if (tag !== 'input' && tag !== 'textarea') return;
                if (tag === 'input' && isHiddenInput(node)) return;
                if (hasFieldAncestor(node)) return;
                context.report({ node: node.startTag, messageId: 'bareInput', data: { name: tag } });
            }
        };
    }
};

export default { rules: { 'no-bare-input': noBareInput /*, 'no-css-literals': ... */ } };
```

The React/Vue equivalents follow the same shape — walk the AST, look for the disallowed pattern, report with a message that names the fix.

### Writing the CSS-literal rule

Hit the framework's style-block AST node (`SvelteStyleElement`, `<style>` in `.vue`, CSS-in-JS template literal in React) and run regex over the text content. Don't try to parse CSS — regex is fine.

```js
const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const RGB_RE = /\brgba?\s*\(/g;
const PX_RE  = /(?<![a-zA-Z0-9_-])(\d+(?:\.\d+)?)px\b/g;
const MS_RE  = /(?<![a-zA-Z0-9_-])(\d+(?:\.\d+)?)ms\b/g;
```

**Exempt the meaningful zeros and the hairline.** `0px`, `0ms`, and `1px` (the universal CSS hairline used on every border) shouldn't fire — there's no useful token for them and flagging them just produces noise.

```js
if (messageId === 'px' && /^(?:0+(?:\.0+)?|1)px$/.test(matchText)) continue;
if (messageId === 'ms' && /^0+(?:\.0+)?ms$/.test(matchText)) continue;
```

**Strip comments before matching** so a hex value in a `/* ... */` comment isn't flagged. Replace with same-length whitespace so error offsets stay accurate.

**Compute precise locations.** Use `sourceCode.getLocFromIndex(baseOffset + m.index)` so the error underline points exactly at the literal, not at the whole `<style>` block.

### Messages that teach

Every message names the token category the literal should become:

```js
messages: {
    hex: 'Hex colour `{{match}}` — use a `var(--color-…)` token from your global stylesheet instead.',
    rgb: '`{{match}}` literal — use a `var(--color-…)` token from your global stylesheet instead.',
    px:  '`{{match}}` literal — use a token (`var(--space-…)`, `var(--icon-…)`, `var(--control-height-…)`). See your token reference.',
    ms:  '`{{match}}` literal — use a `var(--dur-…)` token from your global stylesheet instead.'
}
```

The message is half the rule. A good one ends the debugging loop in one read.

## Category 3 — Scope exemptions deliberately

A handful of paths get exempted from the design-system rules, and each exemption needs a comment explaining *why* it's safe:

```js
{
    files: ['src/routes/**/*.svelte'],
    ignores: [
        // Dev gallery that intentionally demos raw HTML.
        'src/routes/design/**',
        // Pre-existing routes that predate these rules; rewrites would be
        // doc-layer churn. New routes do not get added to this list.
        'src/routes/legacy-foo/**'
    ],
    // ...
}
```

Plus the implicit exemption: **your component library directory is never linted by these rules** because that's where the primitives legitimately implement raw `<button>`, `<input>`, etc. The `files:` glob is what enforces this — don't expand it to the library directory.

When you add a new exemption, write down the condition under which it gets removed. A comment that says "TODO: remove when we migrate /foo" is fine; an undocumented `ignores:` entry rots into permanent technical debt.

## Category 4 — Don't ignore the official `recommended` configs

Before writing custom rules, turn on the framework's own recommended ESLint config (`js.configs.recommended`, `svelte.configs['flat/recommended']`, the React/Vue equivalents). They catch generic mistakes (unused vars, accessibility issues, framework anti-patterns) that the design-system rules don't.

Repo-wide noise that doesn't apply to your project — e.g. `no-unused-vars` when TypeScript already handles it — gets turned **off** explicitly with a comment, not by skipping the recommended config wholesale.

## Category 5 — Wire it to the Stop hook (Claude Code only)

Claude Code's `Stop` hook can re-run lint on files the agent edited and surface violations as additional context for the next turn. This closes the loop: the agent writes a raw `<button>`, the Stop hook fires ESLint, the error comes back, and the agent fixes it before the user sees the diff. Configure in `.claude/settings.json`:

```json
{
    "hooks": {
        "Stop": [
            { "command": "bun run lint:changed", "matcher": ".*" }
        ]
    }
}
```

(Adjust the command to whatever script lints just the files in the current diff.)

## Definition-of-done for the lint gate

- [ ] `eslint.config.js` in flat-config form, with the framework's `recommended` config enabled.
- [ ] Element restrictions in route paths via the built-in `no-restricted-html-elements` (or equivalent) — every banned element has a message naming the alternative primitive.
- [ ] Inline-style ban in route paths (`svelte/no-inline-styles` or equivalent).
- [ ] In-repo plugin at `eslint-rules/{project}-design-system.js` with at minimum `no-bare-input` and `no-css-literals`.
- [ ] CSS-literal rule exempts `0px`/`0ms`/`1px` and strips comments before matching.
- [ ] Every exempted path under `ignores:` has a comment explaining why.
- [ ] Your project's check command runs ESLint as part of the suite.
- [ ] The design-system skill tells the agent "don't disable rules — fix the code."
- [ ] (Optional) Stop hook re-runs lint on changed files.

## Style rules for the rules themselves

- **Every rule has a one-paragraph header comment** in the plugin file explaining what it catches and why the stock rules can't.
- **Error messages name the fix, not just the violation.** "Use `<Button>`" beats "no raw button."
- **Don't add a rule for a mistake you haven't actually seen.** Each rule pays a cost in noise, false positives, and onboarding friction. Write the rule when you've corrected the same mistake twice.
- **A rule that fires once a month doesn't earn its keep** — it'll get autocompleted-away with `// eslint-disable-next-line` and never re-examined. Either delete it or make sure the message is so good that the disable comment never gets written.
- **`eslint-disable` comments are a smell.** When one appears in a PR, the right move is usually to fix the code or fix the rule — not merge the disable. The design-system skill should say this explicitly.
