# Requirements — 20261103-custom-auth-api

**Status:** READY_FOR_DEV  
**Type:** feature / change  
**Priority:** P0  

## 1. Summary

Replace the third-party Supabase Auth dependency with a first-party, self-hosted Custom Authentication API backed directly by the existing PostgreSQL database (`pg` connection pool in `src/lib/db/index.ts`). The system provides four core REST endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`), secure `HttpOnly` cookie-based session management, Next.js Server Actions, edge/server route protection middleware, and seamless frontend integration across `/login`, `/register`, `Navbar`, and `MobileMenu` with zero email verification required upon registration.

## 2. Background / Current behavior

- Currently, the application uses `@supabase/ssr` and Supabase Auth client (`src/lib/supabase/*`, `src/actions/auth.ts`, `src/middleware.ts`) for authentication.
- Flashcard data and database queries already run against PostgreSQL via `src/lib/db/index.ts`.
- The user requires full control over authentication without external auth vendor locks, requiring their own custom authentication API endpoints and a dedicated `users` table (and optional `sessions` table) in PostgreSQL.
- Registration must be friction-free: users must not be required to verify emails, confirm tokens, or wait for approval before accessing the application.

## 3. User stories

- **US-1:** As a new visitor, I want to create an account by providing an email and password without email verification, so that I can immediately access the vocabulary flashcard features.
- **US-2:** As a registered user, I want to sign in with my email and password, so that my authenticated session is established securely via cookies.
- **US-3:** As an authenticated user, I want to sign out from any screen (desktop Navbar or mobile menu), so that my session cookie is cleared and I am returned to the unauthenticated view.
- **US-4:** As an API consumer or client component, I want a `/api/auth/me` endpoint, so that I can inspect the currently logged-in user's profile and authentication status.
- **US-5:** As a guest attempting to visit protected routes (`/dashboard`, `/flashcards`), I want to be redirected to `/login` with a `redirectTo` query parameter, so that my private data remains secure.
- **US-6:** As an authenticated user navigating to `/login` or `/register`, I want to be automatically redirected to `/dashboard`, preventing redundant sign-in attempts.

## 4. Acceptance criteria

| ID | Story | Priority | Given | When | Then |
|----|-------|----------|-------|------|------|
| **AC-1** | US-1 | Must | An unauthenticated visitor on `/register` | They submit a valid email and a password of ≥ 6 characters | A new record is created in the PostgreSQL `users` table with a securely hashed password (scrypt/pbkdf2/bcrypt), an authenticated session cookie is issued, and the user is redirected directly to `/dashboard`. |
| **AC-2** | US-1 | Must | An unauthenticated visitor on `/register` | They submit an email that already exists in `users` | The registration fails, HTTP 409 (or form error redirect) is returned, and an error message "Email is already registered" is visibly displayed. No duplicate user is inserted. |
| **AC-3** | US-1 | Must | An unauthenticated visitor on `/register` or calling `POST /api/auth/register` | They submit missing fields or a password shorter than 6 characters | HTTP 400 Bad Request is returned with validation error message "Password must be at least 6 characters" (or corresponding field error), and no database mutation occurs. |
| **AC-4** | US-2 | Must | A registered user on `/login` or calling `POST /api/auth/login` | They submit their correct email and password | HTTP 200 OK is returned, a secure session cookie (`auth_session`, `HttpOnly`, `SameSite=Lax`, `Path=/`) is set in the response headers, and the user is navigated to `/dashboard` (or the URL specified by `redirectTo`). |
| **AC-5** | US-2 | Must | A user on `/login` or calling `POST /api/auth/login` | They submit incorrect credentials (non-existent email or wrong password) | HTTP 401 Unauthorized is returned with message "Invalid email or password", no session cookie is set, and the UI displays the error in a red alert container. |
| **AC-6** | US-3 | Must | An authenticated user on any page | They click "Sign Out" in the desktop Navbar or MobileMenu (or call `POST /api/auth/logout`) | The session cookie is invalidated (`Max-Age=0`), the user state is reset, and the user is redirected to `/login`. |
| **AC-7** | US-4 | Must | A request with a valid session cookie to `GET /api/auth/me` | The endpoint is invoked | HTTP 200 OK is returned with JSON payload `{ user: { id, email, createdAt } }` (excluding `password_hash`). |
| **AC-8** | US-4 | Must | A request without a session cookie or with an expired/tampered session cookie to `GET /api/auth/me` | The endpoint is invoked | HTTP 401 Unauthorized is returned with `{ user: null, error: "Unauthorized" }`. |
| **AC-9** | US-5 | Must | An unauthenticated visitor | They request `/dashboard` or `/flashcards` | Next.js Middleware intercepts the request and redirects to `/login?redirectTo=<original_path>`. |
| **AC-10** | US-6 | Must | An authenticated user with a valid session cookie | They request `/login` or `/register` | Next.js Middleware intercepts the request and redirects to `/dashboard`. |
| **AC-11** | US-6 | Must | An authenticated user visiting any page | The desktop Navbar and mobile drawer render | The user's email is displayed, "Sign Out" button is available, and protected links ("Dashboard", "Flashcards") are visible. "Sign In" and "Get Started" links are hidden. |
| **AC-12** | US-6 | Must | An unauthenticated visitor visiting any page | The desktop Navbar and mobile drawer render | "Sign In" and "Get Started" links are displayed. "Dashboard", "Flashcards", and "Sign Out" are hidden. |
| **AC-13** | US-1, US-2 | Must | A user viewing `/login` or `/register` on a mobile viewport (≤ 480px) | Interacting with input fields and buttons | All touch targets (`<input>`, `<button>`, `<Link>`) meet a minimum 44px height/touch area, fonts do not auto-zoom (font-size ≥ 16px on inputs), and layout has no horizontal overflow. |
| **AC-14** | US-1, US-2 | Should | A user navigating `/login` and `/register` using keyboard only | Pressing `Tab`, `Enter`, or screen-reader virtual keys | Proper semantic HTML forms, labels linked by `htmlFor`/`id`, visible focus rings (`focus:ring-2`), and clear error announcements are maintained. |

## 5. UI / UX notes

- **Authentication Forms (`/login` & `/register`):**
  - Modern card container matching existing design system (Tailwind CSS, dark mode support).
  - Clean error banners: Red container (`bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900`).
  - Informational banners: Blue container for redirect messages (e.g. `?message=...`).
  - Inputs: Min 48px height (`min-h-[48px]`), clear placeholder text, autofocus on email field, autocomplete attributes (`email`, `current-password`, `new-password`).
  - Primary Submit Buttons: Min 48px height, active scale effect (`active:scale-[0.98]`), accessible label text ("Sign In", "Create Account").
- **Header & Navigation (`Navbar`, `MobileMenu`):**
  - Seamless desktop header and slide-down mobile menu reflecting immediate session state.
  - Sign Out button styled with minimum 40px desktop / 44px mobile touch target.
- **Home Page (`/`):**
  - Update hero text to reflect custom Next.js full-stack authentication.
  - Call-to-action buttons toggle dynamically: "Go to Dashboard" / "Study Flashcards" when signed in; "Create Free Account" / "Sign In" when signed out.

## 6. Data & integrations

### 6.1 Database Schema (PostgreSQL via `src/lib/db/index.ts`)

1. **`users` Table:**
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));
   ```

2. **`sessions` Table:**
   ```sql
   CREATE TABLE IF NOT EXISTS sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     token VARCHAR(255) UNIQUE NOT NULL,
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
   ```

### 6.2 REST Endpoints Specification

1. **`POST /api/auth/register`**
   - **Body:** `{ "email": "user@example.com", "password": "password123" }`
   - **Success (201):** Sets `auth_session` cookie; returns `{ "user": { "id": "...", "email": "user@example.com", "createdAt": "..." } }`.
   - **Error (400):** `{ "error": "Email and password are required (min 6 characters)" }`
   - **Error (409):** `{ "error": "Email is already registered" }`

2. **`POST /api/auth/login`**
   - **Body:** `{ "email": "user@example.com", "password": "password123" }`
   - **Success (200):** Sets `auth_session` cookie; returns `{ "user": { "id": "...", "email": "user@example.com", "createdAt": "..." } }`.
   - **Error (401):** `{ "error": "Invalid email or password" }`

3. **`POST /api/auth/logout`**
   - **Success (200):** Clears `auth_session` cookie (`Max-Age=0`, `Expires=Thu, 01 Jan 1970 00:00:00 GMT`); returns `{ "success": true }`.

4. **`GET /api/auth/me`**
   - **Success (200):** Returns `{ "user": { "id": "...", "email": "...", "createdAt": "..." } }`.
   - **Unauthorized (401):** Returns `{ "user": null, "error": "Unauthorized" }`.

### 6.3 Cookie Configuration
- Name: `auth_session`
- Attributes: `HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` (7 days); `Secure` if `process.env.NODE_ENV === 'production'`.

## 7. Non-functional requirements

- **Security & Password Storage:**
  - Passwords hashed using modern cryptographic hash functions (Node.js built-in `crypto.scrypt` with per-user cryptographic salt or standard constant-time comparison `crypto.timingSafeEqual`).
  - No plain passwords or password hashes leaked in API responses, logs, or client-side bundles.
  - Session cookies must have `HttpOnly` enabled to prevent XSS session hijacking.
- **Performance:**
  - Route handlers and session lookup response time < 50ms locally / < 200ms on server.
  - Database pool reuse using the existing global singleton in `src/lib/db/index.ts`.
- **Accessibility:**
  - Meets WCAG 2.1 AA: Color contrast ratio ≥ 4.5:1, keyboard navigable, screen-reader friendly labels and status announcements.
- **Mobile First:**
  - Full responsiveness down to 320px viewport width with no horizontal scroll. Touch targets ≥ 44x44px.

## 8. Out of scope

- Email verification codes / confirmation emails (explicitly skipped as requested by user).
- Password recovery / Forgot password email flow.
- Third-party OAuth (Google, GitHub, Apple).
- Two-factor authentication (TOTP/SMS).
- Rate-limiting Redis middleware.

## 9. Assumptions

- **A-1:** The existing PostgreSQL database (`DATABASE_URL` in `src/lib/db/index.ts`) has write permissions to create and query the `users` and `sessions` tables (auto-migrated or created via initial query on app boot/first request).
- **A-2:** Server Actions in `src/actions/auth.ts` (`signIn`, `signUp`, `signOut`, `getUser`) will be retained and updated to interface with the new custom auth logic, ensuring full compatibility with existing Server Components and Forms.
- **A-3:** Immediate auto-login upon registration provides the best zero-verification user experience: creating an account immediately sets the session cookie and directs the user to `/dashboard`.
- **A-4:** Session expiration is set to 7 days by default with rolling refresh or standard expiry.

## 10. Open questions

| # | Question | Recommended default |
|---|----------|---------------------|
| *None* | All functional boundaries, endpoints, database requirements, and UX behaviors are fully specified. | — |

