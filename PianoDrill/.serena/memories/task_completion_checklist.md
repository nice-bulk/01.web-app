# Task Completion Checklist - PianoDrill

After completing any coding task, run the following steps:

## 1. Type Check
```bash
pnpm exec tsc --noEmit
```
Ensure there are no TypeScript errors.

## 2. Lint
```bash
pnpm lint
```
Fix any ESLint errors or warnings before committing.

## 3. Manual Verification
```bash
pnpm dev
```
Run the dev server and visually verify the feature works as expected in the browser.

## 4. Build Check (before merging/releasing)
```bash
pnpm build
```
Ensure the production build succeeds without errors.

## 5. Git Commit
```bash
git add .
git commit -m "feat: description of change"
```
Use conventional commit messages where possible:
- `feat:` new feature
- `fix:` bug fix
- `refactor:` code refactor
- `style:` formatting/style only
- `chore:` tooling/config changes
