# Code Style & Conventions

## TypeScript Configuration
- **Target**: ES2023
- **Module**: ESNext
- **JSX**: react-jsx (automatic JSX transform)
- **Strict Mode**: Enabled with:
  - noUnusedLocals: true
  - noUnusedParameters: true
  - noFallthroughCasesInSwitch: true
  - erasableSyntaxOnly: true

## Naming Conventions
- **Components**: PascalCase (e.g., App, MyComponent)
- **Functions/variables**: camelCase (e.g., count, setCount)
- **Constants**: camelCase (no UPPER_SNAKE_CASE in this setup)
- **CSS classes**: kebab-case (e.g., hero, counter, next-steps)

## File Organization
- Components: .tsx (React components)
- Styles: .css (collocated with components or in assets)
- Tests: .test.ts/.test.tsx (Vitest naming)
- Setup: setupTests.ts for test utilities

## ESLint Rules Enforced
- React Hooks rules (hooks called at top level)
- React Refresh compatible
- No unused variables/parameters
- TypeScript strict checking
