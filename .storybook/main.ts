import { readFile } from 'node:fs/promises';
import type { StorybookConfig } from '@storybook/sveltekit';
import type { PluginOption } from 'vite';

// Storybook 10's `@storybook/svelte-vite` docgen plugin extracts per-prop
// JSDoc into `Component.__docgen.data` but does NOT extract the
// `<!-- @component ... -->` block into `Component.__docgen.description`
// (a regression vs. the older sveltedoc-parser-based version). Without the
// description field, autodocs renders an empty heading on every Docs tab.
//
// This plugin runs after the docgen plugin and backfills `description`
// by reading the raw `.svelte` source from disk and parsing the
// `<!-- @component -->` block. Storybook's `extractComponentDescription`
// (in `@storybook/svelte`) reads exactly this field.
// Dedent: find the smallest leading-whitespace prefix across non-blank
// lines and strip it from every line. The `<!-- @component -->` block is
// usually tab-indented to match the surrounding source; if we don't dedent
// before handing the string to Storybook, Markdown treats those tab
// prefixes as code-block markers and the description renders as `<pre>`.
function dedent(text: string): string {
	const lines = text.split('\n');
	const indents: number[] = [];
	for (const l of lines) {
		if (l.trim().length === 0) continue;
		const m = l.match(/^[ \t]*/);
		indents.push(m ? m[0].length : 0);
	}
	if (indents.length === 0) return text;
	const minIndent = Math.min(...indents);
	if (minIndent === 0) return text;
	return lines.map((l) => l.slice(minIndent)).join('\n');
}

function svelteComponentDescriptionPlugin(): PluginOption {
	// Match `@component` followed by end-of-line, then capture everything
	// up to `-->`. The trailing `\r?\n` (instead of `\s*`) is critical: a
	// greedy `\s*` would eat both the newline AND the leading tab of the
	// first content line, leaving line 1 at column 0 while the rest sit
	// at column 1 — `dedent()` would then see `min=0` and strip nothing,
	// and Markdown would render the indented body as a `<pre>` block.
	const COMPONENT_RE = /<!--[ \t\r\n]*@component[ \t]*\r?\n([\s\S]*?)-->/;
	return {
		name: 'finn:svelte-component-description',
		enforce: 'post',
		async transform(code, id) {
			const cleanId = id.split('?')[0];
			if (!cleanId.endsWith('.svelte')) return;
			// Only run on files the docgen plugin already processed —
			// otherwise we have nothing to amend.
			if (!/(\w+)\.__docgen\s*=/.test(code)) return;

			const raw = await readFile(cleanId, 'utf8');
			const match = raw.match(COMPONENT_RE);
			if (!match) return;
			const description = dedent(match[1]).trim();
			if (!description) return;

			const nameMatch = code.match(/(\w+)\.__docgen\s*=/);
			if (!nameMatch) return;
			const componentName = nameMatch[1];

			return {
				code:
					code +
					`\n;${componentName}.__docgen.description = ${JSON.stringify(description)};\n`,
				map: null
			};
		}
	};
}

const config: StorybookConfig = {
	// Stories live next to the component they document — no separate stories
	// folder. We also pick up any *.mdx docs pages (e.g. tokens reference)
	// alongside the component files.
	stories: [
		'../src/lib/components/**/*.stories.@(ts|svelte)',
		'../src/lib/docs/**/*.mdx'
	],

	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs'],

	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},

	docs: {
		// Generate an autodocs page for every component story by default.
		// Autodocs reads the <!-- @component --> block on each .svelte file
		// for the description (via the Vite plugin below), and per-prop
		// JSDoc on the `Props` interface for the args table.
		defaultName: 'Docs'
	},

	typescript: {
		// Use the Svelte language service to extract per-prop JSDoc into
		// the args table.
		check: false
	},

	viteFinal: async (config) => {
		config.plugins ??= [];
		config.plugins.push(svelteComponentDescriptionPlugin());
		return config;
	}
};

export default config;
