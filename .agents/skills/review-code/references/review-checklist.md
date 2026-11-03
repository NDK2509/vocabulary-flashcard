# Review Checklist

## Requirements
- [ ] Every `Must` AC is implemented; behavior matches Given/When/Then exactly.
- [ ] No scope creep beyond the spec; out-of-scope items untouched.
- [ ] Empty / loading / error states handled as specified.

## Correctness
- [ ] Edge cases: empty lists, long text, unicode, rapid clicks, double submit, refresh.
- [ ] State updates are immutable; no stale closures in effects/callbacks.
- [ ] Effects have correct dependency arrays and cleanup.
- [ ] Persistence (localStorage / API) handles parse errors and missing data.

## React & TypeScript
- [ ] Follows `implement-react-feature/references/react-conventions.md` (structure, naming).
- [ ] No `any`, no unsafe `as` casts, no `@ts-ignore` without justification.
- [ ] Stable list keys; no unnecessary re-renders from inline objects passed to memoized children.
- [ ] Logic extracted into hooks / pure functions; components readable.
- [ ] No dead code, console logs, or commented-out code.

## Tests
- [ ] Each AC has at least one test named after it.
- [ ] Tests assert user-visible behavior (RTL by role/label), not implementation details.
- [ ] No flaky timing (`waitFor`/`findBy` instead of sleeps); no `.only` / `.skip`.

## Accessibility
- [ ] Semantic elements; all interactive elements keyboard-operable with visible focus.
- [ ] Labels for inputs, `alt` for images, `aria-live` for dynamic messages.
- [ ] `eslint-plugin-jsx-a11y` clean.

## Performance
- [ ] No heavy new dependencies without reason (check build output size).
- [ ] Large/rarely used views lazy-loaded.

## Security
- [ ] No `dangerouslySetInnerHTML` with untrusted data; inputs validated.
- [ ] No secrets/tokens/keys in code, env files, or bundle (`VITE_*` vars are public!).
- [ ] External URLs/APIs use HTTPS.

## Firebase Hosting / deploy
- [ ] New `VITE_*` env vars documented in `.env.example` (they are baked in at build time).
- [ ] `firebase.json` still valid: `public: "dist"`, SPA rewrite to `/index.html` preserved,
      cache headers (`/assets/**` immutable, `index.html` no-cache) intact.
- [ ] `.firebaserc` has no accidental project switch; no `.firebase/` cache or debug logs committed.
- [ ] If Firebase SDK is used: config only from env, data protected by Security Rules / App Check.

