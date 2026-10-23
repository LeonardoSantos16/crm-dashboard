# Spec Delta

## Purpose

Defines the Retornos screen: one cross-stage list of the opportunities a salesperson must follow up on, in priority order, so the deal to work on today is at the top and the follow-up can be recorded without leaving the list.

## ADDED Requirements

### Requirement: Retornos sections
For a salesperson, Retornos SHALL show three sections, in this order:
- **Atrasadas:** attention and escalated opportunities.
- **Vencem em até 2 dias:** open opportunities whose follow-up is due within 2 days and that have no alert yet.
- **Adiadas:** snoozed opportunities. This section is collapsed by default.

Each section header SHALL show its count.

#### Scenario: Sections and counts
- **WHEN** Ana has 2 overdue, 2 due soon, and 1 snoozed opportunity
- **THEN** Retornos shows "Atrasadas · 2", "Vencem em até 2 dias · 2", and a collapsed "Adiadas · 1"

#### Scenario: Final opportunities excluded
- **WHEN** an opportunity is in Fechamento or Perdida
- **THEN** it appears in no Retornos section

### Requirement: Order within sections
Atrasadas SHALL be ordered by priority by default: the share of the stage deadline used, then the estimated value. The user SHALL be able to sort by Valor or by Dias parada instead. Vencem em até 2 dias SHALL be ordered by due date, soonest first. Adiadas SHALL be ordered by snooze end date.

#### Scenario: Priority across stages
- **WHEN** OPP-2010 is at 300% of its Primeiro Contato deadline and OPP-2011 is at 216% of its Follow-up deadline
- **THEN** OPP-2010 is listed above OPP-2011

### Requirement: Row content
Each row SHALL show the alert badge, code and company, stage, the reason in words, and the estimated value. For managers, it SHALL also show the owner.

#### Scenario: Overdue row
- **WHEN** OPP-2010 has been idle for 3 days in Primeiro Contato, whose deadline is 1 day
- **THEN** its row shows the attention badge, "OPP-2010 · Farmácia Bem Estar", "Primeiro Contato", "Parada há 3 dias · prazo 1 dia", and its value

#### Scenario: Due-soon row
- **WHEN** an opportunity's follow-up is due today
- **THEN** its row in Vencem em até 2 dias reads "Vence hoje"

### Requirement: Inline actions
Each row in Atrasadas and Vencem em até 2 dias SHALL offer "Retornado" and "Adiar", which open the follow-up and snooze dialogs. After either action, the row SHALL leave or change section without a page reload.

#### Scenario: Follow-up from the list
- **WHEN** the user marks OPP-2010 as followed up from its row
- **THEN** OPP-2010 leaves Atrasadas and the section count drops by one

#### Scenario: Snooze from the list
- **WHEN** the user snoozes OPP-2011 from its row
- **THEN** OPP-2011 moves to Adiadas

### Requirement: Row opens the panel
Activating a row outside its action buttons SHALL open the same opportunity side panel used on the board.

#### Scenario: Open panel
- **WHEN** the user clicks the OPP-2011 row
- **THEN** OPP-2011's side panel opens over Retornos

### Requirement: Search and filters
Retornos SHALL offer the following, applied to every section:
- a search by code or company;
- situation chips: Atrasada, Escalonada, Adiada;
- a stage filter;
- an owner filter, for managers only;
- the sort control.

The state SHALL be kept in the URL.

#### Scenario: Stage filter
- **WHEN** the user filters by Follow-up
- **THEN** every section shows only Follow-up opportunities, and the counts update

### Requirement: Nothing pending
When Atrasadas is empty, Retornos SHALL show a success message in its place. The other sections SHALL stay visible when they have items.

#### Scenario: All caught up
- **WHEN** Ana has no overdue opportunity and one due tomorrow
- **THEN** Retornos shows "Nenhum retorno pendente. Tudo em dia." with a success icon, and Vencem em até 2 dias still lists the one due tomorrow

### Requirement: Manager view of Retornos
For a manager, Retornos SHALL list only the team's escalated opportunities, under the title "Escalonadas do time", each with its owner. The manager SHALL have the same row actions and panel.

#### Scenario: Manager sees escalated only
- **WHEN** Marcos opens Retornos while the team has 1 escalated and 3 attention opportunities
- **THEN** the list shows only the escalated one, with its owner

### Requirement: Retornos loading and error
Retornos SHALL use the design-system loading and error patterns. Loading SHALL show skeleton rows, and a failed load SHALL show "Não foi possível carregar os retornos." with "Tentar novamente".

#### Scenario: Failed load
- **WHEN** loading Retornos fails
- **THEN** the list area shows "Não foi possível carregar os retornos." and a "Tentar novamente" button

### Requirement: Mobile Retornos
On viewports narrower than 768px, each row SHALL become a stacked card with the badge, company, reason, and both actions. Filters SHALL open in a bottom sheet.

#### Scenario: Mobile card
- **WHEN** Retornos opens on a 375px-wide screen
- **THEN** each opportunity is a card with "Retornado" and "Adiar" buttons at least 44px tall
