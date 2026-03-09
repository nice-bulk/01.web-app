# Code Style and Conventions

## Language
- TypeScript with strict mode enabled
- React 19 functional components only
- ESM modules (`import`/`export`)

## Naming Conventions
- Components: PascalCase (e.g., `App`, `MyComponent`)
- Files: Match component name (e.g., `App.tsx`)
- CSS files: Match component name (e.g., `App.css`)
- Variables/functions: camelCase
- Types/interfaces: PascalCase

## TypeScript
- Strict mode enforced (`strict: true`)
- No unused locals or parameters
- `erasableSyntaxOnly: true` — avoid `enum` and other non-erasable TypeScript features
- No barrel imports with side effects (`noUncheckedSideEffectImports`)
- Use `verbatimModuleSyntax` — explicit `import type` for type-only imports

## React
- Functional components with hooks
- No class components
- React Refresh compatible (no anonymous default exports)

## Imports
- Use path aliases if configured (none yet)
- Keep imports organized: React first, then libraries, then local

## No Prettier Configured
- Formatting style not enforced automatically; follow existing file style
