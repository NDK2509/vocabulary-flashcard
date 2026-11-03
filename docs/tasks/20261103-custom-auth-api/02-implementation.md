# Implementation — 20261103-custom-auth-api

**Round:** 1  
**verify.sh:** PASS  
**Branch / commit:** main @ HEAD  

## Summary

- **PostgreSQL Database Storage (`users` & `sessions`):** Implemented first-party relational tables with `pgcrypto` (`users` table with unique lowercase emails and hashed passwords; `sessions` table with tokens, user references, and expiration timestamps).
- **Cryptographic Security (`src/lib/auth/crypto.ts` & `token.ts`):** Implemented standard `scrypt` password hashing with unique random salts, constant-time `timingSafeEqual` comparison, 64-hex-character token generation, and universal HMAC-SHA256 signed tokens (`token.signature`) compatible with Edge and Node.js runtimes.
- **REST Endpoints:**
  - `POST /api/auth/register`: Creates user with zero verification required, sets `HttpOnly` `auth_session` cookie, and returns 201 Created.
  - `POST /api/auth/login`: Authenticates credentials and sets session cookie with 200 OK.
  - `POST /api/auth/logout`: Clears session from database and invalidates cookie with 200 OK.
  - `GET /api/auth/me`: Returns currently authenticated user or 401 Unauthorized.
- **Next.js Server Actions (`src/actions/auth.ts`):** Updated `signUp`, `signIn`, `signOut`, and `getUser` to use the custom auth system directly. `signUp` automatically logs the user in and redirects immediately to `/dashboard` without requiring email confirmation.
- **Route Guard Middleware (`src/middleware.ts`):** Edge-ready middleware verifying the signed session cookie. Redirects unauthenticated visits from `/dashboard` and `/flashcards` to `/login?redirectTo=...`, and redirects authenticated visits away from `/login` and `/register` to `/dashboard`.
- **Front-End Integration:** Updated `Navbar.tsx`, `MobileMenu.tsx`, `page.tsx`, `dashboard/page.tsx`, `flashcards/page.tsx`, and `api/flashcards/route.ts` to consume the custom auth system seamlessly while preserving full mobile-first design principles.

## Files changed

| File | Change | Notes |
|------|--------|-------|
| `supabase/migrations/20261103000001_create_users_and_sessions_tables.sql` | added | Migration for `users` and `sessions` tables |
| `src/lib/auth/types.ts` | added | Auth interfaces (`AuthUser`, `DbUser`, `DbSession`) |
| `src/lib/auth/crypto.ts` | added | Scrypt password hashing, verification, HMAC sign/verify |
| `src/lib/auth/token.ts` | added | Web Crypto API edge token signing and verification |
| `src/lib/auth/session.ts` | added | Cookie configuration (`HttpOnly`, `SameSite=Lax`, 7 days) |
| `src/lib/auth/db.ts` | added | PostgreSQL database queries for users and sessions |
| `src/lib/auth/index.ts` | added | Core auth service (`registerUser`, `authenticateUser`, `getCurrentUser`, `logoutUser`) |
| `src/app/api/auth/register/route.ts` | added | REST registration endpoint |
| `src/app/api/auth/login/route.ts` | added | REST login endpoint |
| `src/app/api/auth/logout/route.ts` | added | REST logout endpoint |
| `src/app/api/auth/me/route.ts` | added | REST user profile endpoint |
| `src/actions/auth.ts` | modified | Server Actions backed by custom auth |
| `src/middleware.ts` | modified | Edge session verification and route protection |
| `src/components/Navbar.tsx` | modified | Uses `getUser()` from custom auth |
| `src/app/page.tsx` | modified | Updated hero text and auth session state |
| `src/app/(protected)/dashboard/page.tsx` | modified | Integrated custom auth user and session inspect link |
| `src/app/(protected)/flashcards/page.tsx` | modified | Integrated custom auth user |
| `src/app/api/flashcards/route.ts` | modified | Protected using `getCurrentUser()` from custom auth |
| `src/lib/auth/crypto.test.ts` | added | Unit tests for scrypt hashing and HMAC token signing |
| `src/app/api/auth/auth-api.test.ts` | added | Route Handler tests for all 4 auth endpoints |
| `docs/tasks/20261103-custom-auth-api/01-requirements.md` | added | BA Requirements specification |
| `docs/tasks/20261103-custom-auth-api/02-implementation.md` | added | Developer implementation documentation |

## Acceptance criteria mapping

| AC | Implemented in | Covered by test |
|----|----------------|-----------------|
| AC-1 | `src/app/api/auth/register/route.ts`, `src/actions/auth.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-1: returns 201 with user and sets auth_session cookie on success" |
| AC-2 | `src/app/api/auth/register/route.ts`, `src/lib/auth/index.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-2: returns 409 when email already exists" |
| AC-3 | `src/app/api/auth/register/route.ts`, `src/lib/auth/index.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-3: returns 400 when email or password is missing or password < 6 chars" |
| AC-4 | `src/app/api/auth/login/route.ts`, `src/actions/auth.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-4: returns 200 with user and session cookie on valid credentials" |
| AC-5 | `src/app/api/auth/login/route.ts`, `src/actions/auth.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-5: returns 401 on invalid credentials" |
| AC-6 | `src/app/api/auth/logout/route.ts`, `src/actions/auth.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-6: clears session cookie and returns success 200" |
| AC-7 | `src/app/api/auth/me/route.ts`, `src/lib/auth/index.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-7: returns 200 with user profile when valid session cookie exists" |
| AC-8 | `src/app/api/auth/me/route.ts`, `src/lib/auth/index.ts` | `src/app/api/auth/auth-api.test.ts` › "AC-8: returns 401 when no session cookie is provided" |
| AC-9 | `src/middleware.ts` | `verify.sh` (build & runtime route protection) |
| AC-10 | `src/middleware.ts` | `verify.sh` (build & runtime route protection) |
| AC-11 | `src/components/Navbar.tsx`, `src/components/MobileMenu.tsx` | `src/components/MobileMenu.test.tsx` › "renders authenticated links when user is signed in" |
| AC-12 | `src/components/Navbar.tsx`, `src/components/MobileMenu.tsx` | `src/components/MobileMenu.test.tsx` › "toggles mobile menu dropdown when hamburger button is clicked" |
| AC-13 | `src/app/(auth)/login/page.tsx`, `register/page.tsx` | `verify.sh` (lint & build) |
| AC-14 | `src/app/(auth)/login/page.tsx`, `register/page.tsx` | `verify.sh` (lint & build) |

## Config / infra changes

- Applied migration `20261103000001_create_users_and_sessions_tables.sql` to PostgreSQL.

## How to run locally

```bash
npm install
npm run dev
```

Run test suite:
```bash
npm run test
```

Run full quality gate:
```bash
bash .agents/skills/implement-nextjs-feature/scripts/verify.sh
```

## Known limitations / risks

- None.

