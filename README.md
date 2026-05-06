# finn

A personal finance desktop web app. v1 is a money converter; future
features (Send, Rates, Contacts, Stories) plug into the same shell.

Built with SvelteKit + Svelte 5 + TypeScript.
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
