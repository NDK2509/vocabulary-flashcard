---
name: deploy-vercel
description: >-
  Procedure and runbook for deploying this Next.js (App Router + TypeScript) app to Vercel (Preview
  and Production environments): pre-deploy quality verification, Vercel CLI authentication and project
  linking, environment variables validation, deployment execution, post-deploy smoke checks, rollback
  instructions, and writing docs/tasks/<task-id>/05-deploy.md. Use for the Deploy stage.
---

# Deploy Next.js to Vercel (Deploy Stage)

## Principles

1. **Explicit confirmation required for production.** Never deploy to Vercel production (`--prod`)
   or push/merge to `main` without explicit confirmation from the user.
2. **Quality gate must pass.** The deployment must never proceed if lint, typecheck, tests, or
   build fail. The verification script (`scripts/verify.sh`) must pass cleanly first.
3. **Never commit secrets.** Never commit `.vercel/`, `.env.local`, `.env*.local`, or Vercel access
   tokens into git. Keep secrets managed securely via Vercel Project Settings or `vercel env`.
4. **Always smoke-test.** Every deployment (preview or production) must be validated with an automated
   HTTP smoke check before reporting completion.

---

## 1. Prerequisites & Auth

Verify the Vercel CLI is accessible and authenticated:

```bash
# Check CLI version or run via npx
npx vercel --version

# Verify active authentication
npx vercel whoami
```

If not logged in, prompt the user to authenticate using `npx vercel login` or supply a `VERCEL_TOKEN`
scoped to the team/project.

Link the local workspace to the Vercel project (first-time setup only):

```bash
npx vercel link
```

---

## 2. Environment Variables Sync

Ensure required environment variables (e.g. Supabase credentials, public app URLs) are configured:

1. Check `.env.example` for all required variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.).
2. For local validation or preview checks, pull development environment variables:
   ```bash
   npx vercel env pull .env.local
   ```
3. To add or inspect environment variables on Vercel:
   ```bash
   npx vercel env ls
   npx vercel env add <KEY> [production|preview|development]
   ```
   > **Security Warning:** Never expose service role keys or database passwords as `NEXT_PUBLIC_*` variables.

---

## 3. Pre-Flight Verification Gate

Before running any deploy command, execute the quality gate:

```bash
bash .agents/skills/implement-nextjs-feature/scripts/verify.sh
```

All steps (`lint`, `typecheck`, `unit tests`, and `build`) must exit with code 0 (`verify.sh: PASS`).
If any step fails, abort immediately and route back to the Developer stage.

Ensure git working tree is clean:

```bash
git status --porcelain
```

---

## 4. Execute Deployment

Use the deployment helper script:

### A. Preview Deployment (Default)

Triggers a preview deployment with an isolated URL for validation:

```bash
bash .agents/skills/deploy-vercel/scripts/deploy.sh
```

Or directly via CLI:

```bash
npx vercel
```

### B. Production Deployment (Requires User Approval)

Only execute after Tester stage signs off (`PASSED`) AND the user has explicitly confirmed:

```bash
bash .agents/skills/deploy-vercel/scripts/deploy.sh --prod --confirm
```

Or directly via CLI:

```bash
npx vercel --prod
```

---

## 5. Post-Deploy Smoke Checks

Run the automated smoke test script against the deployed URL:

```bash
bash .agents/skills/deploy-vercel/scripts/smoke-deployment.sh <DEPLOYED_URL>
```

The smoke check verifies:
- Root route returns HTTP 200 OK.
- App Router HTML contains expected title/meta tags.
- Security headers are present (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Core asset paths (`/_next/static/...`) resolve properly.
- Protected routes redirect unauthenticated requests to login (e.g. HTTP 307 / redirect).

---

## 6. Rollback Protocol

If a production deployment introduces critical regressions:

1. List recent production deployments:
   ```bash
   npx vercel deploy --list
   ```
2. Promote the previous known-good deployment instantly in the Vercel Dashboard (`Project > Deployments > [Target] > Instant Rollback` or `Promote to Production`), or alias the good deployment:
   ```bash
   npx vercel alias set <PREVIOUS_DEPLOYMENT_URL> <PRODUCTION_DOMAIN>
   ```
3. File a critical bug and record the rollback in `docs/tasks/<task-id>/05-deploy.md`.

---

## 7. Document the Deployment

Record the deployment summary in `docs/tasks/<task-id>/05-deploy.md` using
[deploy-template.md](./resources/deploy-template.md).

Report to the user:
- Deployed URL
- Environment (Preview / Production)
- Inspect URL / Vercel dashboard link
- Smoke check results

