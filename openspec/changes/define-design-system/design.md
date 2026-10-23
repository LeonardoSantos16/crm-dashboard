# Design

## Context

- **Stack:** Next.js 16.4.2 (App Router, `cacheComponents: true`), React 19.3, TypeScript, Tailwind CSS 4.
- **Tailwind wiring:** Tailwind is compiled by the `@tailwindcss/turbopack` loader declared in `next.config.ts`. There is no PostCSS config.
- **Current styles:** `app/globals.css` and `app/layout.tsx` are the create-next-app defaults: Geist fonts, two color variables, and a dark-mode media query.
- **Tests:** there is no test runner yet.
- **Source of the values:** the brand values come from the CSS of nobrebrindes.com.br, read on 2026-10-22. That site uses Tailwind 4 with shadcn-style tokens in `:root`. The group's flower site (coroadefloresnobre.com.br, WordPress with Elementor and WoodMart) was used to confirm the shared identity: green primary, gold accent, crown in the logo, Montserrat, uppercase labels. One color, `#1A2E4A`, also comes from it.
- **Business rules:** the alert states come from the automation decisions: attention after inactivity, snooze, and escalation to the manager. This change only defines how they look. See proposal.md (Why, Brand context).

## Goals / Non-Goals

**Goals:**
- Tokens in `@theme` that make off-palette styling impossible, not just discouraged.
- A contrast guarantee that is checked by a test and does not depend on someone remembering to check.
- Feedback components that screens can drop in without restyling.

**Non-Goals:**
- A general component library (buttons, inputs, dialogs as components). Screens own their components. This change fixes only the rules they follow.
- Visual regression testing.
- Theming or runtime token switching.

## Decisions

### 1. Color tokens

Every color sits in `@theme` as `--color-<name>`, which generates `bg-*`, `text-*`, `border-*`, and the other color utilities. The block starts with `--color-*: initial;`, which clears Tailwind's default palette. `--color-white` and `--color-transparent` are then declared explicitly.

**Brand (from nobrebrindes.com.br `:root`)**

| Token | Value | Use |
|---|---|---|
| `paper` | #F8FDFA | page background |
| `paper-shade` | #F3F8F5 | Kanban column, skeleton, secondary surface |
| `surface` | #FFFFFF | card, input, popover |
| `ink` | #174F2D | body text (the site's `--ink`, equal to `forest-deep`) |
| `ink-soft` | #4C7660 | secondary text |
| `forest` | #247042 | primary action, link, focus ring on light surfaces |
| `forest-deep` | #174F2D | navigation bar, primary action hover |
| `moss` | #DDF8E8 | chip background, navigation text |
| `crown` | #D5C27F | active navigation item and focus on `forest-deep` only |
| `pitch` | #0C2D1D | reserved for the darkest surface (the site's footer) |
| `border` | #E5E5E5 | decorative dividers only |

**New**

| Token | Value | Why |
|---|---|---|
| `border-strong` | #7B8A82 | The site's `--input` (#D4D4D4) is 1.48:1 on white. Form control borders need 3:1 (WCAG 1.4.11). This value is 3.62:1 on `surface` and 3.52:1 on `paper`. |

**State triples (new decisions, except where noted)**

| State | `-fg` | `-bg` | `-solid` | pt-BR label | Lucide icon |
|---|---|---|---|---|---|
| `attention` | #7A4100 | #FFF4D6 | #B25E09 | Atenção | `clock-alert` |
| `error` | #B42318 | #FEF0EE | #B42318 | (contextual) | `circle-alert` |
| `success` | #174F2D | #DDF8E8 | #247042 | Fechada | `circle-check` |
| `lost` | #4A5550 | #EDF0EE | #6B7570 | Perdida | `circle-x` |
| `snoozed` | #1A2E4A | #E8EEF6 | #3D5F8C | Adiada | `alarm-clock-off` |
| `escalated` | #7D2340 | #FBE9EF | #A0305A | Escalonada | `siren` |

Where each value comes from:
- `success` reuses brand tokens: `forest-deep` on `moss`, with `forest` as the solid tone.
- `snoozed-fg` is the navy `#1A2E4A` from the flower site's Elementor kit. The background and solid tones are new.
- `error` replaces the site's `--destructive` (#E40014). That color passes AA at 4.87:1, but at full saturation it dominates a dense screen.

Alternatives considered:
- A separate green for Fechamento. Rejected: green means "good" in both places, and the label and icon remove the ambiguity with the primary button.
- Red for Perdida. Rejected: Perdida is a normal final outcome, not a fault, so it gets neutral tones.
- Red for escalated, shared with error. Rejected: wine keeps "the manager has been involved" apart from "the system failed".

### 2. Contrast table (locked by test)

Ratios computed with the WCAG 2.x relative-luminance formula:

| Pair | Ratio | Rule |
|---|---|---|
| `ink` / `paper` · `surface` · `paper-shade` | 9.31 · 9.58 · 8.92 | text ≥ 4.5 |
| `ink-soft` / `paper` · `surface` · `paper-shade` · `moss` | 5.02 · 5.16 · 4.81 · 4.59 | text ≥ 4.5 |
| `white` / `forest` | 6.05 | text ≥ 4.5 |
| `forest` / `surface` · `paper` | 6.05 · 5.88 | text ≥ 4.5 |
| `forest-deep` / `moss` | 8.51 | text ≥ 4.5 |
| `moss` / `forest-deep` | 8.51 | text ≥ 4.5 |
| `crown` / `forest-deep` | 5.41 | text ≥ 4.5 |
| `attention-fg` / `attention-bg` · `surface` | 7.42 · 8.13 | text ≥ 4.5 |
| `error-fg` / `error-bg` · `surface` · `paper` | 5.92 · 6.57 · 6.39 | text ≥ 4.5 |
| `white` / `error-solid` | 6.57 | text ≥ 4.5 |
| `success-fg` / `success-bg` | 8.51 | text ≥ 4.5 |
| `lost-fg` / `lost-bg` · `surface` | 6.76 · 7.76 | text ≥ 4.5 |
| `snoozed-fg` / `snoozed-bg` · `surface` | 11.73 · 13.69 | text ≥ 4.5 |
| `escalated-fg` / `escalated-bg` · `surface` | 8.23 · 9.60 | text ≥ 4.5 |
| `<state>-solid` / `surface` (attention · success · lost · snoozed · escalated) | 4.67 · 6.05 · 4.77 · 6.53 · 6.85 | non-text ≥ 3 |
| `attention-solid` / `attention-bg` | 4.26 | non-text ≥ 3 |
| `border-strong` / `surface` · `paper` | 3.62 · 3.52 | non-text ≥ 3 |

Pairs that fail and are excluded by rule:

| Pair | Ratio |
|---|---|
| `crown` / `surface` | 1.77 |
| site `sprout` #62E590 / white | 1.60 |
| flower site `#83B735` / white | 2.39 |
| WhatsApp `#25D366` / white | 1.98 |

`sprout` is not carried into the CRM.

The test keeps the pairs as a typed list of `{ fg, bg, min }` token names. It reads the hex values by parsing `app/globals.css`, so a token edit that breaks a pair fails the suite.

### 3. Typography

Fonts load with `next/font/google`. They are self-hosted at build time, with no runtime request to Google.

| Font | Settings | Exposed as |
|---|---|---|
| Archivo | `subsets: ['latin', 'latin-ext']`, `axes: ['wdth']` (the font supports a 62–125 width range) | `--font-archivo` |
| Montserrat | `subsets: ['latin', 'latin-ext']` | `--font-montserrat` |

`@theme` clears `--font-*: initial` and then defines `--font-sans: var(--font-archivo)` and `--font-mono: var(--font-montserrat)`. The site already used `font-mono` for Montserrat with `font-feature-settings: "tnum"`. The `--font-mono--font-feature-settings: "tnum"` token sets this default.

Type roles:

| Role | Size / line height | Font | Weight / other |
|---|---|---|---|
| `label` | 11 / 16 | Montserrat | 500, uppercase, letter-spacing 0.14em (the site's `.spec-label`) |
| `xs` | 12 / 16 | Archivo | — |
| `sm` | 14 / 20 | Archivo | default in dense views |
| `base` | 16 / 24 | Archivo | default body; inputs below `md` |
| `lg` | 18 / 28 | Archivo | — |
| `xl` | 20 / 28 | Archivo | — |
| `2xl` | 24 / 32 | Archivo | page title: 700, `font-stretch: 112%`, letter-spacing -0.03em (the site's `.display-wide`, with line height relaxed from 0.95 for multi-line titles) |

Codes (OPP-2001), currency (R$ 38.000), and dates (15/10/2026) use `font-mono`. Weights are 400, 500, 600, and 700.

Alternatives considered:
- The site's full trio, with Poppins for body text. Rejected: its wide geometric letters reduce how much fits in a Kanban card.
- A neutral UI font such as Inter. Rejected: it is off-brand.

### 4. Space, size, radius, shadow

- **Spacing:** Tailwind's default 4px step (`--spacing: 0.25rem`), unchanged, as on the site. Common values:
  - card padding `p-3`;
  - gaps `gap-2` and `gap-3`;
  - page gutter `px-4` on mobile and `px-6` from `md` up.
- **Control height:** `h-11` (44px) below `md` (768px) and `md:h-9` (36px) from there up. The site uses `h-11` everywhere. Desktop is denser by decision.
- **Radius:**
  - `--radius-sm: 4px` for cards, buttons, and inputs. This is the site's 3.6px `rounded-sm` rounded to whole pixels.
  - `--radius-md: 6px` for popovers and dialogs. This is the site's `--radius`.
  - `--radius-full` for chips and badges.
  - Other radius tokens are cleared.
- **Shadows (site values):**
  - `--shadow-card: 0 1px 3px -1px #174F2D29` for cards at rest.
  - `--shadow-lift: 0 18px 34px -22px #174F2D8C` for hover and for a card being dragged.
  - `--shadow-overlay: 0 24px 48px -24px #11131873` for popovers and dialogs.
  - Other shadow tokens are cleared.
- **Focus:** a global `:focus-visible` rule draws `outline: 2px solid var(--color-forest); outline-offset: 2px`. Inside the navigation bar the outline color is `crown`.

### 5. Motion

- **Duration and easing:** `--default-transition-duration: 150ms` and `cubic-bezier(.4, 0, .2, 1)`, the site's values.
- **Allowed changes:** color, shadow, and a 1px press offset (`active:translate-y-px`, from the site's button).
- **Animations:** only the skeleton pulse (`--animate-pulse`, present on the site).
- **Reduced motion:** a global `@media (prefers-reduced-motion: reduce)` rule sets animation and transition durations to `0.01ms` and removes transforms on interactive elements.

### 6. Feedback components

These live in `components/feedback/`, one file each, and are server-compatible unless they need a handler.

- **`StatusBadge`** takes `state: 'attention' | 'error' | 'success' | 'lost' | 'snoozed' | 'escalated'` and an optional `label` override.
  - Renders a pill (`rounded-full`) with `bg-<state>-bg`, `text-<state>-fg`, and the Lucide icon with `aria-hidden`, followed by the label.
  - Exports `pickAlertState(states)`, which returns the most severe of escalated, attention, and snoozed.
- **`Skeleton`** is a block in `bg-paper-shade` with `animate-pulse` and `motion-reduce:animate-none`.
  - Container usage: `aria-busy="true"` plus a visually hidden pt-BR message.
- **`ErrorState`** is a client component. It takes `message` and `onRetry`.
  - Uses `role="alert"`, `bg-error-bg`, `text-error-fg`, and the `circle-alert` icon.
  - Has a "Tentar novamente" button.
- **`EmptyState`** takes `message` and an optional `action: { label, onClick }`.
  - Uses neutral `text-ink-soft` and no state colors.

Icons come from `lucide-react`, which the Nobre Brindes site uses (`class="lucide lucide-*"` in its HTML). Alternative considered: inline SVGs, rejected because they would need hand-maintained paths for six or more icons.

### 7. Token enforcement

`--color-*: initial` removes off-palette utilities. Arbitrary values like `bg-[#fff]` or `style={{ color: '#...' }}` would still compile. A Vitest test (`tests/design-system/no-raw-colors.test.ts`) scans `app/**` and `components/**` (`.ts`, `.tsx`, `.css`) for hex, `rgb(`, `rgba(`, `hsl(` and `oklch(` literals. Only the `@theme` block of `app/globals.css` is exempt. This is cheaper than a custom ESLint rule and gives the same signal in CI and pre-review.

### 8. `/design-tokens` page

`app/design-tokens/page.tsx` calls `notFound()` when `process.env.NODE_ENV === 'production'`. Next inlines that value at build time, so the production bundle renders the 404 page and adds `noindex`. In development the page shows:
- each color as a swatch with its hex;
- each declared pair with its computed ratio, reusing the contrast helper from the test;
- the six badges;
- the type scale;
- a skeleton, an error state, and an empty state.

It is the visual reference to compare with Claude Design prototypes.

### 9. Tests

Vitest is set up following `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`:
- `vitest.config.mts` with `@vitejs/plugin-react`, `vite-tsconfig-paths`, and `jsdom`;
- a `test` script in `package.json`.

The tests are:
- `contrast.test.ts`: every pair in Decision 2 meets its minimum, with values parsed from `globals.css`.
- `no-raw-colors.test.ts`: Decision 7.
- `StatusBadge.test.tsx`:
  - each state renders its icon and label, and the icon is hidden from assistive technology;
  - `pickAlertState` puts escalated above attention above snoozed.
- `feedback.test.tsx`:
  - the error state has `role="alert"` and calls `onRetry`;
  - the empty state renders its action;
  - the skeleton container has `aria-busy`.

The `tdd` skill drives the order: write the test, then the token or component.

### 10. `CLAUDE.md`

A new file that starts with `@AGENTS.md`, then lists the rules:
- read `openspec/specs/design-system/spec.md` (or this change's spec until archive) before styling;
- no color, font, radius, or shadow outside the `@theme` tokens;
- never convey state by color alone;
- UI text in pt-BR, identifiers in English;
- light theme only;
- adjustments from Claude Design are applied to `@theme` and the spec, not inline.

## Risks / Trade-offs

- **[Body text is green (`ink` #174F2D), not neutral]** → It is the site's choice and passes AAA (9.31:1). State colors stay distinct because they use their own soft backgrounds and icons. Revisit after the Claude Design prototypes if text competes with the success state.
- **[`success` and the primary button share `forest`]** → Badges always carry an icon and the text "Fechada". Buttons are action-shaped and never pill-shaped.
- **[Snoozed navy and escalated wine may look similar for some color-vision deficiencies]** → Distinct icons and labels are required by spec. The `/design-tokens` page lets this be checked with a browser color-blindness emulator.
- **[Clearing Tailwind's palette breaks the create-next-app placeholder in `app/page.tsx`]** → The placeholder is restyled with tokens in the same change.
- **[36px desktop controls are below the 44px of the site]** → They still exceed the AA 24px minimum. Mobile keeps 44px.
- **[The raw-color scan can flag legitimate cases (an SVG asset in `app/`)]** → Only `.ts`, `.tsx`, and `.css` are scanned. Exceptions need an explicit allowlist entry in the test, which is visible in review.
- **[Values were read from live sites that can change]** → The values are now owned by this repo. The sites were the starting point, not a dependency.
