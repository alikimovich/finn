# How to write an agent guide that supports your design system

The tokens, the components, the ESLint rules, and the design-system skill are the *machinery*. The agent guide — `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, or whatever your tools read at the start of every session — is the *map* that tells an agent the machinery exists and how the pieces fit together. Without it, an agent opens your repo, finds a primitive folder, sees a tokens file, sees an ESLint config, and still has to reverse-engineer the contract between them. With it, the agent reads three screens of text and starts producing the right code immediately.

This prompt assumes you've already done the previous four steps: tokens exist, components exist with docs, ESLint rules enforce both, and the design-system skill encodes the recipes. The agent guide is what *introduces* all of that to a fresh agent.

## 1. Where the file lives

Pick one canonical location and stick with it. Common choices:

- **`CLAUDE.md`** at the repo root — loaded automatically by Claude Code.
- **`AGENTS.md`** at the repo root — the cross-tool convention many coding agents now read.
- **`.cursor/rules/*.mdc`** — Cursor's per-rule format.
- **`docs/AGENTS.md`** plus a one-line pointer from the root.

If your team uses multiple tools, write the content once and either symlink or keep a short root file that points at the canonical one. The contents of *that* file are what this prompt is about — name and location are interchangeable.

## 2. What the agent guide is for, and what it is *not* for

The guide is **the map and the contract**. It points at the component inventory, the token sources, the workflow command, and the lint gate. It states the rules an agent must follow before authoring UI.

It is **not** a tutorial, an architecture document, or a changelog. Long history sections, design-decision rationales, and migration notes belong in `docs/` or in commit messages — they rot in the agent guide because they're not actionable per-task.

A useful test: every section answers a question an agent has *while writing code right now*. "What primitive do I reach for?" yes. "Why did we switch from styled-components in 2023?" no.

## 3. The seven sections, in this order

The order matters. An agent reads top-down and stops when it has enough to proceed; put the load-bearing information first.

### Section 1 — Project shape (≤10 lines)

The stack, the framework, the package manager, the routes. One line each, no prose:

```markdown
- **Stack:** {framework} + {language} + {bundler}, plain CSS with design tokens. No Tailwind, no CSS-in-JS.
- **Routes:** `/foo`, `/bar`, `/baz`.
- **Layout:** every route renders inside `+layout.{ext}` with…
```

Skip generic things ("we use Git"). Include anything an agent would otherwise have to grep for ("runes mode is forced", "TypeScript strict mode is on", "no JS runtime is allowed in route loaders").

### Section 2 — The two rules

Two bullets, *exactly* two, that an agent must internalize before writing CSS or JSX/Svelte:

1. **No magic values.** Never write a `px`, hex, `rgba()`, duration, or radius literal in component or route CSS. Every value comes from a token. If the right token doesn't exist, add one first, document it, then use it.
2. **Prefer composition over ad-hoc CSS.** If you'd write `display: flex; flex-direction: column; gap: var(--space-N)`, use the project Stack primitive instead. Drop to raw CSS only when a primitive can't express the layout.

These two rules are what every downstream lint rule and recipe enforces. Stating them up front in the guide means the rest of the file is *consequences* of these rules, not separate ideas. Followed by a one-line pointer at the design-system skill for the long form ("recipes and anti-patterns live in `.claude/skills/design-system/SKILL.md`").

### Section 3 — Component inventory

A table of every reusable primitive: **Name** | **Use when**. One row per component, one line per row. The "use when" column is in natural language ("vertical column of items with a tokenized gap"), not in API terms.

Group the inventory by category — layout primitives first, then form controls, then containers, then bits — so an agent skimming the table finds what it needs by category. Don't sort alphabetically; agents pattern-match on category.

Where there's a *common wrong choice*, add a one-line warning in the row. The warnings are where the inventory earns its keep:

```markdown
| `Field` | Every form row with a single bordered control. **Don't put `<Input size="xl">` inside it** — Field's CSS clobbers the variant. Use `AmountField`. |
```

Show the canonical import path too. One line, near the top of the section:

```markdown
import { Button, Card, Stack, Field } from '$lib/components';
```

If you have a barrel/index file, that's the only path that should appear; the per-folder import is a smell.

### Section 4 — Tokens

A short paragraph stating that tokens live in your global stylesheet, your human-readable reference, and the visual reference (if any). Name the categories — color, radius, space, sizing, typography, shadow, motion, z-index — without duplicating values. **Values rot. Names don't.**

End with a one-liner about anything optical that an agent gets wrong by default. ("Pair `font-variant-numeric: tabular-nums` on the leaf element rendering amounts and rates so columns align.")

### Section 5 — Workflow

A five-step numbered list the agent should follow when authoring or editing UI:

```markdown
1. Read this file for the inventory and import path.
2. Invoke the design-system skill (or read its SKILL.md) for recipes and anti-patterns.
3. Read the component's source/docs before using it.
4. Run the check command before considering work done.
5. Fix lint violations — don't disable rules.
```

State the exact check command (`pnpm check`, `bun run check`, `cargo check`, whatever it is). The Stop hook re-running lint on edited files is worth mentioning if you have one configured.

### Section 6 — Adding a new component

A numbered checklist. Each step is a verb + an object:

```markdown
1. Create `src/lib/components/{Name}/` with `{Name}.{ext}`, `index.ts`.
2. Add to the barrel.
3. Add a top-of-file documentation block (description + example).
4. Add per-prop JSDoc/TSDoc on the Props interface.
5. Update this file's component inventory.
```

Keep it to ≤6 steps. If you have more, you're conflating the "make a primitive" workflow with the "polish a primitive" workflow — split them.

### Section 7 — Adding a new token

Same structure: numbered, verb-first:

```markdown
1. Add to `:root` in your global stylesheet, in the appropriate group.
2. Add a row to your token reference (name, value, intended use).
3. Replace any matching literal across components and routes.
```

If updating a token's *value* could ripple visually, say so in one line ("a `--color-accent` change ripples everywhere; verify the new value still reads correctly on `--color-text-on-accent` before merging").

## 4. Style rules for the file itself

- **Tables over prose** for inventories. A component row is faster to scan than a paragraph describing it.
- **Imperatives over descriptions.** "Use the project Stack primitive for vertical layout." beats "Stack is the primitive used for vertical layout."
- **One source of truth per fact.** The inventory lists every primitive *once*. Token names live in the token reference, not duplicated here. Recipes live in the design-system skill, not duplicated here. The guide *points at* sources; it doesn't re-host them.
- **No code dumps.** A 30-line snippet in the guide means it'll go stale. If you need a snippet that long, put it in the design-system skill (which has anchored triggers and gets reloaded fresh per task) or in a real `.example.{ext}` file the agent can read.
- **No history, no rationale.** "We chose X over Y because Z" doesn't help an agent author code today. If the rationale matters, it lives in the commit that made the change.
- **No marketing.** "Our beautiful design system" is wasted tokens. State the rules and stop.
- **Aim for ≤200 lines.** Past 200, agents skim and miss things. If you're over, the inventory is the most compressible — convert paragraphs to table rows.

## 5. Anti-patterns specific to the agent guide

1. **Duplicating the token reference inline.** "Here are all 47 tokens with their values…" — this rots the moment the stylesheet changes. Name the categories, point at the file.
2. **Repeating the design-system skill's anti-patterns.** Tempting because they're useful. Don't — the skill loads on demand with full context; duplicating them in the guide means two places to keep in sync.
3. **A "Component API" section.** That's what per-component documentation is for. The guide lists *names* and *when to use*; the source file lists *props*.
4. **Stale routes.** When you add `/checkout`, update Section 1. When you delete `/legacy`, remove it. A guide that mentions routes that no longer exist tells an agent the guide is unreliable, and once that trust is gone, the agent stops reading it.
5. **TODO sections.** "TODO: write the workflow part" stays unfinished forever. Either write the section now or delete the heading.
6. **Inconsistent terminology.** If the inventory says "the Button primitive" and the workflow says "the button component" and the recipes say "Button.svelte", the agent has to disambiguate three terms. Pick one and use it everywhere.
7. **A wall of warnings.** "DO NOT do X. NEVER do Y. ALWAYS do Z." reads as nagging. Two unambiguous rules (Section 2) plus inventory-row warnings is enough; if you find yourself adding a fourth `NEVER`, it's probably an anti-pattern that belongs in the design-system skill.

## 6. Keeping it current

The agent guide is the file most likely to rot, because it's *meta* — it describes the rest of the project, so any change downstream can invalidate it. Three habits keep it alive:

- **Treat the guide as part of every PR that touches UI.** If you add a primitive, the same PR adds the inventory row. If you rename a token category, the same PR updates Section 4. Reviewers should flag UI PRs that don't touch the guide as suspect.
- **Re-read the guide once a quarter as if you were a new agent.** Ask: does Section 1 still describe the stack? Are all the listed routes real? Do the listed primitives still exist with those names? Anything broken means a stale fact has been live for weeks.
- **When an agent gets something wrong twice, ask "where in the guide would I have learned the right thing?"** If the answer is "nowhere", add one line. If the answer is "Section 3 says it but the agent didn't see it", restructure so the next agent can't miss it.

## 7. Cross-references — how this ties the previous four steps together

- **Tokens (Step 1):** The guide's Section 4 names the categories and points at the two token sources. It does not list values.
- **Components (Step 2):** The guide's Section 3 lists the inventory. The detailed per-component documentation lives in the source files; the guide is the index.
- **ESLint (Step 3):** The guide's Section 5 names the check command and tells the agent "fix violations, don't disable rules". The actual rule definitions live in `eslint.config.js` and the in-repo plugin.
- **Design-system skill (Step 4):** The guide's Section 2 ends with a pointer at the skill for recipes and anti-patterns. The skill is where deep-dive content lives; the guide is the on-ramp.

## 8. Definition-of-done

- [ ] The guide exists at a canonical, agent-readable path (`CLAUDE.md`, `AGENTS.md`, or equivalent).
- [ ] Section 1 describes the stack in ≤10 lines, with no prose or rationale.
- [ ] Section 2 states exactly two rules — no magic values, prefer composition — followed by a one-line pointer at the design-system skill.
- [ ] Section 3 is a table of every reusable primitive with a "use when" column, grouped by category, with inline warnings on the common-wrong-choice rows.
- [ ] Section 3 includes the canonical import path on one line.
- [ ] Section 4 names the token categories and points at the token sources without duplicating values.
- [ ] Section 5 lists the workflow as a numbered list with the exact check command.
- [ ] Section 6 lists "how to add a new component" in ≤6 steps.
- [ ] Section 7 lists "how to add a new token" in ≤4 steps.
- [ ] No token values, no full component code dumps, no API tables, no history, no TODO headings.
- [ ] Total length ≤200 lines.
- [ ] The guide is referenced from the design-system skill's Step 1.
- [ ] At least one team-wide habit is in place to keep the guide current (PR-as-part-of-UI-change, quarterly review, or equivalent).
