# klucz-wiolinowy

React + Vite + TypeScript + Tailwind v4 + shadcn/ui, deployed to GitHub Pages.

**Live:** https://wknott.github.io/klucz-wiolinowy/

## Stack

- React 19
- Vite 6
- TypeScript (strict)
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui (style: `new-york`, base color: `slate`)
- React Router v7 (HashRouter — required for static GitHub Pages hosting)

## Tooling

- Yarn 4 (Berry, `nodeLinker: node-modules`)
- Prettier + `prettier-plugin-tailwindcss`
- ESLint (flat config)
- Husky v9 + lint-staged (pre-commit: Prettier on staged files, then `tsc --noEmit`)

## Scripts

```bash
yarn dev            # Start dev server
yarn build          # Type-check + build for production (outputs to dist/)
yarn preview        # Preview the production build
yarn typecheck      # Run TypeScript without emitting
yarn lint           # Run ESLint
yarn format         # Format all files with Prettier
yarn format:check   # Check formatting without writing
```

## Adding shadcn/ui components

```bash
yarn dlx shadcn@latest add button
yarn dlx shadcn@latest add card
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages via `actions/deploy-pages@v4`.

In **GitHub Settings → Pages**, set **Source: GitHub Actions**.

## URL parameters

App reads `?n=` from the URL hash. Example:

```
https://wknott.github.io/klucz-wiolinowy/#/?n=3
```
