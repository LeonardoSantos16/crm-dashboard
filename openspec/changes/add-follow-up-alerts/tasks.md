# Tasks

## 1. Prototype review

- [ ] 1.1 Fold the Claude Design feedback for R1 to R5, T1, T2, and N1 into this change, and confirm or revise the assumptions in design.md decision 7. Verify that `openspec validate add-follow-up-alerts` passes.

## 2. Data client and mock

- [ ] 2.1 Add the calls to the client contract:
  - queue (sections with due dates);
  - team summary;
  - notifications (list, mark one read, mark all read).

  Verify with `npx tsc --noEmit`.
- [ ] 2.2 Extend the mock:
  - the illustrative opportunities OPP-2010 to OPP-2013;
  - the due-date rule from decision 2;
  - the team counts without overlap;
  - manager-only team data;
  - notifications per role.

  Verify with unit tests for:
  - section membership;
  - the due date after a follow-up with and without a chosen date;
  - non-overlapping team counts;
  - a salesperson rejected from team data;
  - no escalation notifications for salespeople.

## 3. Retornos

- [ ] 3.1 Build the salesperson Retornos (R1, R2): the three sections with counts, Adiadas collapsed, and the order rules. Verify with component tests for the sections, the order, and the "Nenhum retorno pendente. Tudo em dia." state.
- [ ] 3.2 Add the inline "Retornado" and "Adiar" actions, reusing the funnel dialogs, and the row click that opens the side panel. Verify with a test that a followed-up row leaves Atrasadas and the count drops.
- [ ] 3.3 Add the search, filters, and sort, kept in the URL. Verify with tests and by opening a Time drill-down link.
- [ ] 3.4 Build the manager view (R3), "Escalonadas do time", with the owner column. Verify with a component test that attention rows are excluded.
- [ ] 3.5 Add the loading and error states (R4) and the mobile cards with the filter sheet (R5). Verify with component tests and in the browser at 375px.

## 4. Time

- [ ] 4.1 Build `/time` (T1):
  - the table ordered by Escalonadas, then Atrasadas;
  - the total row;
  - non-zero counts as links to filtered Retornos;
  - salespeople redirected to `/oportunidades`.

  Verify with tests for the order, the links, the zero-as-text rule, and the redirect.
- [ ] 4.2 Add the loading, error, and "Nenhum vendedor no time." states and the mobile cards (T2). Verify with component tests and at 375px.

## 5. Notifications

- [ ] 5.1 Replace the bell slot with the notification button:
  - the dot only when there are unread items;
  - the accessible name and tooltip;
  - a refresh on window focus and on an interval.

  Verify with component tests for both accessible names.
- [ ] 5.2 Build the menu (N1):
  - items newest first, each with icon, sentence, relative time, and "Não lida";
  - opening an item marks it read and opens the panel;
  - "Marcar todas como lidas";
  - an empty state;
  - a full-screen sheet on mobile.

  Verify with component tests for each behavior.

## 6. Integration check

- [ ] 6.1 Walk the follow-up flow:
  - as Ana: see OPP-2010 at the top of Retornos, mark it as followed up from the row, snooze OPP-2011, and check the bell;
  - as Marcos: open Time, follow Carla's Escalonadas link to Retornos, and open the panel.

  Do it at 1280px and 375px, and confirm that `npm test`, `npm run lint`, and `npm run build` pass.

## Workflow follow-up

- Apply after `add-opportunity-funnel` is applied.
- Archive with `/opsx:archive` after review, and sync its specs into `openspec/specs/`.
