# Next.js Conventions & Mobile-First Guidelines

## 1. Stack & Architecture

- **Framework:** Next.js 16+ (App Router, React 19, TypeScript with `strict: true`).
- **Styling:** Tailwind CSS with mobile-first responsive utilities.
- **Backend & Auth:** Next.js Server Actions, Route Handlers (`src/app/api/`), Supabase SSR (`@supabase/ssr`), and PostgreSQL direct connection.
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (e2e).
- **Deployment:** Vercel.

---

## 2. Mobile-First Principles (Core Standard)

Every feature, page, and component must be conceived, designed, and implemented for mobile devices first before scaling up to tablet and desktop.

### A. Breakpoints & CSS Architecture
- **Mobile Default:** Write base styles without breakpoints for mobile viewports (360px–390px). Progressively enhance for larger screens using Tailwind prefixes:
  ```tsx
  // ✅ GOOD: Mobile default (stacked full-width), enhanced on sm+
  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
    <button className="w-full sm:w-auto min-h-[48px] px-6 py-3 ...">Action</button>
  </div>

  // ❌ BAD: Desktop-first mindset with awkward overrides
  <div className="flex flex-row w-64 max-sm:flex-col ...">
  ```
- **Breakpoints scale:**
  - Base: Mobile smartphones (360px – 639px)
  - `sm:` Small tablets / landscape phones (640px+)
  - `md:` Tablets (768px+)
  - `lg:` Laptops / Desktop (1024px+)
  - `xl:` Large monitors (1280px+)

### B. Touch Targets & Ergonomics (Thumb Zone)
- **Minimum 44px–48px Touch Target:** Every button, link, toggle, or interactive element must have a minimum physical or bounding tap area of at least 44×44px (preferably 48px height: `min-h-[44px]` or `min-h-[48px]`, `py-3` / `p-3`).
- **Comfortable Tap Spacing:** Maintain at least `gap-2` to `gap-4` between interactive elements to prevent accidental mis-taps.
- **Thumb Reach:** Place primary call-to-action buttons in easily accessible screen zones (middle to lower viewport on mobile).
- **Form Inputs:** Input font size must be at least `16px` (`text-base` or `text-sm sm:text-base` with appropriate styling) to prevent automatic iOS Safari zoom-in on focus.

### C. Fluid Layouts & Zero Horizontal Overflow
- **No Fixed Widths:** Never use fixed pixel widths on layout containers (e.g. `w-[600px]` is prohibited). Use fluid containers with max-widths: `w-full max-w-md mx-auto`.
- **Viewport Safe Padding:** Use `px-4 sm:px-6 lg:px-8` so content never touches the screen edge on mobile.
- **Text Wrapping:** Ensure long words, emails, or user-generated vocabulary wrap properly using `break-words` or `truncate`.

### D. Touch Interactions & Feedback
- **Active / Pressed States:** Provide instant visual feedback for touch presses using `active:scale-[0.98]` or active background shifts.
- **No Hover-Only Dependencies:** Never conceal essential functionality behind `:hover` states, as hover does not exist on touch devices. Secondary hover effects must complement, not replace, tap interactions.
- **Gesture-Friendly:** Interactive cards (like flashcard flip) must respond to tap anywhere on the card surface.

---

## 3. Component Conventions

- **Server Components by Default:** Fetch data and render on the server.
- **Client Components (`'use client'`) only when required:** Use client components only for user interactivity, client state (`useState`), event handlers (`onClick`), or browser APIs.
- **Props Typing:** Every component must have an explicit interface `interface <ComponentName>Props`.
- **No `any`:** Strict TypeScript typing throughout. Discriminated unions for multi-state views.
- **File Organization:** One component per file, colocated tests `ComponentName.test.tsx`.

---

## 4. Folder Structure

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, Route Handlers)
│   ├── (auth)/           # Route groups for auth flows (login, register)
│   ├── (protected)/      # Protected routes guarded by middleware & server checks
│   ├── api/              # Backend REST API routes
│   ├── layout.tsx        # Root layout with responsive Navbar
│   └── page.tsx          # Mobile-first homepage
├── actions/              # Next.js Server Actions (Backend mutations)
├── components/           # Shared cross-feature UI components
├── features/<feature>/   # Feature-based domain slices (components, hooks, tests)
├── lib/
│   ├── db/               # PostgreSQL pool & query utilities
│   └── supabase/         # Supabase SSR client, server, and middleware helpers
├── middleware.ts         # Edge route protection & session refresh
└── test/                 # Test setup and mocks
```

---

## 5. Security & Accessibility

- **Accessibility:** Semantic HTML elements (`button`, `nav`, `main`, `header`). All touch targets keyboard operable with visible focus ring (`focus:ring-2 focus:ring-blue-500`). WCAG contrast ≥ 4.5:1.
- **Security:** Never expose database connection strings or secret keys on the client. Public variables strictly prefixed with `NEXT_PUBLIC_`.
