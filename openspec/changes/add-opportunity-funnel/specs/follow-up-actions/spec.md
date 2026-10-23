# Spec Delta

## Purpose

Defines how the interface shows why an opportunity needs a follow-up and how the salesperson records one: marking it as followed up or snoozing it, so a forgotten deal is visible and every decision leaves a record.

## ADDED Requirements

### Requirement: Alert reason
Wherever an opportunity's alert is shown in detail (panel, detail page), the interface SHALL state the reason in words: idle days and the stage deadline, the snooze end date, or the escalation. Only the most severe alert is shown, per the design-system order.

#### Scenario: Idle reason
- **WHEN** an opportunity has been idle for 6 days in a stage with a 3-day deadline
- **THEN** the alert reads "Parada há 6 dias · prazo da etapa: 3 dias"

#### Scenario: Snoozed reason
- **WHEN** an opportunity is snoozed until 25/10/2026
- **THEN** the alert reads "Adiada até 25/10"

### Requirement: Mark as followed up
The user SHALL be able to mark an open opportunity as followed up. The dialog SHALL offer three optional fields: channel (Ligação, WhatsApp, E-mail, Reunião, as single-choice buttons), summary, and next date. Confirming SHALL always record the date of the follow-up.

#### Scenario: Quick follow-up
- **WHEN** the user opens "Marcar como retornado" and confirms without filling anything
- **THEN** the follow-up is recorded with today's date and appears in the activity timeline

#### Scenario: Follow-up with channel and summary
- **WHEN** the user picks "WhatsApp", writes "Cliente pediu nova cor", and confirms
- **THEN** the timeline entry shows the WhatsApp channel and the summary

### Requirement: Default next date is explained
The follow-up dialog SHALL state, next to the date field, what happens when no date is chosen, naming the current stage and its deadline. The chosen date SHALL be at most 30 days ahead.

#### Scenario: Hint text
- **WHEN** the follow-up dialog opens for a Follow-up opportunity whose stage deadline is 3 days
- **THEN** the date field shows "Sem data, o alerta volta em 3 dias (prazo de Follow-up)"

#### Scenario: Date beyond limit
- **WHEN** the user picks a date 40 days ahead
- **THEN** the dialog says "Escolha uma data em até 30 dias" and does not confirm

### Requirement: Snooze
The user SHALL be able to snooze an open opportunity. The dialog SHALL require a date at most 30 days ahead and offer an optional reason.

#### Scenario: Snooze confirmed
- **WHEN** the user snoozes OPP-2004 until 25/10/2026
- **THEN** the opportunity shows the snoozed badge "Adiada até 25/10", and the timeline records the snooze

#### Scenario: Date required
- **WHEN** the user confirms the snooze dialog without a date
- **THEN** the dialog says "Escolha até quando adiar"

### Requirement: Escalation warning on second snooze
When the snooze would be the second in a row without a follow-up in between, the dialog SHALL warn, with an icon and text, that the opportunity will be escalated to the manager.

#### Scenario: Second snooze
- **WHEN** the user opens "Adiar" on an opportunity already snoozed once since its last follow-up
- **THEN** the dialog shows "Este é o 2º adiamento seguido. A oportunidade será escalonada para o gestor."

### Requirement: Actions only on open opportunities
"Marcar como retornado" and "Adiar" SHALL NOT be offered for opportunities in Fechamento or Perdida.

#### Scenario: Closed opportunity
- **WHEN** the panel of an opportunity in Fechamento opens
- **THEN** it offers neither "Marcar como retornado" nor "Adiar"
