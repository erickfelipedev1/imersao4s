# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lovable sync

This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published git history — force pushing, or rebasing/amending/squashing commits that are already pushed — since it rewrites history on Lovable's side and the user will likely lose their project history. Commits pushed to the connected branch (`main`) sync back to Lovable and show up in the editor, so keep the branch in a working state.

## Commands

Package manager is Bun (`bun.lock` is present).

- `bun run dev` — start the dev server
- `bun run build` — production build (Nitro, targets Cloudflare by default)
- `bun run build:dev` — build in development mode
- `bun run preview` — preview the production build
- `bun run lint` — ESLint
- `bun run format` — Prettier (writes in place)

There is no test runner configured.

## Architecture

This is a **TanStack Start** app (SSR, file-based routing), not a plain Vite SPA — routing, component, and build conventions differ from a typical React template accordingly.

- **Routing**: file-based under `src/routes/`, per `src/routes/README.md`. Every `.tsx` file there defines a route (`index.tsx` → `/`, `users/$id.tsx` → `/users/:id`, `_layout.tsx` for layout routes, splat routes read `_splat` not `*`). `src/routes/__root.tsx` is the single app shell wrapping every page — preserve its `<Outlet />`. Do not create `src/pages/` or Next/Remix-style route files. `src/routeTree.gen.ts` is auto-generated; never edit by hand.
- **Router setup**: `src/router.tsx` creates the TanStack Router instance with a `QueryClient` in context (TanStack Query is wired in globally, not per-route).
- **Entry points**: `src/start.ts` defines the `createStart` instance with server middleware; `src/server.ts` wraps the TanStack Start server-entry `fetch` handler with extra error normalization (it detects and repackages h3's swallowed 500 errors into a rendered error page — see `src/lib/error-page.ts` and `src/lib/error-capture.ts`).
- **Build config**: `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already bundles the TanStack Start plugin, React plugin, Tailwind, tsconfig-paths, Nitro, the dev component-tagger, `VITE_*` env injection, and the `@` alias. Do not add any of those plugins manually — the comment at the top of the file lists exactly what's already included, and duplicating a plugin breaks the app.
- **UI components**: shadcn-ui (`components.json`, style "new-york", Tailwind base color "slate") — all shadcn primitives live under `src/components/ui/`. Tailwind v4, config lives in `src/styles.css` (no `tailwind.config.js`). Path aliases (`@/components`, `@/lib`, `@/hooks`, `@/lib/utils`) are set in both `components.json` and `tsconfig.json`.
- **Dependency install guard**: `bunfig.toml` sets a 24-hour supply-chain guard (`minimumReleaseAge`) that blocks installing package versions published in the last day. A few `@lovable.dev/*` packages are pre-excluded from that guard. Confirm with the user before adding any further package to `minimumReleaseAgeExcludes`.
