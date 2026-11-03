---
name: implement-nextjs-feature
description: >-
  Developer procedure for implementing a requirements spec in this Next.js (App Router + TypeScript +
  Tailwind CSS) project with strict mobile-first design principles, Server Components by default,
  unit/component tests with Vitest + React Testing Library, verify quality gate, and implementation
  notes. Use for the Dev stage of the delivery pipeline and for fixing review/QA findings.
---

# Implement Next.js Feature (Dev Stage)

## 1. Prepare

- Read `docs/tasks/<task-id>/01-requirements.md`. On rework rounds also read `03-review.md`
  and/or `04-test-report.md` and make a checklist of every `BLOCKER`/`MAJOR` finding or bug.
- Confirm `git status` is clean before starting.

---

## 2. Mobile-First Implementation Workflow

Follow [nextjs-conventions.md](./references/nextjs-conventions.md). Implement using the **Mobile-First** standard:

1. **Design for Mobile First (360px–390px):**
   - Write base CSS classes for mobile screens without media query prefixes.
   - Scale up progressively using Tailwind breakpoints (`sm:`, `md:`, `lg:`).
2. **Touch-Target Compliance:**
   - Minimum 44px–48px height on all buttons, links, inputs, and interactive surfaces (`min-h-[44px]` or `min-h-[48px]`).
   - Stack action buttons vertically on mobile (`w-full sm:w-auto`).
3. **No Horizontal Overflow:**
   - Use fluid containers (`w-full max-w-lg mx-auto px-4 sm:px-6`).
   - Never hardcode fixed container widths (`w-[600px]` is prohibited).
4. **Touch Ergonomics & Feedback:**
   - Add instant tactile feedback on tap (`active:scale-[0.98]`).
   - Ensure all actions are accessible via direct tap without relying on desktop hover.
5. **Server Components by Default:**
   - Keep components server-rendered unless interactivity, client hooks, or browser events require `'use client'`.

---

## 3. Test (Unit & Component)

- Colocate tests: `Component.test.tsx` next to `Component.tsx`.
- Test user-visible behavior (RTL by role/label), simulate touch/click events.
- Name tests after acceptance criteria: `it('AC-3: renders mobile-friendly full-width action button', ...)`.
- Verify mobile responsiveness and touch accessibility in component tests.

---

## 4. Verify (Quality Gate Must Pass)

Run the automated verification script:

```bash
bash .agents/skills/implement-nextjs-feature/scripts/verify.sh
```

All four steps (`lint`, `typecheck`, `unit tests`, and `production build`) must report `PASS`.
Fix any failures before proceeding to hand-off.

---

## 5. Document

Write/update `docs/tasks/<task-id>/02-implementation.md` using
[implementation-template.md](./resources/implementation-template.md).
Map each AC to its implementing file and automated test.
