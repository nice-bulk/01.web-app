# Suggested Commands (Windows / pnpm)

## Development
```
pnpm dev          # Start dev server (Vite HMR)
pnpm build        # Type-check + production build (tsc -b && vite build)
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
```

## Package Management (pnpm)
```
pnpm install              # Install all dependencies
pnpm add <package>        # Add a dependency
pnpm add -D <package>     # Add a dev dependency
pnpm remove <package>     # Remove a package
```

## System Utilities (Windows)
```
dir                        # List directory contents
cd <path>                  # Change directory
type <file>                # View file contents
git status                 # Check git status
git log --oneline          # View commit history
```

## Notes
- No test runner configured yet (no test script in package.json)
- No formatting tool (Prettier) configured yet
