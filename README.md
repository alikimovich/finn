# finn — bare arm

This is a **mock SvelteKit money app used as a testbed for design-system
documentation experiments**. It is not a shipping product. The repo
exists to measure how AI coding agents behave when building features
under different documentation regimes.

## The two arms

This branch (`bare`) and `loaded` carry the same source code. The
difference is the documentation layered on top of it:

- **`bare`** (this branch) — no AI-targeted documentation. No
  `CLAUDE.md`, no JSDoc on components, no `.claude/` skill, no custom
  ESLint rules, no hooks. Plain code. The control arm.
- **`loaded`** — same code, with the full doc stack: a `CLAUDE.md` at
  the repo root that auto-loads for every Claude Code session, JSDoc on
  every component and every prop, a `.claude/skills/design-system/`
  skill, a Stop hook that runs a design-system lint after each agent
  turn, and custom ESLint rules that flag raw HTML controls / inline
  styles / hardcoded tokens.

The experiment branches (`bare-r1`, `loaded-r1`, `loaded-full-r2`, etc.)
build on these two — each round forks fresh worktrees off the relevant
arm.

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

## Type-check / build

```sh
bun run check
bun run build
```
