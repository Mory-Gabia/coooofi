# Task Completion Checklist

When finishing work on this project, verify:

## Code Quality
- [ ] All TypeScript files pass `npm run lint` without errors
- [ ] No console.log statements in production code
- [ ] Functions are <50 lines (guideline)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling in async operations

## Testing
- [ ] Unit tests written for critical functions
- [ ] Test coverage > 80%
- [ ] All tests pass with `npm test`
- [ ] Tests use React Testing Library best practices
- [ ] No skipped tests in main branch

## Build & Performance
- [ ] `npm run build` completes successfully
- [ ] No TypeScript build errors
- [ ] Production bundle size reasonable (<60KB gzipped for critical path)

## Documentation
- [ ] README.md updated with project-specific info
- [ ] Comments added for non-obvious logic
- [ ] API/component interfaces documented
