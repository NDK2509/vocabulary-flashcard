# React Conventions

## Stack

- React 18+ with function components and hooks, TypeScript `strict: true`.
- Vite build tool; output in `dist/` (static files served by Firebase Hosting).
- Testing: Vitest + React Testing Library (unit/component), Playwright (e2e).
- Styling: CSS Modules (`*.module.css`) unless the project already uses another approach.
- Routing (if needed): `react-router-dom` with `BrowserRouter`. The SPA rewrite
  (`"source": "**" → "/index.html"`) in `firebase.json` must be kept.
- If Firebase SDK services are used (Auth, Firestore…), initialize once in
  `src/services/firebase.ts` from `VITE_FIREBASE_*` env vars.

## Folder structure

```text
src/
├── app/               # App shell, providers, router
├── features/<name>/   # Feature slices: components/, hooks/, api/, types.ts, index.ts
├── components/        # Shared, presentational UI components
├── hooks/             # Shared hooks
├── lib/               # Framework-agnostic helpers (pure functions)
├── services/          # API clients, storage adapters
├── test/setup.ts      # Test setup
└── main.tsx
```

## Code rules

- Components: PascalCase file & name, one component per file, named exports.
- Props typed with an `interface <Name>Props`. No `any`; prefer discriminated unions for state.
- Keep components small (< ~150 lines); extract logic into hooks (`useXxx`) or `lib/` pure fns.
- Side effects only in `useEffect`/event handlers; always clean up subscriptions/timers.
- Lists need stable `key`s (never array index for mutable lists).
- Handle all UI states explicitly: loading, empty, error, success.
- Data access goes through `services/` (e.g. `storage.ts`, `api.ts`), never `fetch` in components.
- Env/config: `import.meta.env.VITE_*`, typed in `src/vite-env.d.ts`, defaults in `.env.example`.
  Never put secrets in frontend env vars — they are public in the bundle.

## Accessibility

- Semantic HTML first (`button`, `nav`, `main`, `label`). Interactive elements are keyboard
  reachable, with visible focus. Images have `alt`. Color contrast ≥ 4.5:1.
- Use `aria-live` for dynamic status messages; manage focus on dialogs/route changes.

## Performance

- Lazy-load routes/heavy components with `React.lazy` + `Suspense`.
- Memoize only when measured or for referential stability passed to memoized children.
- Avoid large dependencies; check bundle size in the `vite build` output.

## Security

- Never use `dangerouslySetInnerHTML` with user data. Validate/sanitize input.
- No secrets, tokens, or service-account keys in the repo or the bundle.

