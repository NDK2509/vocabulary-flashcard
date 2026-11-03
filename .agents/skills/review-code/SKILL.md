---
name: review-code
description: >-
  Code review procedure and checklist for this React + TypeScript project deployed on Google
  Cloud: requirement coverage, correctness, React best practices, TypeScript quality, tests,
  accessibility, performance, security, and deploy/config safety. Produces
  docs/tasks/<task-id>/03-review.md with APPROVED or CHANGES_REQUESTED. Use for the Reviewer stage.
---

# Review Code (Reviewer)

## Steps

1. Read `01-requirements.md` (ACs) and `02-implementation.md` (file list, AC mapping).
2. Get the diff:
   ```bash
   git status --short
   git diff --stat <base>...HEAD   # or `git diff` / `git diff --staged` if uncommitted
   ```
   Read every changed file fully, not just the hunks, plus the callers of changed code.
3. Run the quality gate — any failure is a `BLOCKER`:
   ```bash
   bash .agents/skills/implement-react-feature/scripts/verify.sh --coverage
   ```
4. Walk the [review checklist](./references/review-checklist.md).
5. Write `docs/tasks/<task-id>/03-review.md` using
   [review-template.md](./resources/review-template.md).

## Severity guide

| Severity | Meaning | Blocks approval? |
|----------|---------|------------------|
| BLOCKER | Failing gate, AC not implemented, bug, security issue, data loss | Yes |
| MAJOR | Missing tests for an AC, a11y violation, convention breach with real cost, perf issue | Yes |
| MINOR | Readability, naming, small duplication | No |
| NIT | Style/preference | No |

## Rules

- Each finding: id (`R<round>-<n>`), severity, `path:line`, problem, suggested fix.
- On round ≥ 2, first verify each previous BLOCKER/MAJOR is fixed; list them as
  `Resolved` / `Not resolved`.
- `APPROVED` ⇔ verify passes, all ACs implemented, zero open BLOCKER/MAJOR.
- Never edit source files.

