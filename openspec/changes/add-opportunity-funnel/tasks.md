# Tasks

## 1. Prototype review

- [ ] 1.1 Fold the Claude Design prototype feedback into this change:
  - visual adjustments into `@theme` and the design-system spec;
  - layout or flow changes into `design.md` and the specs.

  Verify that `openspec validate add-opportunity-funnel` passes and `npm test` stays green.
- [x] 1.2 Apply the round 1 token changes in `app/globals.css`: `paper-shade` #EAF2EE and `border` #D8E3DC. Add `lost-solid` on `lost-bg` (3:1) to the contrast pairs. Verify with `npm test` and on `/design-tokens`.

## 2. Data client and mock

- [ ] 2.1 Define the domain types and the API client contract in `lib/api/`:
  - opportunity, stage, alert, gift item, activity entry, demo user;
  - list, get, move, create, update, comment, follow-up, snooze, mark lost.

  Verify with `npx tsc --noEmit`.
- [ ] 2.2 Build the in-repo mock: case data, fixed today of 15/10/2026, example deadlines, owner filtering by role, transition rules, and priority. Verify with unit tests for:
  - owner filtering;
  - Fechamento only from Forecast;
  - the missing value or item rule;
  - priority order;
  - the 30-day limit on snooze and next date;
  - the snooze count reset on follow-up.
- [ ] 2.3 Store the demo user in a cookie and send it as `X-User-Id` on every client call. Verify with a test that a request carries the selected user.

## 3. App shell

- [ ] 3.1 Build the top bar with the logo, tabs, "Nova oportunidade", the bell slot, and the "Entrando como" selector labeled as demo mode. Verify with a component test of the active tab's `aria-current` and the manager-only "Time" tab.
- [ ] 3.2 Add the mobile bottom bar and the menu that holds the identity selector below 768px. Verify against W4 in the browser at 375px.
- [ ] 3.3 Add the routes: `/` redirects to `/oportunidades`, and `/retornos` and `/time` are placeholders. Replace the create-next-app placeholder. Verify in the browser and with `npm run build`.

## 4. Board

- [ ] 4.1 Render the five columns with their headers (name, count, alert count) and the cards per W1:
  - the owner initial for managers only;
  - the state strip at the card's footer;
  - alert and near event on one line;
  - no "Fechada" badge in Fechamento.

  Verify with component tests for the card content, omitted empty fields, the shared alert and event line, and the header alert count.
- [ ] 4.2 Order cards by priority, with "Ordenar por: Valor" as the alternative. Limit Fechamento to the last 30 days, with "Ver todas". Verify with tests for the order and the Fechamento cutoff.
- [ ] 4.3 Add the toolbar:
  - search that ignores case and accents;
  - "Precisam de atenção" and the situation chips;
  - the owner filter (manager only);
  - the "Mostrar perdidas" checkbox, showing losses from the last 30 days at the end of their column, outside the count.

  Keep all of it in the URL. Verify with tests (including the 30-day cutoff for losses) and by reloading a shared URL in the browser.
- [ ] 4.4 Add the loading, error, no-match, no-opportunities, and empty-column states with the `components/feedback/` patterns. Verify with component tests for each state's text and action.
- [ ] 4.5 Build the mobile board with scrollable stage tabs (Contato · Orçamento · Follow-up · Forecast · Fechamento) and one column at a time. Verify against W4 at 375px.

## 5. Moving cards

- [ ] 5.1 Add drag and drop with `@dnd-kit` (version checked against React 19) on viewports 768px wide and wider:
  - optimistic move;
  - rollback with the API message on rejection.

  Verify with a test of the rollback path and a manual drag in the browser.
- [ ] 5.2 While dragging, dim forbidden columns with the icon and reason, and show the "Marcar como perdida" drop area. Verify against W2 in the browser and with the keyboard sensor.
- [ ] 5.3 Open the missing-data dialog (W9) when a card without a value or item is dropped on Apresentação de Orçamento. Save the data and move the card on confirm, and restore the card on cancel. Verify with component tests for both paths.

## 6. Side panel and detail page

- [ ] 6.1 Build the side panel (W5):
  - `op=` in the URL;
  - summary, alert reason, and "Não informado" for empty fields;
  - "Vencida há N dias" for an expired proposal;
  - the blocked-advance notice;
  - the actions, with "Marcar como retornado" as the full-width main action.

  While the panel is open, the board narrows and scrolls horizontally. Clicking the open card again navigates to the page. Verify with tests for the URL, the second click, keyboard Enter, and the expired-proposal text.
- [ ] 6.2 Build the "Mover para…" menu with disabled stages and their reasons. Verify with a test that a disabled stage shows its reason and cannot be picked.
- [ ] 6.3 Build the detail page (W6, W7): header with actions, Dados with gift items, and the Atividade timeline, newest first, with type icons. On mobile, Dados and Atividade become tabs. Verify with a test of the timeline order and in the browser at 375px.
- [ ] 6.4 Add comments: a send button that stays disabled while the box is empty, and no edit or delete. Verify with component tests.
- [ ] 6.5 Build the edit modal (W8): field validation, add and remove gift items, the suggested value that the user can override, and full screen on mobile. Verify with tests for the suggestion and the validation errors.

## 7. Dialogs

- [ ] 7.1 Build the lost dialog (W10): a required reason, a detail field required for "Outro", and lost tones. Verify with tests for both validation messages.
- [ ] 7.2 Build the "Nova oportunidade" dialog (W11): the owner is locked for a salesperson and a select for a manager. The new opportunity starts in Primeiro Contato and its panel opens. Verify with tests for both roles.
- [ ] 7.3 Build "Marcar como retornado" (W12): channel buttons, summary, next date up to 30 days, and the default-deadline hint. Verify with tests for the hint text and the 30-day limit.
- [ ] 7.4 Build "Adiar" (W13): a required date up to 30 days, an optional reason, and the second-snooze escalation warning. Verify with tests for the warning and the required date.
- [ ] 7.5 Hide "Marcar como retornado" and "Adiar" for opportunities in Fechamento and Perdida. Verify with a panel test.

## 8. Integration check

- [ ] 8.1 Walk the main flow as Ana and then as Marcos, at 1280px and 375px:
  - find OPP-2004 through "Precisam de atenção";
  - open the panel, then the page;
  - comment, mark as followed up, snooze, move, mark as lost.

  Confirm that `npm test`, `npm run lint`, and `npm run build` pass.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review, and sync its specs into `openspec/specs/`.
