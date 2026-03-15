# Suggested Commands - PianoDrill

## System (Windows)
- List directory: `dir` or `Get-ChildItem` (PowerShell)
- Find files: `Get-ChildItem -Recurse -Filter *.tsx`
- Navigate: `cd`
- Search in files: `Select-String -Path "src\**\*.tsx" -Pattern "keyword"`
- Git: `git status`, `git add .`, `git commit -m "msg"`, `git log`

## Development
```bash
# Install dependencies
pnpm install

# Start dev server (with HMR)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Linting
```bash
# Run ESLint
pnpm lint
```

## TypeScript
```bash
# Type check
pnpm exec tsc --noEmit
```
