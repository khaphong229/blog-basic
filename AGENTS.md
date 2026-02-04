# Project Overview & Rules

## Tech Stack
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Runtime**: React 19.2.0
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library

## External File Loading (Lazy Loading)
CRITICAL: When you encounter a file reference (e.g., @.opencode/rules/ui.md), use your **Read** tool to load it on a **need-to-know basis**. They are relevant to the SPECIFIC task at hand.

**Instructions:**
- Do NOT preemptively load all references.
- Use lazy loading based on actual need (e.g., if writing a component, read the UI rules; if writing tests, read Testing rules).
- When loaded, treat content as mandatory instructions that override defaults.

## Rule References

### 1. UI & Styling
**Reference**: `@.opencode/rules/ui.md`
**When to read**:
- Creating or modifying React components.
- Styling elements with Tailwind CSS.
- Adding imports to a file.
- Working with shadcn/ui components.

### 2. Coding Standards & Patterns
**Reference**: `@.opencode/rules/standards.md`
**When to read**:
- Writing TypeScript logic or defining types.
- Naming files, variables, or components.
- Handling Errors or Form Validation.
- Setting up Context or Client/Server boundaries.
- Working with Internationalization (i18n).

### 3. Workflow & Tooling
**Reference**: `@.opencode/rules/workflow.md`
**When to read**:
- Running build, lint, or format commands.
- Understanding Git hooks or commit failures.
- Cleaning the project.

### 4. Testing
**Reference**: `@.opencode/rules/testing.md`
**When to read**:
- Writing unit tests.
- Configuring Vitest.
- Debugging test failures.

## Key Directories
- `app/` - Next.js App Router pages
- `components/` - React components (`ui/` for shadcn)
- `context/` - React Context providers
- `lib/` - Utility functions
- `hooks/` - Custom React hooks (`useMounted`, `useMediaQuery`, etc.)
- `public/` - Static assets
