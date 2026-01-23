# Workflow & Tooling

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript compiler check (no emit)
npm run clean        # Clean .next and node_modules cache
```

## Git Hooks
This project uses **Husky** and **lint-staged**.
- **Pre-commit**: Automatically runs `type-check` and `lint-staged` (format + lint) on staged files.
- **Workflow**: 
  1. Make changes
  2. `git add .`
  3. `git commit -m "message"` -> Triggers checks
  4. If checks fail, fix errors and retry.
