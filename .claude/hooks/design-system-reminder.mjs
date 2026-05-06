#!/usr/bin/env node
// UserPromptSubmit hook — when the prompt looks like a UI task, inject a
// concise reminder of the finn design system so the agent reaches for the
// right primitives on the first try.
//
// We trigger only on UI-task signals; other prompts pass through silently.

import { readFileSync } from 'node:fs'

let payload
try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const prompt = (payload.prompt || '').toLowerCase()

const UI_SIGNALS = [
  'screen', 'page', 'route', 'form', 'dialog', 'modal', 'list',
  'button', 'input', 'field', 'card', 'sidebar', 'header',
  'send', 'convert', 'contacts', 'rates', 'stories',
  'svelte', 'component', 'design',
  'build', 'add', 'create', 'flesh out', 'implement',
  'ui', 'ux',
]

const matched = UI_SIGNALS.some(s => prompt.includes(s))
if (!matched) process.exit(0)

const reminder = `
[design-system reminder]

This is finn. Before writing any UI:

1. Read CLAUDE.md at the repo root for the full component inventory and
   composition recipes. Read .claude/skills/design-system/SKILL.md for
   the decision tree.

2. Use these primitives — never their raw HTML equivalents:
   - <Button> (never <button>), <IconButton> (always with aria-label)
   - <Field> for every form row (never your own <label> wrapper)
   - <Input> with size="xl" for display amounts; bare <input> inside <Field> otherwise
   - <CurrencyPicker> (never <select> for currencies)
   - <Icon> (never <svg> in a route)
   - <Stack> for vertical gap, <Cluster> for horizontal gap (never display:flex+gap CSS)
   - <List> + <ListRow> for any clickable list
   - <Dialog> for modals
   - <EmptyState> for zero-data
   - <PageHeader> opens every route page
   - <Card> for grouped content
   - <Badge>, <Avatar>, <DotSep>, <SectionLabel>, <Sparkline> for the bits

3. Tokens only — no hex, rgba, hardcoded px, or magic numbers in CSS.
   All values come from var(--…) in src/app.css.

4. Open src/lib/components/{Name}.svelte for JSDoc with props + examples
   before composing with a primitive you haven't used.

5. Reference patterns: src/routes/contacts/+page.svelte and
   src/routes/convert/+page.svelte show how the system composes.

ESLint will flag raw <button>/<select>/<svg> in routes and inline styles
on primitives — don't disable rules, fix the code.
`

const out = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: reminder,
  },
}

process.stdout.write(JSON.stringify(out))
