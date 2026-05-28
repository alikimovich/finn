# How to write a `design-system` skill for your project

Your project's agent guide tells an agent *what exists*. A design-system skill tells it *how to use what exists* — the recipes, the anti-patterns, and the judgment calls that aren't obvious from a component inventory. Without it, an agent walks into your repo, scans the inventory, and still writes a custom `.row` class because it doesn't know that's the thing you're trying to prevent.

The skill is a single Markdown file at `.claude/skills/design-system/SKILL.md`. Claude loads it on demand when the trigger description matches the task. Your job is to make the triggers fire often and the body short enough to actually be read.

## 1. The frontmatter — make it trigger reliably

```yaml
---
name: design-system
description: Use this skill BEFORE writing or editing any UI in {project} —
  building a screen, page, route, form, dialog, list, button, or component.
  It gives you the component inventory pointer, composition recipes,
  anti-patterns to avoid, and the rules for translating a Figma design or
  rough sketch into the right primitives. Triggers on phrases like "build a
  screen", "add a page", "make a form", "create a route", "design",
  "component", "figma", "sketch", "wireframe", "mockup", any figma.com URL,
  any image/jpg/png input describing a UI, or any task involving
  `.svelte`/`.tsx`/`.vue` files under `src/routes/` or `src/lib/components/`.
---
```

Rules of thumb for the description:
- **Start with "Use this skill BEFORE…"** — that single word reliably gets the skill loaded ahead of authoring, not after.
- **Enumerate verb phrases**, not just nouns: `"build a screen"`, `"make a form"`. Agents pattern-match on those.
- **Include domain-specific route names** for your app (`"send screen"`, `"contacts"`, `"checkout"`) so the skill fires on natural task descriptions.
- **Name the file types** an agent edits to build UI (`.svelte`, `.tsx`, `.vue`) and the directories they live under. This catches "edit `src/routes/foo/+page.svelte`"-style tasks even when the prompt is bare.
- **Mention image/Figma inputs** so the skill fires on screenshots and `figma.com` URLs.

## 2. The body — six sections, in this order

### Step 1 — Read the inventory

One short paragraph pointing at your project's component inventory — wherever it lives (a top-level agent guide, a `docs/components.md`, the components folder's README). The skill doesn't duplicate the inventory; it tells the agent to consult it and stops.

### Step 2 — Decision tree: task → primitive

A bullet list mapping natural-language task descriptions to the right primitive. This is the most-used section of the whole file. Keep each line tight: `"thing the user wants to build" → <Primitive>`.

```markdown
- "Vertical column of fields / sections / items"  →  the project Stack primitive
- "Horizontal row of things with a gap"           →  the project Cluster primitive
- "Form row with a label + bordered control"      →  the project Field primitive (don't wrap `<input>` in your own `<label>`)
- "A button"                                      →  the project Button primitive (never raw `<button>`)
- "An icon"                                       →  the project Icon primitive (never raw `<svg>` in a route)
- "A modal / popup"                               →  the project Dialog primitive
- "Empty state / no results"                      →  the project EmptyState primitive
```

Use the real primitive names from your codebase, not these placeholders. Add the *negative* in parentheses where there's a common wrong instinct (`"never raw <button>"`). Those parentheticals are where the skill earns its keep.

### Step 3 — Read the component docs

Two sentences pointing at wherever the per-component documentation lives — top-of-file doc blocks, per-prop JSDoc/TSDoc, or a dedicated docs folder. Tell the agent to open the source before using a primitive it hasn't used before.

### Step 4 — Run the checks

Tell the agent the exact command (`npm run check`, `pnpm test`, `cargo check`, whatever it is) and what the linter blocks (raw controls, inline styles, hex/px literals). Tell them to *fix* violations, not disable rules.

### Step 5 — Anti-patterns

A numbered list. Each item is one mistake you've seen an agent (or a human) make repeatedly, followed by the right thing to do. Keep these specific and concrete — generic advice ("use the design system") doesn't stick.

```markdown
1. **Raw `<button>` / `<input>` / `<svg>` in a route.** Use the primitive.
2. **Inventing a primitive.** "Let me write a custom `.row` class…" — stop. Use the project list/row primitives.
3. **Custom `<label>` wrapper around a control.** Use the project's field primitive — it *is* the label.
4. **Inline style overrides on a primitive.** Smell — the primitive is missing a variant. Add the variant; don't override.
5. **Hardcoded `12px`, `#fff`, `200ms`** in CSS. Use the token (`var(--space-3)`, `var(--color-text-muted)`, `var(--dur-3)`).
6. **Project-specific composition pitfall.** Each design system accumulates "don't do X inside Y" rules as primitives are added — write each one down the moment you fix it the second time.
```

The single best signal for what belongs here: **what mistake did you have to correct in the last five PRs?** That's an anti-pattern. Write it down so you don't correct it a sixth time.

### Step 6 — Composition recipes

Three to six concrete code snippets for the most common compositions in your app. Not exhaustive — just the patterns an agent will reach for repeatedly:

- A form row inside a dialog or card
- A page with a list (header + empty state + list rows)
- An action bar (`Cluster justify="between"`) with an inline meta line
- A form inside a Dialog
- Anything else your app uses 3+ times

Each recipe is real, copy-paste-able code with the actual primitives. Annotate any non-obvious choice in one line below the snippet (e.g. "`<input>` inside the field primitive is styled automatically; don't wrap in your own `<label>`").

## 3. Two specialized sections: Figma and rough sketches

These deserve their own subsections because they govern **how to translate a non-code spec into primitives**, which is where agents most often go off the rails.

### When implementing from Figma

Fidelity to the source *is* the goal. Numbered list of failure modes you've actually hit. Cover at minimum:

- **Map named type styles directly to primitives** — `"Section label" → the section-label primitive`, `"Field label" → the field primitive`. Don't recompute from raw px values; Figma's named styles *are* the mapping.
- **Read the row before composing** — two elements on the same row in Figma → one Cluster (horizontal layout primitive), not two stacked Stack rows. Note when to disable wrapping.
- **Don't relabel copy** — if Figma says "BALANCE", use "BALANCE". Surface to the user; don't silently substitute.
- **Render the visual state Figma shows** — a filled primary button is the primary Button variant even if logic suggests it should be disabled. Wire interactivity separately.
- **Map every literal to a token** — px/hex/em readings from Figma become `var(--space-N)` / `var(--color-…)` / `var(--text-…)`.
- **Reuse a built reference** — point at 1-2 routes that are the established composition patterns for your app. "Open `src/routes/X` before building a similar screen."
- **Recognize existing primitives — don't reimplement them.** Under "match Figma exactly" pressure, agents build parallel div trees instead of using the primitive that already produces the pixels.
- **Build the states Figma doesn't show** — empty, loading, error, disabled, focus, hover. Default to existing patterns.
- **Don't ship Figma asset URLs** — MCP asset URLs expire. Replace with project icon glyphs or files served from your static assets directory.

### When implementing from a rough sketch

This is the **opposite philosophy** — fidelity to *intent*, not pixels. Worth stating explicitly so the agent doesn't apply Figma rules to a napkin photo. Cover:

- **Read for intent, not pixels.** Squiggles and uneven spacing are noise; labels and ordering are signal.
- **Don't replicate sketch artifacts as UI.** Arrows between regions mean *those things connect*, not "draw an arrow on the page."
- **Fill in everything the sketch omits.** Empty/loading/error states, validation, focus rings — default to project patterns.
- **Make composition decisions when ambiguous.** The sketch can't dictate horizontal vs vertical; you decide based on what reads well.
- **Improve obviously-broken bits.** Send button before amount field? Fix it. Surface non-trivial deviations in the summary.
- **Use proper copy, not sketch shorthand.** "TO" / "AMT" / "$" are space-saving; write "Recipient" / "Amount".
- **When in doubt between two reasonable interpretations, pick one and ship it.** Don't stop on every ambiguity; reserve questions for genuinely load-bearing decisions.

## 4. Style rules for the skill file itself

- **Imperatives over prose.** "Use the Stack primitive." beats "Stack should be used when…"
- **Concrete > abstract.** Every anti-pattern should reference a real primitive name or a real wrong line of code, not a vague principle.
- **Show the wrong thing next to the right thing.** "❌ `<button>` → ✅ `<Button>`" is faster to read than two paragraphs.
- **Cite real files.** When you mention "the established pattern", point at a real file path (e.g. `src/routes/example/+page.tsx`) so the agent can open it. Skill files that hand-wave at "the existing patterns" don't get followed; ones with file paths do.
- **No duplication with your project's agent guide.** The inventory and philosophy live there. The skill is *recipes and warnings*.
- **Aim for ~250 lines.** If it's longer, you're explaining the inventory again, or your recipes are too verbose, or you've turned a one-line anti-pattern into a paragraph.
- **Let it grow with your scars.** Every time you correct an agent on a UI task, ask: "is this anti-pattern or recipe missing from the skill?" If yes, add a numbered item before closing the loop. The skill compounds; a static one rots.

## 5. Definition-of-done for the skill

- [ ] Frontmatter `name` matches the folder (`.claude/skills/design-system/SKILL.md` → `name: design-system`).
- [ ] Description starts with "Use this skill BEFORE…" and enumerates verb phrases + file globs.
- [ ] Step 1 points at your project's component inventory rather than duplicating it.
- [ ] Step 2 has a decision tree of at least 8 "task → primitive" lines.
- [ ] Anti-patterns section has ≥6 numbered items, each citing a real primitive.
- [ ] Composition recipes section has ≥3 copy-paste-able snippets.
- [ ] Figma section and Sketch section exist, with opposite philosophies stated explicitly.
- [ ] At least two real route file paths cited as reference compositions.
