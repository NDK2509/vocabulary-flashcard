---
name: deliver-task
description: >-
  End-to-end orchestration runbook for delivering a user task through the BA → Dev → Reviewer →
  Tester pipeline (with optional Vercel deploy). Use this skill whenever the user gives a
  new feature request, bug report, or change request to be implemented in this React project.
---

# Deliver Task (Orchestration Runbook)

## 0. Initialize

1. Derive a task id: `YYYYMMDD-short-kebab-slug` from today's date and the request.
2. Create `docs/tasks/<task-id>/` and save the user's raw input verbatim to
   `docs/tasks/<task-id>/00-request.md` (template: [request-template.md](./resources/request-template.md)).
3. Ensure the repo is a git repo (`git init` if not) so reviewers can diff. Note the starting
   commit/branch in `00-request.md`. Prefer a branch `task/<task-id>`.

## 1. BA stage → `business-analyst`

Hand-off message:

```
Task id: <task-id>
Read: docs/tasks/<task-id>/00-request.md
Write: docs/tasks/<task-id>/01-requirements.md
Use skill: analyze-requirements
```

- `Status: BLOCKED_ON_QUESTIONS` → ask the user the open questions (verbatim, numbered), wait,
  append answers to `00-request.md`, re-invoke the BA.
- `Status: READY_FOR_DEV` → (optional but recommended) show the user the AC list and ask for a
  quick confirmation for non-trivial tasks; then continue.

## 2. Dev stage → `developer`

```
Task id: <task-id>
Read: 01-requirements.md [+ 03-review.md / 04-test-report.md on rework]
Write: code + docs/tasks/<task-id>/02-implementation.md
Use skill: implement-react-feature
Round: <n>
```

Gate: `02-implementation.md` exists and reports `verify.sh: PASS`.

## 3. Review stage → `code-reviewer`

```
Task id: <task-id>
Read: 01-requirements.md, 02-implementation.md
Write: docs/tasks/<task-id>/03-review.md
Use skill: review-code
Round: <n>
```

- `CHANGES_REQUESTED` → back to step 2 (Round n+1).
- `APPROVED` → step 4.

## 4. Test stage → `qa-tester`

```
Task id: <task-id>
Read: 01-requirements.md, 02-implementation.md, 03-review.md
Write: tests + docs/tasks/<task-id>/04-test-report.md
Use skill: test-feature
Round: <n>
```

- `FAILED` → back to step 2 with the bug list, then step 3 again, then step 4.
- `PASSED` → step 5.

## Loop limits

Max 3 rounds Dev↔Review and 3 rounds Dev↔Test. When exceeded, stop and report to the user
with the outstanding findings — do not keep looping.

## 5. Deploy (optional, needs explicit user approval)

Ask: "All stages passed. Deploy to Vercel (Production, project <name>) now?" Only on "yes",
use the `deploy-vercel` skill and record the result in `docs/tasks/<task-id>/05-deploy.md`.

## 6. Final summary to the user

```
## Task <task-id> — <DONE | BLOCKED>
- Requirements: N ACs (link 01-requirements.md)
- Implementation: files changed (link 02-implementation.md)
- Review: APPROVED after R rounds (link 03-review.md)
- Tests: X/Y passed, AC coverage 100% (link 04-test-report.md)
- Deploy: <URL | skipped>
- Follow-ups / out of scope: ...
```

Optionally commit with message `feat(<scope>): <summary> [<task-id>]` if the user wants commits.

