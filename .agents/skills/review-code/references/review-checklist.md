# Review Checklist

## Requirements
- [ ] Every `Must` AC is implemented; behavior matches Given/When/Then exactly.
- [ ] No scope creep beyond the spec; out-of-scope items untouched.
- [ ] Empty / loading / error states handled as specified.

## Mobile-First & Responsive Design
- [ ] Base styles target mobile viewports first (360px–390px); `sm:`, `md:`, `lg:` used for progressive enhancement.
- [ ] Touch targets: All buttons, links, and inputs have at least 44px–48px height (`min-h-[44px]`).
- [ ] Button stacking: Primary actions stack full-width on mobile (`w-full sm:w-auto`) for easy thumb reach.
- [ ] Zero horizontal overflow: Fluid layouts (`w-full max-w-...`), comfortable viewport padding (`px-4 sm:px-6`).
- [ ] No hover-only critical actions: Touch devices can perform all actions via direct tap.
- [ ] Tactile feedback: Buttons and cards provide tap feedback (`active:scale-[0.98]`).

## Next.js & TypeScript
- [ ] Follows `implement-nextjs-feature/references/nextjs-conventions.md`.
- [ ] Server Components by default; `'use client'` only where interactivity/state is strictly needed.
- [ ] No `any`, no unsafe `as` casts, no `@ts-ignore` without justification.
- [ ] Stable list keys; components small and readable.
- [ ] No dead code, debug logs, or commented-out code.

## Tests
- [ ] Each AC has at least one test named after it.
- [ ] Tests assert user-visible behavior (RTL by role/label), not implementation details.
- [ ] No flaky timing (`waitFor`/`findBy` instead of sleeps); no `.only` / `.skip`.

## Accessibility
- [ ] Semantic HTML (`button`, `nav`, `main`, `label`).
- [ ] All interactive elements keyboard-operable with visible focus ring.
- [ ] Inputs have associated labels; images have `alt` tags.
- [ ] Text contrast ≥ 4.5:1 in both light and dark modes.

## Security & Vercel
- [ ] No database passwords or secret keys in client-accessible code (`NEXT_PUBLIC_*`).
- [ ] Supabase session validated on the server via `supabase.auth.getUser()`.
- [ ] Protected routes guarded by middleware and server-side checks.
- [ ] Quality gate passes cleanly (`verify.sh: PASS`).
