# Task Completion Checklist

When finishing any coding task in AlternaDaily, do the following:

1. **Lint**: Run `pnpm lint` — fix any ESLint errors before committing
2. **Type-check**: Run `pnpm build` (includes `tsc -b`) to ensure no TypeScript errors
3. **Manual test**: Run `pnpm dev` and verify the feature works in the browser
4. **Unused imports**: Remove unused variables and imports (TypeScript strict mode will catch these)
5. **import type**: Use `import type` for type-only imports (`verbatimModuleSyntax` requires this)
