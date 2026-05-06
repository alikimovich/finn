// finn ESLint config
//
// The rules here enforce the design system *at the call site*. They flag
// the most common ways an agent (or a tired human) bypasses the system:
// raw HTML controls in routes, inline styles to compensate for missing
// variants, hex/rgba/px literals in CSS.
//
// If a rule fires, do not disable it — fix the code. See CLAUDE.md.

import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import finnDesignSystem from './eslint-rules/finn-design-system.js';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],

	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'node_modules/**',
			'_experiment/**',
			'static/**',
			'storybook-static/**',
			'.storybook/**',
		],
	},

	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parser: tsParser,
			parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
		},
		// Repo-wide noise off — TS handles unused vars, navigation rules and
		// mustache cosmetics aren't in scope for the design-system gate.
		rules: {
			'no-unused-vars': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-useless-mustaches': 'off',
		},
	},

	{
		// `.ts` is not in ESLint's default file set under flat config, so we
		// opt it in explicitly — otherwise standalone `.ts` files (like the
		// per-component `index.ts` re-exports) trip "File ignored because no
		// matching configuration was supplied."
		files: ['**/*.ts'],
	},

	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte'],
			},
		},
	},

	// ------------------------------------------------------------------
	// finn design-system rules: routes must use primitives, not raw HTML.
	//
	// Exempt:
	// - src/lib/components/**: primitives implement raw elements.
	// - src/routes/design/**: dev gallery, intentionally demos raw HTML.
	// - src/routes/convert/**, src/routes/contacts/**: pre-existing
	//   routes that predate these rules. Diffs vs `bare` should be doc-
	//   layer-only, not source rewrites.
	// ------------------------------------------------------------------
	{
		files: ['src/routes/**/*.svelte'],
		ignores: [
			'src/routes/design/**',
			'src/routes/convert/**',
			'src/routes/contacts/**',
		],
		plugins: {
			finn: finnDesignSystem,
		},
		rules: {
			'svelte/no-restricted-html-elements': [
				'error',
				{
					elements: ['button'],
					message:
						'Use <Button> from $lib/components (or <IconButton> for icon-only).',
				},
				{
					elements: ['select'],
					message:
						'No raw <select>. For currency, use <CurrencyPicker>. For other choices, talk to the design system before adding a new control.',
				},
				{
					elements: ['svg'],
					message:
						'No raw <svg> in routes. Use <Icon name="…" /> — add new glyphs to Icon.svelte.',
				},
				{
					elements: ['dialog'],
					message: 'Use <Dialog> from $lib/components.',
				},
				{
					elements: ['ul', 'ol'],
					message:
						'Use <List> + <ListRow> for vertical lists of rows.',
				},
			],
			// Inline style attributes in routes are a smell — primitives expose
			// variants; raw layout CSS should be Stack/Cluster.
			'svelte/no-inline-styles': [
				'error',
				{ allowTransitions: true },
			],
			// Bare <input>/<textarea> must live inside a <Field> (or <SearchField>).
			'finn/no-bare-input': 'error',
			// Hex/rgba/px/ms literals in <style> blocks — tokens only.
			'finn/no-css-literals': 'error',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
		},
	},
];
