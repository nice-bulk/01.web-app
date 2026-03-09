# Task Completion Checklist

When a coding task is completed, perform the following steps:

## 1. Lint
```
pnpm lint
```
Fix any ESLint errors before considering the task done.

## 2. Type Check
```
pnpm build
```
This runs `tsc -b` which performs full type checking. Ensure no type errors.

## 3. Manual Verification
- Run `pnpm dev` and verify the feature works in the browser
- Check browser console for runtime errors

## 4. No Tests Configured
- No test runner is set up yet. If tests are added in future, run them here.

## Notes
- There is no auto-formatter (Prettier) configured, so manually ensure consistent style
- Always fix `noUnusedLocals` and `noUnusedParameters` violations before finishing
