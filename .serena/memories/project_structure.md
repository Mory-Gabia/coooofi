# Project Structure

```
bet-games/
├── src/
│   ├── App.tsx           - Main App component (placeholder with Vite/React showcase)
│   ├── App.css           - App styling
│   ├── main.tsx          - Entry point (React 19 createRoot)
│   ├── index.css         - Global styles
│   ├── setupTests.ts     - Test configuration (imports jest-dom)
│   └── assets/           - Static assets (images, SVGs)
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
├── public/               - Static files
│   ├── favicon.svg
│   └── icons.svg
├── index.html            - HTML entry point
├── vite.config.ts        - Vite + Vitest configuration
├── tsconfig.json         - Root TS config with project references
├── tsconfig.app.json     - App-specific TS config
├── tsconfig.node.json    - Node-specific TS config (for Vite)
├── eslint.config.js      - ESLint flat config
└── package.json          - Dependencies and scripts
```

## Key Files
- **vite.config.ts**: Defines Vite plugins, test environment (jsdom), and test setup file
- **tsconfig.app.json**: React/DOM types, vitest/globals, jsx: "react-jsx"
- **setupTests.ts**: Minimal - only imports @testing-library/jest-dom
- **eslint.config.js**: Flat config with TS, React Hooks, and React Refresh support
