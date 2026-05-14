# Development Commands

## Essential Commands
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production (runs tsc -b && vite build)
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## Build Process
1. `tsc -b` - TypeScript incremental build with project references
2. `vite build` - Bundle and optimize

## Testing
**NOTE**: No test command script configured yet. Need to add:
- `npm test` for running Vitest
- `npm run test:watch` for watch mode
- `npm run test:ui` for UI mode

## Code Quality
- ESLint configuration: flat config in `eslint.config.js`
- TypeScript strict mode enabled in tsconfig.app.json
