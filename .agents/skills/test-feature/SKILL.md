---
name: test-feature
description: >-
  QA procedure for verifying a task in this React project: derive test cases from acceptance
  criteria, automate with Vitest + React Testing Library and Playwright e2e, smoke-test the
  production build on the Firebase Hosting emulator, run exploratory checks (edge cases, responsive, a11y), and
  write docs/tasks/<task-id>/04-test-report.md with PASSED or FAILED. Use for the Tester stage.
---

# Test Feature (QA)

## 1. Plan

- Read `01-requirements.md`, `02-implementation.md`, `03-review.md` ("Notes for QA").
- Build a test case table: `TC-<n>` → AC id, type (unit / component / e2e / manual),
  steps, expected result. At least one TC per AC, plus negative & edge cases
  (empty input, very long text, special characters, rapid repeated actions, page refresh /
  persistence, offline/API error if applicable).

## 2. Automate

- **Component tests** (Vitest + RTL) for UI logic not already covered by the developer.
- **E2E tests** (Playwright) in `e2e/<task-slug>.spec.ts` for user flows across the app.
  First-time setup if `playwright.config.ts` is missing:
  ```bash
  npm install -D @playwright/test && npx playwright install --with-deps chromium
  ```
  Use [playwright.config.ts](./resources/playwright.config.ts) as the config — it runs against
  `vite preview` (the production build) on port 4173.
- Name tests after the TC/AC: `test('TC-3 / AC-2: ...')`. Use role/label locators.

## 3. Execute

```bash
bash .agents/skills/implement-react-feature/scripts/verify.sh --coverage   # gate
npx playwright test                                                        # e2e on prod build
```

Hosting smoke test — serves `dist/` with the Firebase Hosting emulator using the real
`firebase.json` (rewrites + headers), exactly as production will:

```bash
bash .agents/skills/deploy-firebase/scripts/smoke-hosting.sh [/a/client/route]
```

Optionally run e2e against the emulator: `E2E_BASE_URL=http://localhost:5000 npx playwright test`
(while the emulator is running).

## 4. Exploratory checks

- Responsive: 375px, 768px, 1280px viewports (Playwright `page.setViewportSize`).
- Keyboard-only navigation, focus visibility; optional axe scan via `@axe-core/playwright`.
- Deep-link refresh on a client route returns the app (SPA fallback), not 404.
- Browser console free of errors/warnings.

## 5. Report

Write `docs/tasks/<task-id>/04-test-report.md` from
[test-report-template.md](./resources/test-report-template.md).

Bug severity: `Critical` (crash/data loss/blocked flow), `High` (AC fails), `Medium`
(degraded but workaround), `Low` (cosmetic).

**Verdict:** `PASSED` ⇔ every AC passes, gate passes, and no open Critical/High bugs.
Never modify production code — file bugs instead.

