# Code Style & Conventions

## TypeScript
- Strict mode enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `erasableSyntaxOnly: true` — avoid TypeScript-specific syntax that can't be erased (e.g. `enum`, `namespace`)
- Target: ES2023
- Module resolution: `bundler`

## React
- JSX transform: `react-jsx` — no need to `import React from 'react'`
- Use functional components with hooks
- Component files use `.tsx` extension

## Naming Conventions
- Components: PascalCase (e.g. `MyComponent.tsx`)
- Variables & functions: camelCase
- CSS files: co-located with their component (e.g. `App.tsx` + `App.css`)

## ESLint Rules
- `eslint-plugin-react-hooks`: enforces Rules of Hooks
- `eslint-plugin-react-refresh`: ensures components can be hot-reloaded safely
- `typescript-eslint` recommended rules applied
