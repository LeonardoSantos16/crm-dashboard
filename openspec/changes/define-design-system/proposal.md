# Proposal

## Why

The CRM has no visual foundation yet: `app/globals.css` still holds the create-next-app defaults (Geist, a dark-mode media query, two colors). Every screen spec that follows (Kanban, list, opportunity detail) needs one shared source of color, type, and state language. Without it, each screen would invent its own. The case is judged on whether a salesperson finds the deal to work on today, and that depends on consistent, readable urgency signals.

## Brand context

The CRM inherits the identity of Nobre Brindes (nobrebrindes.com.br), checked against the group's other site (coroadefloresnobre.com.br). Both use a green primary, a gold accent, and a crown in the logo. Values are taken from the sites' CSS. Anything not found there is marked as a new decision in `design.md`.

- **Audience:** Nobre Brindes salespeople, who use the CRM all day on desktop and on their phones between calls, plus the sales manager who follows the team. They are internal, repeat users. They value speed over discovery.
- **Personality:** objective, reliable, organized.
- **Voice (pt-BR UI text):** direct and concrete, like the Nobre Brindes site. Use verbs and real numbers, never exclamation marks: "Parada há 6 dias", "Adiada até 25/10", "Marcar como retornado".
- **Anti-references:**
  - Generic AI dashboards: gradients, decorative metric cards, glassmorphism, purple accents.
  - The e-commerce urgency tone of the flower site ("melhor preço", all-caps calls to action).
  - Color used as decoration.
- **Principles:**
  1. Urgency is readable at a glance. Hierarchy and clarity come before aesthetics.
  2. State is never conveyed by color alone; every state has an icon and a text label.
  3. Density over ornament: an internal tool shows more data per screen than a marketing site.
  4. Brand appears in a few places, mainly the dark navigation bar with its gold active item. It does not compete with state colors.
- **Accessibility target:** WCAG 2.2 AA. Text needs at least 4.5:1, and UI components and large text need at least 3:1. Interactive targets are at least 44×44px on mobile and 24×24px on desktop. `prefers-reduced-motion` is respected.

## What Changes

- Replace the create-next-app styles with design tokens in the Tailwind 4 `@theme` block of `app/globals.css`. This block becomes the single source of truth for colors, fonts, type scale, radii, shadows, and motion. Tailwind's default color palette and font families are cleared, so off-token utilities do not exist.
- Light theme only. Remove the dark-mode media query.
- Brand palette from Nobre Brindes: `paper`, `paper-shade`, `surface`, `ink`, `ink-soft`, `forest`, `forest-deep`, `moss`, `crown`, `border`.
  - Add `border-strong`, a new token: the site's input border (1.48:1) fails the 3:1 non-text contrast rule.
- State colors for the CRM, each as a `fg` / `bg` / `solid` triple: `attention`, `error`, `success` (Fechamento, reusing the brand green), `lost` (Perdida), `snoozed` (adiado), `escalated` (escalonado).
- Typography through `next/font/google`:
  - Archivo for UI text and headings (width axis, 112% only for page titles).
  - Montserrat with tabular numbers for codes, currency, dates, and uppercase labels.
  - Geist is removed.
- Interface rules: control heights of 36px on desktop and 44px on mobile, a 4px radius for cards, buttons, and inputs, full radius for chips and badges, the site's card and lift shadows, and a visible focus ring.
- Base components for the required feedback patterns: `StatusBadge`, `Skeleton`, `ErrorState`, `EmptyState`. Icons come from `lucide-react`, the library the Nobre Brindes site uses.
- A development-only `/design-tokens` route that renders the palette, state colors, type scale, and feedback components. It returns 404 in production.
- Vitest with automated checks:
  - the contrast of every declared color pair;
  - no hard-coded colors outside the theme;
  - the feedback components.
- `CLAUDE.md` (new): imports `AGENTS.md` and states the design rules ("no color or font outside the tokens", read the design-system spec before styling).
- `app/layout.tsx`: loads the new fonts and sets `lang="pt-BR"`.

## Capabilities

### New Capabilities

- `design-system`: visual tokens, typography, state colors, accessibility rules, and the loading, error, and empty-result patterns every CRM screen uses.

### Modified Capabilities

None.

## Out of Scope

- Dark theme.
- Screen layouts and screen-specific components (Kanban column, opportunity card, filters, navigation contents). These come from the ASCII wireframes, the Claude Design prototypes, and one spec per screen, in that order.
- A signature element. The crown already lives in the logo, and the identity does not call for another one.
- Business rules: when an opportunity is in attention, escalated, or snoozed. This change only defines how each state looks.
- Logo files and favicon. No CRM logo asset exists yet.
- Impeccable or any other design-critique tooling.

## Impact

- **Code:**
  - `app/globals.css`: rewritten.
  - `app/layout.tsx`: fonts and `lang`.
  - New `components/feedback/*`.
  - New `app/design-tokens/` route.
  - `app/page.tsx` keeps its placeholder, restyled only to compile with the cleared palette.
- **Dependencies:**
  - `lucide-react` (runtime).
  - Dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`, following the Next.js Vitest guide.
- **Scripts:** a `test` script in `package.json`.
- **Docs:** new `CLAUDE.md`. Later screen specs reference `openspec/specs/design-system/spec.md` instead of redefining styles.
- **Design workflow:** adjustments made in Claude Design flow back into `@theme` and this spec. Code stays the source of truth.
