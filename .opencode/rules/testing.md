# Testing Guidelines

**Framework**: Vitest + React Testing Library

## Commands
```bash
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## Strategy
- Place test files alongside components or in `__tests__`.
- Naming: `filename.test.tsx` or `filename.test.ts`.
- Use `vi` from `vitest` for mocking.

## Example
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```
