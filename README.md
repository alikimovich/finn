# finn

A personal finance desktop web app. v1 is a money converter; future
features (Send, Rates, Contacts, Stories) plug into the same shell.

Built with SvelteKit + Svelte 5 + TypeScript. Plain CSS with design tokens.
FX rates from the European Central Bank via [Frankfurter](https://frankfurter.dev).

## Develop

```sh
bun install
bun run dev
```

Open http://localhost:5173 — `/` redirects to `/convert`.

## Type-check

```sh
bun run check
```

## Build

```sh
bun run build
```

## Project structure

```
src/
├── app.css              design tokens + minimal reset
├── lib/
│   ├── components/      Sidebar, NavItem, Card, Button, Input, CurrencyPicker
│   ├── data/            static currency list
│   ├── server/          Frankfurter client
│   ├── stores/          recent conversions (localStorage)
│   ├── types.ts
│   └── utils/           format, convert
└── routes/
    ├── +layout.svelte   sidebar + centered content
    ├── convert/         money conversion
    ├── send/            placeholder
    ├── rates/           placeholder
    ├── contacts/        placeholder
    └── stories/         placeholder
```
