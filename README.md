# ShiftLink

A mock-data shift scheduling app built with Next.js, TypeScript, Tailwind CSS, daisyUI, lucide-react, and FullCalendar.

## Commands

- `npm run dev` — start development.
- `npm run lint` — check ESLint rules.
- `npm run build` — type-check and build all routes.
- `npm start` — serve the production build.
- `node --test tests/shiftCalculator.test.mjs` — run calculation regression tests (Node.js 22.18+ or 24+ with native TypeScript stripping).

## Code organization

- `src/app`: route views and page-specific state, validation, and event handlers.
- `src/components/layout/AppShell.tsx`: shared sidebar/main layout, mounted once in the root layout.
- `src/components`: shared headers, badges, modal frames, record actions, sidebar, and calendar.
- `src/components/providers`: React Context providers for shared in-memory ShiftLink data and daisyUI feedback dialogs.
- `src/types`: employee, shift, swap-request, status, and form types.
- `src/data`: typed mock fixtures, mock current employee, and static dashboard preview values.
- `src/lib/date.ts`: calendar-date formatting.
- `src/lib/shiftCalculator.ts`: net working hours and rolling seven-day totals.
- `src/lib/studentHours.ts`: shared student-hour limit and warning thresholds.
- `src/lib/forms.ts`: fresh employee and shift form defaults.
- `src/lib/employees.ts`: shared active-employee predicate.
- `tests`: calculation regression tests.

## State and scheduling behavior

No database, API, or authentication is connected. A React Context store keeps mock employees, shifts, and swap requests in sync while navigating between pages during the current browser session. Refreshing the page resets the fixtures. Dashboard figures remain static mock previews.

Working hours exclude breaks and support overnight shifts. Each shift's net hours belong to its stored calendar date. Adding or editing a student shift checks every seven-calendar-day window containing that shift, including future scheduled shifts. Editing excludes the old shift before recalculating. Exactly 28 hours is allowed; totals above 28 are blocked. Student monitoring shows the largest rolling seven-day total.

Page-specific handlers stay with their views. Shared calculations and repeated UI belong in `src/lib` and `src/components`; keep mock fixtures in `src/data`.
