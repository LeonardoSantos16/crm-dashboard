# Spec Delta

## Purpose

Defines the in-app notifications that tell a user, without leaving the current screen, that an opportunity needs a follow-up, that a snooze ended, or (for managers) that an opportunity was escalated.

## ADDED Requirements

### Requirement: Unread signal without a count
The bell SHALL show a dot when there are unread notifications and no dot otherwise. It SHALL NOT show a number. The unread state SHALL also be exposed as text to assistive technology and as a tooltip.

#### Scenario: Unread notifications
- **WHEN** the user has 3 unread notifications
- **THEN** the bell shows a dot, its accessible name is "Notificações. Há notificações novas", and its tooltip reads "Há notificações novas"

#### Scenario: All read
- **WHEN** the user has no unread notification
- **THEN** the bell shows no dot and its accessible name is "Notificações"

### Requirement: Notification menu
Activating the bell SHALL open a menu that lists notifications, newest first. Each item SHALL show:
- a type icon;
- a sentence naming the opportunity;
- a relative time;
- for unread items, a dot and the text "Não lida".

#### Scenario: Menu item
- **WHEN** an unread new-alert notification for OPP-2004 is 2 hours old
- **THEN** its item shows the attention icon, "OPP-2004 · Agência Pulso está parada há 6 dias", "há 2 h", and "Não lida"

### Requirement: Notification types
The system SHALL notify on these events:
- a new alert on the user's opportunity;
- the end of a snooze on the user's opportunity;
- for managers only, an escalation on the team.

#### Scenario: Salesperson does not get escalations
- **WHEN** OPP-2004 is escalated
- **THEN** the manager receives an escalation notification and no other salesperson does

### Requirement: Open from notification
Activating a notification SHALL mark it as read and open the opportunity's side panel.

#### Scenario: Open
- **WHEN** the user activates the OPP-2004 notification
- **THEN** OPP-2004's panel opens and the item no longer shows "Não lida"

### Requirement: Mark all as read
The menu SHALL offer "Marcar todas como lidas".

#### Scenario: Mark all
- **WHEN** the user activates "Marcar todas como lidas"
- **THEN** no item shows "Não lida" and the bell dot disappears

### Requirement: Empty menu
With no notifications, the menu SHALL show "Nenhuma notificação." in neutral tones.

#### Scenario: Empty
- **WHEN** the user has never received a notification
- **THEN** the menu shows "Nenhuma notificação."
