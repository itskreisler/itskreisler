# AGENTS.md

## Developer Commands

```bash
pnpm dev         # Start dev server with hot reload
pnpm build       # Build for production
pnpm preview     # Preview production build locally
```

## Tech Stack

- **Framework**: Astro 5.x with React 19 integration
- **Styling**: TailwindCSS 4.x (via `@tailwindcss/vite` plugin)
- **Package Manager**: pnpm (v10.30.1) — locked via `packageManager` field in package.json
- **i18n**: `@kreisler/i18n` (local package)
- **Deployment**: Vercel adapter (prod) / Node adapter (dev)

## Architecture

- **Entry point**: `src/pages/index.astro`
- **Lang pages**: `src/pages/[lang]/`
- **Components**: `src/components/`
- **Layouts**: `src/layouts/Layout.astro`
- **Styles**: `src/styles/global.css`
- **Output**: `dist/` directory

## Build Configuration

- Astro config: `astro.config.mjs`
- TypeScript: `tsconfig.json` (extends `astro/tsconfigs/strict`)
- Path alias: `@/*` → `./src/*`
- Environment variables: Custom logic in `src/helpers/env.ts`

## Quirks

- Env detection: Uses custom `src/helpers/env.ts` (not dotenv directly) — checks `PROD`, `NODE_ENV`, `VITE_NODE_ENV`, `DEV`
- Adapter switches based on env: Vercel in production, Node standalone in dev
- Build format: `file` (not `esm` or `cjs`)
- Public assets: Both `./src/assets/**` and `./public/**` included in Vercel adapter bundle

## Order of Operations

For production-like verification:
```bash
pnpm build && pnpm preview
```

No test or lint scripts configured in package.json.

## Reference

- Design guidelines: See `DESIGN.md` for the visual system (Figma-inspired)