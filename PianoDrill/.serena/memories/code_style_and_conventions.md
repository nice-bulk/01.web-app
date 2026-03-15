# Code Style & Conventions - PianoDrill

## Language & Tooling
- TypeScript (strict mode via tsconfig)
- React 19 with functional components and hooks
- ESM modules throughout

## Naming Conventions
- Components: PascalCase (e.g., `App`, `PianoDrill`)
- Files: PascalCase for components (`.tsx`), camelCase for utilities (`.ts`)
- Variables/functions: camelCase
- CSS classes: kebab-case

## TypeScript
- Use type annotations where inference is insufficient
- Prefer `interface` for object shapes, `type` for unions/intersections
- Avoid `any`; use `unknown` if needed
- tsconfig uses `strict: true` (assumed from template)

## React
- Functional components only (no class components)
- Hooks for state and side effects
- Default export for page/app components

## ESLint Rules (from eslint.config.js)
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks` (hooks rules enforced)
- `eslint-plugin-react-refresh` (Vite HMR compatible)

## File Structure
- Components in `src/`
- Assets in `src/assets/`
- Global styles in `src/index.css`
- Component styles co-located (e.g., `App.css`)
