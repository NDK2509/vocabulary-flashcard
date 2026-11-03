---
name: implement-react-feature
description: >-
  Developer procedure for implementing a requirements spec in this ReactJS (Vite + TypeScript)
  project: scaffolding (if needed), coding conventions, unit/component tests with Vitest + React
  Testing Library, the verify script (lint, typecheck, test, build), and the implementation notes
  artifact. Use for the Dev stage of the pipeline and for fixing review/QA findings.
---

# Implement React Feature (Dev)

## 1. Prepare

- Read `docs/tasks/<task-id>/01-requirements.md`. On rework rounds also read `03-review.md`
  and/or `04-test-report.md` and make a checklist of every `BLOCKER`/`MAJOR` finding or bug.
- `git status` must be clean of unrelated changes before you start.

## 2. Scaffold (only if `package.json` does not exist)

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom \
  eslint-plugin-jsx-a11y prettier @playwright/test
```

Then ensure these `package.json` scripts exist (the verify script depends on them):

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview --port 4173",
  "lint": "eslint .",
  "typecheck": "tsc -b --noEmit",
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test"
}
```

Add a `test` block to `vite.config.ts` (`environment: 'jsdom'`, `globals: true`,
`setupFiles: './src/test/setup.ts'` importing `@testing-library/jest-dom/vitest`), and exclude
`e2e/**` from Vitest. Copy the Firebase Hosting files from the `deploy-firebase` skill
(`resources/firebase.json` → `firebase.json`, `resources/firebaserc` → `.firebaserc`) into the
repo root, and add `.firebase/` and `firebase-debug.log*` to `.gitignore`.

## 3. Implement

Follow [react-conventions.md](./references/react-conventions.md). Key points:
- Feature-based folders under `src/features/<feature>/`.
- Function components + hooks, strict TypeScript (no `any`), no business logic in JSX.
- Every AC maps to code **and** at least one test.
- Config via `import.meta.env.VITE_*` only; document new vars in `.env.example`.

## 4. Test

- Colocate tests: `Component.test.tsx` next to `Component.tsx`.
- Use RTL queries by role/label (`getByRole`, `getByLabelText`), `userEvent` for interaction.
- Name tests after ACs: `it('AC-2: shows the back side when the card is clicked', ...)`.

## 5. Verify (must pass)

```bash
bash .agents/skills/implement-react-feature/scripts/verify.sh
```

Runs lint → typecheck → unit tests → production build. Fix and re-run until green.

## 6. Document

Write/update `docs/tasks/<task-id>/02-implementation.md` from
[implementation-template.md](./resources/implementation-template.md). On rework rounds, append a
"Round N" section listing each finding id and how it was fixed.

