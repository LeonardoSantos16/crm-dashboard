# Proposal

## Why

The CRM has a design system but no screens. The case asks for a Kanban funnel where a salesperson lists, searches, filters, and opens opportunities and moves them between stages, and it is judged on whether the salesperson finds the deal to work on today. This change defines those screens as wireframes, so they can be prototyped in Claude Design before any screen code is written.

The follow-up automation (problem 4 of the case) shapes these screens. Its rules come from the decision document "Case CRM — Automação & Qualidade: decisões" (16 decisions): an alert fires on inactivity in the current stage, priority is the share of the stage deadline already used, and the salesperson can mark an alert as followed up or snooze it.

## What Changes

- **App shell:**
  - A dark top bar with the "Nobre CRM" logo and the tabs Oportunidades · Retornos · Time. Time is shown to managers only.
  - A "Nova oportunidade" button, a notification bell slot, and a demo identity selector ("Entrando como").
  - On mobile, the tabs move to a fixed bottom bar.
- **Identity without login:** the selected user is sent to the API with every request, and the API filters opportunities by role: a salesperson sees their own, a manager sees the team's. No login screen is built.
- **Oportunidades (Kanban):**
  - Columns: the five stages. Fechamento shows the last 30 days only.
  - Column header: stage name, card count, and alert count.
  - Card: code, company, value, gift · quantity, alert badge, and the client event date when it is near.
  - Cards are ordered by priority inside each column.
  - Toolbar: search, filters, and sort, all kept in the URL.
  - Moving a card: drag and drop, with forbidden columns marked during the drag; a dialog to fill in missing data; a drop area to mark the card as lost.
  - All loading, error, and empty states.
  - On mobile, one column at a time with stage tabs.
- **Opportunity detail:**
  - A side panel opens on the first click, with a summary and actions.
  - A full page opens on the second click or from "Abrir detalhes": data, gift items, and an Activity timeline with comments and history.
  - Editing uses a modal.
- **Dialogs:**
  - Marcar como retornado.
  - Adiar.
  - Marcar como perdida (reason list plus detail).
  - Nova oportunidade.
- **Wireframes:** ASCII wireframes for every screen, state, and dialog above, desktop and mobile, in `design.md`. They are the input for the Claude Design prototype.

## Capabilities

### New Capabilities

- `app-shell`: the top bar, navigation tabs, demo identity selector, and role-based visibility of tabs and data.
- `opportunity-board`: the Kanban of opportunities: columns, cards, ordering, search, filters, stage moves by drag and drop, and the board's loading, error, and empty states.
- `opportunity-detail`: viewing and editing one opportunity: side panel, detail page, edit modal, gift items, activity timeline with comments, move menu, lost dialog, and creating an opportunity.
- `follow-up-actions`: showing why an opportunity needs follow-up, and the "Marcar como retornado" and "Adiar" actions with their dialogs.

### Modified Capabilities

None. The screens follow `design-system` without changing its requirements.

## Out of Scope

- **Second change (`add-follow-up-alerts`):** the Retornos list, the Time view, and the notification menu. This change only reserves their tabs and the bell slot.
- **Stage-return rules:** which backward moves are allowed (for example, Follow-up → Apresentação de Orçamento) is still open. The wireframes show the generic "forbidden column" pattern, and the API owns the rule.
- **Real stage deadlines:** the numbers in the wireframes are examples.
- **Lead intake:** leads come in manually, through "Nova oportunidade". Automatic intake from the website goes in the README as a future step.
- **Real authentication** (JWT/SSO). The README describes it.
- **Comment management:** editing, deleting, and @mentions.
- **Wider filters:** value range and event period filters.
- **API, database, and alert worker:** the backend that computes alerts and validates transitions.

## Impact

- **Docs:** this change's `design.md` holds the wireframes. Claude Design receives it together with `openspec/specs/design-system/spec.md` and the `@theme` block of `app/globals.css`.
- **Prototype feedback:** visual adjustments that come back from Claude Design go into `@theme` and the design-system spec. Layout or flow changes are folded into this change before it is applied.
- **Code, when applied:**
  - The root route (`app/page.tsx`, still the create-next-app placeholder) is replaced by the Oportunidades screen.
  - New routes, components, and a data client go under `app/` and `components/`.
- **Dependencies:** possibly a drag-and-drop library, chosen in `design.md`.
