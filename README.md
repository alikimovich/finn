# finn — loaded arm

This is a **mock SvelteKit money app used as a testbed for design-system
documentation experiments**. It is not a shipping product. The repo
exists to measure how AI coding agents behave when building features
under different documentation regimes.

## The two arms

This branch (`loaded`) and `bare` carry the same source code. The
difference is the documentation layered on top of it:

- **`bare`** — no AI-targeted documentation. No `CLAUDE.md`, no JSDoc,
  no `.claude/` skill, no custom ESLint rules, no hooks. Plain code.
  The control arm.
- **`loaded`** (this branch) — the same code, with the full doc stack:
  - `CLAUDE.md` at the repo root, auto-loaded for every Claude Code
    session in this directory.
  - JSDoc on every component and every prop in `src/lib/components/`.
  - `.claude/skills/design-system/SKILL.md` — a skill that gates on UI
    tasks and describes the component inventory, composition rules,
    Figma/sketch translation rules, and anti-patterns.
  - `.claude/hooks/design-system-check.mjs` — a Stop hook that re-runs
    a design-system lint over the files Claude edited.
  - `eslint.config.js` + `eslint-rules/finn-design-system.js` — custom
    ESLint rules that flag raw HTML controls in routes, inline `style`
    attributes on primitives, and hardcoded px/hex/rgba/ms literals in
    route CSS.
  - Storybook (`.storybook/`) for component-level visual inspection.

The experiment branches (`bare-r1`, `loaded-r1`, `loaded-full-r2`, etc.)
build on these two — each round forks fresh worktrees off the relevant
arm and layers additional infrastructure on top of `loaded`.

## What the experiments measure

- Whether agents reach for design-system primitives or fall back to raw
  HTML and inline CSS when building screens.
- Whether the doc layer slows regression as the codebase grows across
  multiple sequential commits.
- Whether agents can be made to surface gaps in the design system as
  structured proposals that the maintainer can triage.

## Reports

The headline writeup is on disk at
`~/Documents/finn-experiments/00-self-propagating-design-system.html` —
the cross-round synthesis. Round-by-round reports (round 0 through
round 4) sit in the same folder. Each is a self-contained HTML file
with embedded screenshots; open in any browser.

## The app itself

SvelteKit + Svelte 5 + TypeScript, built with `bun`. `/convert` is a
working currency conversion screen using ECB rates via
[Frankfurter](https://frankfurter.dev). `/contacts` is a working
contacts list. Other routes are placeholders that experiments fill in.

## Develop

```sh
bun install
bun run dev
```

Open http://localhost:5173 — `/` redirects to `/convert`.

## Type-check / build / Storybook

```sh
bun run check
bun run build
bun run storybook
```
