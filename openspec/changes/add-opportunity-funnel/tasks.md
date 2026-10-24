# Tasks

Each group from 2 to 8 is one slice: one branch off `develop` and one PR into `develop`. This change adds no new tests (design decision 12). Each task is checked in the browser against its spec scenarios, with the `crm-api` running on the seed, plus the commands it names.

## 1. Prototype review

- [ ] 1.1 Fold the Claude Design prototype feedback into this change:
  - visual adjustments into `@theme` and the design-system spec;
  - layout or flow changes into `design.md` and the specs.

  Verify that `openspec validate add-opportunity-funnel` passes and `npm test` stays green.
- [x] 1.2 Apply the round 1 token changes in `app/globals.css`: `paper-shade` #EAF2EE and `border` #D8E3DC. Add `lost-solid` on `lost-bg` (3:1) to the contrast pairs. Verify with `npm test` and on `/design-tokens`.

## 2. Foundation (`feat/funnel-foundation`)

- [x] 2.1 Move `app/` to `src/app/`, delete `src/pages/`, point the `@/*` alias to `./src/*`, and fix the `/design-tokens` imports. Make the design-system tests scan `src/` and read `src/app/globals.css`, and update the paths in `CLAUDE.md`. Verify:
  - `npm test`, `npm run typecheck`, and `npm run build` pass;
  - a hex color added to a file in `src/components/` makes `npm test` fail.
- [x] 2.2 Install `@tanstack/react-query`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@radix-ui/react-dialog`, and `@radix-ui/react-dropdown-menu`. Add the `/api/:path*` rewrite to `${API_URL}/api/:path*` and an `.env.example` with `API_URL`. Verify that `http://localhost:3000/api/users` returns the users while the `crm-api` runs.
- [x] 2.3 Add `src/lib/`:
  - `axios.ts` with the `X-User-Id` request interceptor and the `X-Today` response interceptor;
  - `react-query.ts`;
  - `api/types.ts` (copied from `docs/integracao-api/crm-api-front-types.ts`);
  - `api/errors.ts` with the pt-BR messages for every `code` and move `reason`;
  - `dates.ts`.

  Verify with `npm run typecheck`.
- [x] 2.4 Add `src/app/providers.tsx` with `QueryClientProvider` and `CurrentUserProvider` (`localStorage`, first `SELLER` as default), plus `useCurrentUser` and `useToday`, and render it in the root layout. Verify in the browser that requests carry `X-User-Id` and that the chosen user survives a reload.

## 3. App shell (`feat/funnel-shell`)

- [x] 3.1 Build the top bar per W1:
  - logo and tabs, with `aria-current` on the active tab and "Time" for managers only;
  - "Nova oportunidade" and the bell slot;
  - the "Entrando como" selector labeled as demo mode.

  Verify in the browser as Ana and as Marcos.
- [x] 3.2 Add the routes: `/` redirects to `/oportunidades`, and `/retornos` and `/time` are placeholders. Replace the create-next-app placeholder. Verify in the browser and with `npm run build`.

## 4. Board (`feat/funnel-board`)

- [x] 4.1 Add `useOpportunities` and `groupByStage`:
  - lost cards go at the end of their `lostFromStage` column, outside the count;
  - "com alerta" counts `ATTENTION` and `ESCALATED` only.

  Verify as Ana with "Mostrar perdidas": OPP-2007 is at the end of its column and not counted.
- [x] 4.2 Render the five columns with their headers (name, count, alert count) and the cards per W1:
  - the owner initial for managers only;
  - the state strip at the card's footer;
  - alert and near event on one line;
  - no "Fechada" badge in Fechamento.

  Verify against W1 in the browser as Marcos and as Ana.
- [x] 4.3 Add the toolbar through `useBoardFilters`:
  - search with a 300 ms debounce;
  - "Precisam de atenção (N)" from `needsAttention`, and the situation chips;
  - the owner filter (manager only), the sort, and "Mostrar perdidas";
  - "Ver todas" in Fechamento through `allClosed`.

  Keep all of it in the URL with the API's parameter names, inside `<Suspense>`. Verify by reloading a shared URL in the browser.
- [x] 4.4 Add the loading, error, no-match, no-filter-match, no-opportunities, and empty-column states with the `src/components/feedback/` patterns. Verify each state in the browser; for the error state, stop the `crm-api`.

## 5. Side panel and detail page (`feat/funnel-detail`)

- [x] 5.1 Build the side panel (W5):
  - `op=<id>` in the URL;
  - summary, alert reason, and "Não informado" for empty fields;
  - "Vencida há N dias" for an expired proposal, counted from `X-Today`;
  - the blocked-advance notice from the `missing` in `moves`;
  - the actions, with "Marcar como retornado" as the full-width main action.

  While the panel is open, the board narrows and scrolls horizontally. Clicking the open card again navigates to the page. Verify in the browser with OPP-2002 (expired proposal), the second click, and keyboard Enter.
- [x] 5.2 Build the detail page `/oportunidades/[id]` (W6): header with actions, Dados with gift items, and the Atividade timeline, newest first, with an icon for each of the seven entry types. Verify with OPP-2004 in the browser.
- [x] 5.3 Add comments: a send button that stays disabled while the box is empty, and no edit or delete. Verify in the browser.

## 6. Dialogs and actions (`feat/funnel-actions`)

- [x] 6.1 Add `Toast` to `src/components/feedback/` and `MoneyInput` to `src/components/form/`. Verify on `/design-tokens` and with `npm test`.
- [x] 6.2 Build the "Mover para…" menu (Radix) with disabled stages and their reasons from `moves`, and an optimistic move with rollback and a `Toast`. Verify in the browser that Fechamento is disabled for a Follow-up card, and that a rejected move returns the card with the message.
- [x] 6.3 Build the missing-data dialog (W9), opened when the chosen move has `missing`. It calls `/move` with `complete`. Verify with a new opportunity moved to Apresentação de Orçamento.
- [x] 6.4 Build the lost dialog (W10): a required reason, a detail field required for "Outro", and lost tones. Verify both validation messages in the browser.
- [x] 6.5 Build "Marcar como retornado" (W12): channel buttons, summary, a next date after today and up to 30 days, and the default-deadline hint from `alert.deadlineDays`. Verify the hint and the 30-day limit in the browser.
- [x] 6.6 Build "Adiar" (W13): a required date up to 30 days, an optional reason, and the escalation warning when `snoozeCount` is 1. Verify in the browser by snoozing twice in a row.
- [x] 6.7 Hide "Marcar como retornado" and "Adiar" for opportunities in Fechamento and Perdida. Verify with OPP-2006 in the browser.
- [ ] 6.8 Build the "Nova oportunidade" dialog (W11): the owner is locked for a salesperson and a select of the team for a manager. The new opportunity starts in Primeiro Contato and its panel opens. Verify as Ana and as Marcos.
- [ ] 6.9 Build the edit modal (W8):
  - field validation, with server errors shown on their fields;
  - add and remove gift items;
  - the suggested value that the user can override.

  Verify in the browser, including the 422 for an empty item list from Orçamento on.

## 7. Drag and drop (`feat/funnel-dnd`)

- [ ] 7.1 Check the current `@dnd-kit` version against React 19, install it, and drag cards on viewports 768px and wider, reusing the optimistic move from 6.2. Verify with a manual drag in the browser.
- [ ] 7.2 While dragging, dim forbidden columns with the icon and reason, and show the "Marcar como perdida" drop area, which opens the lost dialog. Verify against W2 in the browser, with the mouse and with the keyboard sensor.
- [ ] 7.3 Open the missing-data dialog (W9) when a card with `missing` is dropped on Apresentação de Orçamento, and restore the card on cancel. Verify both paths in the browser.

## 8. Mobile (`feat/funnel-mobile-minimal`)

Minimal scope: the screens stay usable at 375px without horizontal page scroll. The dedicated mobile layout (bottom bar, stage tabs, filters bottom sheet, detail tabs, fixed action bar) is out of scope and goes to the README as a next step.

- [x] 8.1 Wrap the top bar below 768px: logo and actions on the first row, nav tabs on a second row; icon-only "Nova oportunidade", hidden bell and visually hidden "Entrando como:" below 640px. Verify at 375px.
- [x] 8.2 Make the opportunity panel full screen below 768px, keeping the close button, Escape, and menus and dialogs above it. Verify at 375px.
- [x] 8.3 Use 16px side gutters below 768px on the board, toolbar, and detail page, and keep toasts inside the viewport. Verify at 375px.

## 9. Integration check

- [ ] 9.1 Walk the main flow as Ana and then as Marcos, at 1280px and 375px:
  - find OPP-2004 through "Precisam de atenção";
  - open the panel, then the page;
  - comment, mark as followed up, snooze, move, mark as lost.

  Confirm that `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review, and sync its specs into `openspec/specs/`.
- Propose `add-funnel-test-coverage` with `/opsx:propose`: component and flow tests from this change's spec scenarios.
