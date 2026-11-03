# Deployment — <task-id>

**Environment:** Preview | Production
**Verdict:** DEPLOYED | FAILED | SKIPPED
**Deployed URL:** https://<deployment-url>.vercel.app
**Inspect URL:** https://vercel.com/<team>/<project>/<deployment-id>
**Git commit / branch:** <branch> @ <sha>
**Gate (verify.sh):** PASS | FAIL

## Pre-flight verification

| Check | Result | Notes |
|-------|--------|-------|
| lint | PASS | |
| typecheck | PASS | |
| unit tests | PASS | |
| production build | PASS | |
| git working tree | CLEAN | |

## Environment variables

| Variable | Target envs | Configured on Vercel? | Notes |
|----------|-------------|-----------------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | ✅ | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | ✅ | |

## Smoke test results

| Check | Target | Expected | Actual | Result |
|-------|--------|----------|--------|--------|
| HTTP 200 Root | `/` | 200 OK | 200 OK | ✅ PASS |
| Static Assets | `/_next/static/...` | 200 OK, cache headers | 200 OK | ✅ PASS |
| Protected Route Redirect | `/flashcards` | 307 / redirect to `/login` | 307 Redirect | ✅ PASS |
| Security Headers | `/` | nosniff, DENY / SAMEORIGIN | Present | ✅ PASS |

## Deployment notes & observations

- Summary of changes deployed.
- Any notable build duration or edge runtime logs.

## Rollback procedure (if needed)

- Target rollback deployment: `<URL or ID>`
- Command: `npx vercel alias set <PREVIOUS_URL> <PRODUCTION_DOMAIN>`

