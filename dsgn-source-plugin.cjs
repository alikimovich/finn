// Added by dsgn. Stamps data-dsgn-source on JSX elements so the visual editor
// can map elements to source. DEV ONLY — do not enable in production builds.
module.exports = function dsgnSource({ types: t }) {
  return {
    name: 'dsgn-source',
    visitor: {
      JSXOpeningElement(path, state) {
        const loc = path.node.loc
        if (!loc) return
        const already = path.node.attributes.some(
          (a) => a.name && a.name.name === 'data-dsgn-source'
        )
        if (already) return
        const root = state.file.opts.root || process.cwd()
        const file = (state.file.opts.filename || '').replace(root + '/', '')
        path.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('data-dsgn-source'),
            t.stringLiteral(`${file}:${loc.start.line}:${loc.start.column}`)
          )
        )
      }
    }
  }
}
