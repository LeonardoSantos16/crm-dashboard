# Proposal

## Why

Problem 4 of the case: with a high volume of deals, a salesperson forgets to follow up with leads. The Kanban (`add-opportunity-funnel`) shows alerts per stage, but a salesperson planning the day needs one list of what to follow up on, across stages and in priority order. The manager needs to see who is overloaded without reading every alert. This change defines those screens as wireframes, together with the in-app notifications that point to them.

The rules come from the decision document "Case CRM — Automação & Qualidade: decisões": priority by share of the deadline used (decision 7), snooze (8), the manager's aggregated view (9), escalation (10), and the notification worker (5).

## What Changes

- **Retornos screen** (salesperson):
  - **Sections:** Atrasadas (escalated included) in priority order, Vencem em até 2 dias, and a collapsed Adiadas section.
  - **Row:** alert badge, code and company, stage, reason, value, and inline "Retornado" and "Adiar" actions.
  - **Toolbar:** search, filters, and sort.
  - **States:** an "all caught up" empty state.
  - **Mobile:** card layout with a filter sheet.
- **Retornos for managers:** only the team's escalated opportunities, each with its owner.
- **Time screen** (manager only):
  - one row per salesperson with Ativas · Atrasadas · Escalonadas · Adiadas, ordered by Escalonadas;
  - each number links to Retornos already filtered;
  - card layout on mobile.
- **Notifications:**
  - the bell shows a dot (no count) when there are unread notifications;
  - its menu lists notifications newest first, and each one opens the opportunity's panel;
  - "Marcar todas como lidas";
  - types: new alert, snooze ended, and escalation (manager only).
- **Wireframes:** ASCII wireframes for every screen and state above, desktop and mobile, in `design.md`. They go to Claude Design together with those of `add-opportunity-funnel`.

## Capabilities

### New Capabilities

- `follow-up-queue`: the Retornos list. What enters it, its sections and order, row actions, search and filters, and the manager's escalated-only view.
- `team-overview`: the manager's aggregated view of follow-up load per salesperson, with drill-down into Retornos.
- `notifications`: the in-app notification bell and menu. Unread signal, notification types, mark as read, and navigation to the opportunity.

### Modified Capabilities

None. The new capabilities from `add-opportunity-funnel` (`app-shell`, `opportunity-detail`, `follow-up-actions`) are reused as they are: the tabs, the side panel, and the "Marcar como retornado" and "Adiar" dialogs.

## Out of Scope

- E-mail notifications and the hourly worker that sends them. They are backend work, described in the README.
- Reassigning an opportunity to another salesperson.
- A lost-reason chart or other reports in Time.
- Notification preferences and push notifications.

## Impact

- **Docs:** this change's `design.md` holds the wireframes, and it goes to Claude Design with the first change's.
- **Code, when applied:**
  - fills in the `/retornos` and `/time` routes, which are placeholders after `add-opportunity-funnel`;
  - turns the bell slot into the notification menu;
  - adds queue, team, and notification calls to the data client and its mock.
- **Order:** this change is applied after `add-opportunity-funnel`, because it reuses its shell, panel, and dialogs.
