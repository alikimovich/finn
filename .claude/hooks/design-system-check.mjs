#!/usr/bin/env node
// Stop hook — when Claude finishes a turn, re-check the Svelte files it
// touched against the design-system rules. If ESLint reports problems on
// those files we return `decision: "block"` with the violations as the
// reason, which causes Claude to keep working until they're resolved.
//
// We only check files that ESLint actually has rules for (Svelte under
// src/), and we limit the run to files Claude edited in this session
// (extracted from the transcript). If we can't determine what changed, we
// pass through silently rather than running ESLint on the whole repo.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';

let payload;
try {
	payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
	process.exit(0);
}

// Avoid infinite loops: if we already blocked once on this turn, don't
// block again. Stop hooks are re-invoked after Claude continues, and we
// trust the user / Claude to converge.
if (payload.stop_hook_active) process.exit(0);

const projectDir = payload.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const transcriptPath = payload.transcript_path;

if (!transcriptPath || !existsSync(transcriptPath)) process.exit(0);

// Walk the transcript JSONL and collect file paths that Edit/Write/MultiEdit
// touched. Filter to .svelte files inside this project's src/.
const edited = new Set();
try {
	const lines = readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
	for (const line of lines) {
		let entry;
		try {
			entry = JSON.parse(line);
		} catch {
			continue;
		}
		const content = entry?.message?.content;
		if (!Array.isArray(content)) continue;
		for (const block of content) {
			if (block?.type !== 'tool_use') continue;
			const name = block.name;
			if (!['Edit', 'Write', 'MultiEdit'].includes(name)) continue;
			const fp = block?.input?.file_path;
			if (typeof fp !== 'string') continue;
			if (!fp.endsWith('.svelte')) continue;
			const abs = resolve(projectDir, fp);
			if (!abs.startsWith(projectDir)) continue;
			if (!abs.includes(`${projectDir}/src/`)) continue;
			if (!existsSync(abs)) continue;
			edited.add(abs);
		}
	}
} catch {
	process.exit(0);
}

if (edited.size === 0) process.exit(0);

// Locate the project's eslint binary.
const eslintBin = join(projectDir, 'node_modules', '.bin', 'eslint');
if (!existsSync(eslintBin)) process.exit(0);

const result = spawnSync(
	eslintBin,
	['--format=json', '--no-warn-ignored', ...edited],
	{ cwd: projectDir, encoding: 'utf8' }
);

// ESLint exits 1 on lint errors, 2 on its own crash. Treat 2 as no-op.
if (result.status !== 0 && result.status !== 1) process.exit(0);

let report;
try {
	report = JSON.parse(result.stdout || '[]');
} catch {
	process.exit(0);
}

const violations = [];
for (const fileReport of report) {
	if (!fileReport.messages?.length) continue;
	const errors = fileReport.messages.filter((m) => m.severity === 2);
	if (errors.length === 0) continue;
	const rel = fileReport.filePath.replace(`${projectDir}/`, '');
	for (const e of errors) {
		violations.push(`  ${rel}:${e.line}:${e.column} — ${e.message} (${e.ruleId || 'parse-error'})`);
	}
}

if (violations.length === 0) process.exit(0);

const reason = `Design-system check failed for files you edited.

ESLint flagged ${violations.length} violation(s):

${violations.join('\n')}

These rules enforce the finn design system at the call site. Fix them by
swapping raw HTML for the matching primitive (see CLAUDE.md and the
design-system skill). Don't disable the rules — fix the code.`;

process.stdout.write(
	JSON.stringify({
		decision: 'block',
		reason
	})
);
