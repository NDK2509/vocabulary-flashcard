---
trigger: always_on
---

# Team Workflow (BA → Dev → Reviewer → Tester)

This project is a **Next.js** web app (App Router + TypeScript, `src/app/`) deployed to **Vercel**.
Source lives in GitHub: https://github.com/NDK2509/vocabulary-flashcard

## Delivery pipeline

Every feature / bug / change request from the user goes through four roles, in order:

| # | Role | Subagent | Skill | Output artifact |
|---|------|----------|-------|-----------------|
| 1 | Business Analyst | `business-analyst` | `analyze-requirements` | `docs/tasks/<task-id>/01-requirements.md` |
| 2 | Developer | `developer` | `implement-nextjs-feature` | code + `docs/tasks/<task-id>/02-implementation.md` |
| 3 | Code Reviewer | `code-reviewer` | `review-code` | `docs/tasks/<task-id>/03-review.md` |
| 4 | QA Tester | `qa-tester` | `test-feature` | tests + `docs/tasks/<task-id>/04-test-report.md` |
| 5 | (optional) Deploy | `delivery-lead` | `deploy-vercel` | `docs/tasks/<task-id>/05-deploy.md` |

The orchestration procedure lives in the `deliver-task` skill; the `delivery-lead` agent runs it.

## Hard rules

- **Task id** format: `YYYYMMDD-short-kebab-slug` (e.g. `20261103-add-flashcard-flip`). All artifacts for a task live in `docs/tasks/<task-id>/`.
- Each role **reads all previous artifacts** for the task before starting and **writes its own artifact** before handing off. No artifact → the stage is not done.
- Loop-backs: Reviewer verdict `CHANGES_REQUESTED` → back to Developer. Tester verdict `FAILED` → back to Developer (then Reviewer again). Max **3** loops per stage, then stop and escalate to the user.
- Requirements ambiguity is resolved by the BA **asking the user**, never by guessing silently. Assumptions must be listed explicitly in `01-requirements.md`.
- Only the Developer modifies production code (`src/`, config files). Reviewer never edits code. Tester only adds/edits test files (`*.test.ts(x)`, `e2e/`).
- `npm run lint`, `npm run typecheck`, `npm run test -- --run`, and `npm run build` must all pass before a task leaves the Developer stage, and again before Tester sign-off.
- **Never deploy to Vercel production without explicit user confirmation.** Never `git push` to `main` without user confirmation. Never commit secrets, Vercel tokens, `.vercel/`, or `.env*` files (except `.env.example`).
