---
name: analyze-requirements
description: >-
  Business-analysis procedure that turns a raw user request into a testable requirements spec
  (user stories, Given/When/Then acceptance criteria, scope, UI states, assumptions, open
  questions) saved as docs/tasks/<task-id>/01-requirements.md. Use for the BA stage of the
  delivery pipeline or whenever a request needs to be clarified before implementation.
---

# Analyze Requirements (BA)

## Steps

1. **Understand the request.** Read `docs/tasks/<task-id>/00-request.md`. Classify it:
   feature / bug / change / chore.
2. **Understand the product today.** Skim `README.md`, `src/` (routes, pages, components,
   state, data model) and previous `docs/tasks/*/01-requirements.md` to reuse domain terms
   (e.g. *deck*, *card*, *front/back*, *review session*).
3. **For bugs:** capture current behavior, expected behavior, and reproduction steps.
4. **Write the spec** using [requirements-template.md](./resources/requirements-template.md).
5. **Acceptance criteria quality bar** — each AC must be:
   - Atomic (one behavior), observable in the UI or via a public interface.
   - Written as `Given … When … Then …`.
   - Numbered `AC-1…AC-n`, and tagged with priority `Must | Should | Could`.
   - Covering: happy path, empty state, loading state, error state, validation, persistence
     (e.g. localStorage / API), responsive (mobile ≤ 480px), keyboard & screen-reader access.
6. **Non-functional requirements** where relevant: performance (e.g. LCP < 2.5s), a11y
   (WCAG 2.1 AA), browser support, i18n, analytics, SEO, security/privacy.
7. **Google Cloud impact:** note new env vars, external APIs, CORS, routing (SPA fallback),
   or infra changes needed so Dev/DevOps are aware.
8. **Decide status:**
   - Ambiguity that changes the outcome → list under *Open Questions* (each with your
     recommended default) → `Status: BLOCKED_ON_QUESTIONS`.
   - Otherwise record assumptions → `Status: READY_FOR_DEV`.

## Validation

- Every user story has ≥ 1 AC; every AC is testable by the QA tester without guessing.
- *Out of Scope* section is not empty for features (prevents scope creep).
- No implementation details (component names, libraries) unless they are true constraints.

