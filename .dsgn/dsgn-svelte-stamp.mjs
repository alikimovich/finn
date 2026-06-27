// Added by dsgn (.dsgn/). A dev-only Svelte markup preprocessor that stamps
// data-dsgn-source="path:line:col" on elements so dsgn can map them to source.
// Add to svelte.config preprocess for development only.
import { parse } from 'svelte/compiler'
import path from 'node:path'

const ELEMENT_TYPES = new Set(['RegularElement', 'Component', 'SvelteComponent'])

function lineCol(code, offset) {
  let line = 1, last = 0
  for (let i = 0; i < offset; i++) if (code[i] === '\n') { line++; last = i + 1 }
  return { line, column: offset - last }
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return
  if (typeof node.type === 'string') visit(node)
  for (const k of Object.keys(node)) {
    const v = node[k]
    if (Array.isArray(v)) v.forEach((c) => walk(c, visit))
    else if (v && typeof v === 'object') walk(v, visit)
  }
}

export default function dsgnStamp() {
  const noop = { name: 'dsgn-stamp', markup: ({ content }) => ({ code: content }) }
  if (process.env.NODE_ENV === 'production') return noop
  return {
    name: 'dsgn-stamp',
    markup({ content, filename }) {
      let ast
      try { ast = parse(content, { modern: true, filename }) } catch { return { code: content } }
      const rel = filename ? path.relative(process.cwd(), filename) : 'unknown'
      const inserts = []
      walk(ast.fragment ?? ast, (n) => {
        if (!ELEMENT_TYPES.has(n.type) || typeof n.start !== 'number' || typeof n.name !== 'string') return
        const attrs = n.attributes || []
        if (attrs.some((a) => a.name === 'data-dsgn-source')) return
        const pos = n.start + 1 + n.name.length
        // Only splice when start points exactly at '<name' — bail on any misaligned
        // offset rather than corrupt markup mid-token (mirrors props-svelte.ts).
        if (content.slice(n.start + 1, pos) !== n.name) return
        const { line, column } = lineCol(content, n.start)
        inserts.push({ pos, text: ' data-dsgn-source="' + rel + ':' + line + ':' + column + '"' })
      })
      inserts.sort((a, b) => b.pos - a.pos)
      let code = content
      for (const i of inserts) code = code.slice(0, i.pos) + i.text + code.slice(i.pos)
      return { code }
    }
  }
}
