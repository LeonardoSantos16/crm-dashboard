# Proposal

## Why

The CRM has a design system but no screens. The case asks for a Kanban funnel where a salesperson lists, searches, filters, and opens opportunities and moves them between stages, and it is judged on whether the salesperson finds the deal to work on today. This change defines those screens as wireframes, prototyped in Claude Design, and builds them on top of the `crm-api`, the separate REST API that now exists. The front consumes the contract in `docs/integracao-api/`.

The follow-up automation (problem 4 of the case) shapes these screens. Its rules come from the decision document "Case CRM — Automação & Qualidade: decisões" (16 decisions): an alert fires on inactivity in the current stage, priority is the share of the stage deadline already used, and the salesperson can mark an alert as followed up or snooze it.

## What Changes

- **App shell:**
  - A dark top bar with the "Nobre CRM" logo, the Oportunidades tab, and a demo identity selector ("Entrando como").
  - On mobile, the bar wraps into two rows so the page never scrolls sideways.
- **Identity without login:** the selected user is sent to the API with every request, and the API filters opportunities by role: a salesperson sees their own, a manager sees the team's. No login screen is built.
- **Oportunidades (Kanban):**
  - Columns: the five stages. Fechamento shows the last 30 days only.
  - Column header: stage name, card count, and alert count.
  - Card: code, company, value, gift · quantity, alert badge, and the client event date when it is near.
  - Cards are ordered by priority inside each column.
  - Toolbar: search, filters, and sort, all kept in the URL.
  - Moving a card: drag and drop on desktop, and the "Mover para…" menu everywhere, which explains blocked moves and opens a dialog to fill in missing data.
  - All loading, error, and empty states.
  - On mobile, the board scrolls sideways inside its own area.
- **Opportunity detail:**
  - A side panel opens on the first click, with a summary and actions. On mobile it fills the screen.
  - A full page opens on the second click or from "Abrir detalhes": data, gift items, and an Activity timeline with comments and history.
- **Dialogs:**
  - Marcar como retornado.
  - Adiar.
  - Marcar como perdida (reason list plus detail).
  - Completar dados (missing data before a move).
- **Wireframes:** ASCII wireframes for every screen, state, and dialog above, desktop and mobile, in `design.md`. They are the input for the Claude Design prototype.

## Capabilities

### New Capabilities

- `app-shell`: the top bar, navigation, demo identity selector, and role-based visibility of data.
- `opportunity-board`: the Kanban of opportunities: columns, cards, ordering, search, filters, stage moves by drag and drop, and the board's loading, error, and empty states.
- `opportunity-detail`: viewing one opportunity: side panel, detail page, gift items, activity timeline with comments, move menu, missing-data dialog, and lost dialog.
- `follow-up-actions`: showing why an opportunity needs follow-up, and the "Marcar como retornado" and "Adiar" actions with their dialogs.

### Modified Capabilities

- `design-system`: from the Claude Design prototype review (round 1):
  - `paper-shade` becomes #EAF2EE and `border` becomes #D8E3DC, so columns, cards, and the page background separate;
  - the spec states that `-solid` state tones are for icons and borders only, never text.

## Out of Scope

- **Second change (`add-follow-up-alerts`):** the Retornos list, the Time view, and the notification menu, with their tabs and the bell.
- **Creating and editing opportunities:** the "Nova oportunidade" dialog and the edit modal (wireframes W8 and W11) are left for a later change. Opportunities come from the API seed. Lead intake, manual or from the website, goes in the README as a future step.
- **Dedicated mobile layout:** bottom bar, stage tabs, filters bottom sheet, and detail tabs. This change only keeps the screens usable at 375px.
- **Drag extras:** marking forbidden columns during the drag, the drop area to mark a card as lost, and opening the missing-data dialog on drop. A blocked drop restores the card and explains why in a toast.
- **Real authentication** (JWT/SSO). The README describes it.
- **Comment management:** editing, deleting, and @mentions.
- **Wider filters:** value range and event period filters.
- **API, database, and alert worker:** they live in the separate `crm-api` repository, which computes alerts, stage deadlines, ordering, and allowed moves.
- **Component and flow tests:** this change adds no new tests. A later change, `add-funnel-test-coverage`, covers the spec scenarios.

## Impact

- **Docs:** this change's `design.md` holds the wireframes. Claude Design receives it together with `openspec/specs/design-system/spec.md` and the `@theme` block of `app/globals.css`.
- **Prototype feedback:** visual adjustments that come back from Claude Design go into `@theme` and the design-system spec. Layout or flow changes are folded into this change before it is applied.
- **Code, when applied:**
  - `app/` moves to `src/app/`, and the code follows `docs/padroes.md`: routes in `src/app/`, shared components in `src/components/`, hooks in `src/hooks/`, and the API client in `src/lib/`.
  - The root route (still the create-next-app placeholder) is replaced by the Oportunidades screen.
  - The design-system tests scan `src/`.
- **Dependencies:** `@tanstack/react-query`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, and `@dnd-kit`.
