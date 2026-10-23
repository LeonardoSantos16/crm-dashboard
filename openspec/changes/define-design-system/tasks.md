# Tasks

## 1. Test and icon setup

- [ ] 1.1 Install `lucide-react`. Install the Vitest dev dependencies from the Next.js Vitest guide: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`. Verify `npm ls` lists them without errors.
- [ ] 1.2 Add `vitest.config.mts` (react plugin, tsconfig paths, `jsdom`) and a `test` script in `package.json`. Verify `npm test` runs and reports no test files without crashing.

## 2. Tokens in `@theme`

- [ ] 2.1 Write `tests/design-system/contrast.ts`, a WCAG relative-luminance helper plus a parser that reads `--color-*` values from `app/globals.css`. Write `contrast.test.ts` with every pair and minimum from design.md Decision 2. Verify it fails before the tokens exist.
- [ ] 2.2 Rewrite `app/globals.css`:
  - `--color-*: initial`, white, transparent, brand, `border-strong`, and the six state triples;
  - `--radius-*` and `--shadow-*` cleared and redefined (sm 4px, md 6px; card, lift, overlay);
  - transition defaults;
  - the global `:focus-visible` rule;
  - the reduced-motion rule;
  - removal of the dark-mode media query and the `:root` variables;
  - `body` styled with `bg-paper text-ink font-sans`.

  Verify `contrast.test.ts` passes.
- [ ] 2.3 Write `tests/design-system/no-raw-colors.test.ts` (design.md Decision 7) and restyle the `app/page.tsx` placeholder with tokens only. Remove `zinc-*`, `black`, `dark:`, and `bg-black/[.06]`. Verify the test passes and `npm run build` succeeds.

## 3. Typography

- [ ] 3.1 In `app/layout.tsx`:
  - replace Geist with Archivo (`axes: ['wdth']`) and Montserrat from `next/font/google`, exposed as `--font-archivo` and `--font-montserrat`;
  - set `lang="pt-BR"`;
  - set the metadata title to "CRM Nobre Brindes".

  Verify `npm run build` succeeds and no request to `fonts.googleapis.com` or `fonts.gstatic.com` appears in the browser network tab on `npm run start`.
- [ ] 3.2 Add the font and type tokens to `@theme`:
  - `--font-*: initial`, `--font-sans`, and `--font-mono` with `--font-mono--font-feature-settings: "tnum"`;
  - the text sizes 11, 12, 14, 16, 18, 20, and 24 with their line heights;
  - a `label` utility (Montserrat 500, uppercase, 0.14em);
  - a `display-title` utility (Archivo 700, `font-stretch: 112%`, -0.03em).

  Verify a page using `font-mono` shows aligned digits for "R$ 4.500" over "R$ 38.000".

## 4. Feedback components

- [ ] 4.1 Write `components/feedback/StatusBadge.test.tsx` first:
  - each of the six states renders its pt-BR label and an icon with `aria-hidden="true"`;
  - `pickAlertState` returns escalated over attention over snoozed.

  Then implement `StatusBadge.tsx` and `pickAlertState`. Verify the tests pass.
- [ ] 4.2 Write `components/feedback/feedback.test.tsx` first:
  - `ErrorState` has `role="alert"` and calls `onRetry` from "Tentar novamente";
  - `EmptyState` renders its message and optional action;
  - the skeleton container exposes `aria-busy="true"` and the hidden "Carregando…" text.

  Then implement `Skeleton.tsx`, `ErrorState.tsx`, and `EmptyState.tsx` per design.md Decision 6. Verify the tests pass.
- [ ] 4.3 Check controls against the size rules: `h-11` below `md` and `md:h-9`, inputs at 16px below `md`. Do this on the `ErrorState` and `EmptyState` buttons. Verify in the browser at 375px and 1280px widths that the buttons measure 44px and 36px tall.

## 5. Token reference page

- [ ] 5.1 Create `app/design-tokens/page.tsx`, which calls `notFound()` in production and otherwise shows:
  - swatches with hex values;
  - each contrast pair with its computed ratio, reusing the contrast helper;
  - the six badges;
  - the type scale;
  - the skeleton, error, and empty states;
  - a sample `forest-deep` navigation bar with an active `crown` item that has `aria-current="page"` and an underline.

  Verify `/design-tokens` renders under `npm run dev` and returns 404 under `npm run build && npm run start`.
- [ ] 5.2 Check the page in the browser with reduced motion emulated (the skeleton does not pulse) and with the achromatopsia and deuteranopia emulations (the six badges stay distinguishable by icon and label). Verify by noting the result in the PR description.

## 6. Project rules

- [ ] 6.1 Create `CLAUDE.md` that starts with `@AGENTS.md` and lists the design rules from design.md Decision 10. Verify a new Claude Code session in the repo loads both files (`/memory` lists them).
- [ ] 6.2 Run `npm run lint`, `npm test`, and `npm run build`. Verify all three succeed.

## Workflow follow-up

- Review the change, then run `/opsx:apply`.
- After implementation and review, archive with `/opsx:archive` so `openspec/specs/design-system/spec.md` is created.
- Next in the flow: ASCII wireframes (mobile and desktop), then Claude Design prototypes, then one spec per screen.
