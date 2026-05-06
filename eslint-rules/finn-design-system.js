// finn — in-repo ESLint plugin
//
// Two rules covering finn's design-system invariants that the stock
// `svelte/no-restricted-html-elements` and `svelte/no-inline-styles`
// rules can't express:
//
// - `no-bare-input` — bare `<input>` / `<textarea>` in routes must live
//   inside a `<Field>` (or `<SearchField>`), since `<Field>` is the
//   project's canonical labelled-form-row primitive. Hidden inputs are
//   exempt.
// - `no-css-literals` — hex colours, `rgb()`/`rgba()`, `Npx`, and `Nms`
//   inside route `<style>` blocks. Tokens only — see `src/lib/tokens.md`
//   for the full reference.
//
// Both rules are scoped to route files via `eslint.config.js`. Primitives
// inside `src/lib/components/**` are exempt because they implement the
// visual layer.

const FIELD_COMPONENT_NAMES = new Set(['Field', 'SearchField']);

/** Walk parent chain looking for a `<Field>` or `<SearchField>` ancestor. */
function hasFieldAncestor(node) {
	let p = node.parent;
	while (p) {
		if (p.type === 'SvelteElement' && p.kind === 'component') {
			const name = p.name;
			if (name?.type === 'Identifier' && FIELD_COMPONENT_NAMES.has(name.name)) {
				return true;
			}
		}
		p = p.parent;
	}
	return false;
}

/** Returns true if the input has `type="hidden"`. */
function isHiddenInput(node) {
	for (const attr of node.startTag?.attributes ?? []) {
		if (attr.type !== 'SvelteAttribute') continue;
		if (attr.key?.name !== 'type') continue;
		const valueNode = attr.value?.[0];
		if (!valueNode) continue;
		if (valueNode.type === 'SvelteLiteral' && valueNode.value === 'hidden') {
			return true;
		}
	}
	return false;
}

const noBareInput = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Bare <input>/<textarea> in routes must be wrapped in <Field>.'
		},
		messages: {
			bareInput:
				'Wrap <{{name}}> in <Field label="…"> instead of using a bare element. <Field> is the canonical labelled form row in finn.'
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
				context.report({
					node: node.startTag,
					messageId: 'bareInput',
					data: { name: tag }
				});
			}
		};
	}
};

// ---- no-css-literals ------------------------------------------------------

// Strip /* … */ block comments from CSS by replacing with same-length
// whitespace, so offsets are preserved.
function stripComments(css) {
	return css.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
}

// Hex colours (3, 4, 6, or 8 digits).
const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
// rgb()/rgba() function calls.
const RGB_RE = /\brgba?\s*\(/g;
// Px values. `0px` and `1px` are exempt: `0` is meaningless to tokenize and
// `1px` is the universal CSS hairline used in every component border.
const PX_RE = /(?<![a-zA-Z0-9_-])(\d+(?:\.\d+)?)px\b/g;
// Ms values (excluding 0ms).
const MS_RE = /(?<![a-zA-Z0-9_-])(\d+(?:\.\d+)?)ms\b/g;

const noCssLiterals = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'No hex/rgba/px/ms literals in route <style> blocks. Use tokens.'
		},
		messages: {
			hex: 'Hex colour `{{match}}` — use a `var(--color-…)` token from src/app.css instead.',
			rgb: '`{{match}}` literal — use a `var(--color-…)` token from src/app.css instead.',
			px: '`{{match}}` literal — use a token (`var(--space-…)`, `var(--icon-…)`, `var(--control-height-…)`). See src/lib/tokens.md.',
			ms: '`{{match}}` literal — use a `var(--dur-…)` token from src/app.css instead.'
		},
		schema: []
	},
	create(context) {
		return {
			SvelteStyleElement(node) {
				const text = node.children?.[0];
				if (!text || text.type !== 'SvelteText') return;
				const css = stripComments(text.value);
				const baseOffset = text.range[0];
				const sourceCode = context.sourceCode;

				const reportMatch = (re, messageId) => {
					re.lastIndex = 0;
					let m;
					while ((m = re.exec(css)) !== null) {
						const matchText = m[0];
						// `0px`/`0ms` and `1px` are exempt — see PX_RE comment.
						if (messageId === 'px' && /^(?:0+(?:\.0+)?|1)px$/.test(matchText)) {
							continue;
						}
						if (messageId === 'ms' && /^0+(?:\.0+)?ms$/.test(matchText)) {
							continue;
						}
						const start = baseOffset + m.index;
						const end = start + matchText.length;
						context.report({
							loc: {
								start: sourceCode.getLocFromIndex(start),
								end: sourceCode.getLocFromIndex(end)
							},
							messageId,
							data: { match: matchText }
						});
					}
				};

				reportMatch(HEX_RE, 'hex');
				reportMatch(RGB_RE, 'rgb');
				reportMatch(PX_RE, 'px');
				reportMatch(MS_RE, 'ms');
			}
		};
	}
};

export default {
	rules: {
		'no-bare-input': noBareInput,
		'no-css-literals': noCssLiterals
	}
};
