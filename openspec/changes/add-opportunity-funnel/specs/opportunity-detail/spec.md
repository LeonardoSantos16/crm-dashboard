# Spec Delta

## Purpose

Defines how a user views, moves, and closes as lost a single opportunity: a quick side panel, a full detail page with an activity timeline and comments, and the dialogs those flows need.

## ADDED Requirements

### Requirement: Side panel on first click
Activating a card SHALL open a side panel over the board with the opportunity's summary, and the board SHALL stay visible. The URL SHALL identify the open opportunity. On viewports narrower than 768px the panel SHALL fill the screen.

#### Scenario: Open panel
- **WHEN** the user clicks the OPP-2003 card
- **THEN** a side panel opens with OPP-2003's summary, and the URL contains `op=2003` (OPP-2003's id)

#### Scenario: Every column stays reachable
- **WHEN** the panel is open on a 1280px-wide screen
- **THEN** the board narrows to the remaining width and scrolls horizontally, so Forecast and Fechamento can still be reached

#### Scenario: Open from link
- **WHEN** a user opens a board link that contains `op=2003` (OPP-2003's id)
- **THEN** the board loads with OPP-2003's panel open

### Requirement: Detail page on second click
Activating the card whose panel is already open, or the panel's "Abrir detalhes" button, SHALL navigate to the opportunity's detail page. The keyboard SHALL follow the same sequence: Enter opens the panel, and Enter again opens the page.

#### Scenario: Second click
- **WHEN** OPP-2003's panel is open and the user clicks the OPP-2003 card again
- **THEN** the browser navigates to OPP-2003's detail page

#### Scenario: Button is always available
- **WHEN** a panel is open
- **THEN** it shows an "Abrir detalhes" button

### Requirement: Panel content
The panel SHALL show these items:
- the alert with its reason;
- company, contact, owner, stage, estimated value, gift with quantity;
- last contact, proposal expiry, and client event dates;
- the actions Marcar como retornado, Adiar, Mover para…, Marcar como perdida, and Abrir detalhes.

#### Scenario: Panel of an idle opportunity
- **WHEN** the panel of an opportunity idle for 6 days in a stage with a 3-day deadline opens
- **THEN** it shows the attention badge and "Parada há 6 dias · prazo da etapa: 3 dias"

### Requirement: Missing fields are visible in detail views
In the panel and the detail page, an empty field SHALL be shown as "Não informado". When missing data blocks the next stage, a notice SHALL say which data is missing.

#### Scenario: Blocked advance
- **WHEN** a Primeiro Contato opportunity has no estimated value and no gift item
- **THEN** the panel shows "Falta valor estimado e item de brinde para enviar orçamento" with an icon

#### Scenario: Empty date
- **WHEN** an opportunity has no proposal expiry date
- **THEN** the panel shows "Não informado" for it, never a dash

### Requirement: Expired proposal notice
In the panel and the detail page, a proposal expiry date in the past SHALL show an icon and "Vencida há N dias" next to the date. It SHALL NOT be an alert state: it does not change priority, counts, or badges.

#### Scenario: Expired proposal
- **WHEN** today is 15/10/2026 and OPP-2002's proposal expired on 13/10/2026
- **THEN** its panel shows "13/10/2026" with an icon and "Vencida há 2 dias", and its alert badge is unchanged

#### Scenario: Valid proposal
- **WHEN** the proposal expires on 22/10/2026
- **THEN** only the date is shown

### Requirement: Move menu
The panel and the detail page SHALL offer "Mover para…", a menu of stages. Stages the opportunity cannot move to SHALL be disabled and show the reason. This is the way to move on mobile and with the keyboard.

#### Scenario: Disabled stage
- **WHEN** a Follow-up opportunity opens "Mover para…"
- **THEN** Fechamento is disabled with "Só a partir de Forecast"

### Requirement: Detail page layout
The detail page SHALL show a header with a link back to Oportunidades, the code and company, the alert badge, and the actions. Below it, two areas: Dados (data, dates, and gift items) and Atividade. Below 1024px the two areas SHALL stack.

#### Scenario: Stacked areas
- **WHEN** the detail page opens on a 375px-wide screen
- **THEN** Dados is shown above Atividade, and the page has no horizontal scroll

### Requirement: Activity timeline
The Atividade area SHALL show, newest first, in one timeline: creation, comments, stage changes, follow-ups, snoozes, escalations, and the loss. Each entry SHALL show its author when there is one (seed entries and escalations have none), its date and time, and an icon for its type.

#### Scenario: Stage change entry
- **WHEN** OPP-2003 moved from Apresentação de Orçamento to Follow-up
- **THEN** the timeline shows an entry with the stage icon, "Apresentação de Orçamento → Follow-up", the author, and the date

### Requirement: Comments
The Atividade area SHALL have a comment box at the top. A comment SHALL be added to the timeline with its author and time. Comments SHALL NOT be editable or deletable.

#### Scenario: Add comment
- **WHEN** the user writes "Cliente pediu amostra" and sends it
- **THEN** the comment appears at the top of the timeline with the author and time, and offers no edit or delete action

#### Scenario: Empty comment
- **WHEN** the user tries to send an empty comment
- **THEN** nothing is sent and the send button stays disabled

### Requirement: Missing data dialog
When "Mover para…" targets Apresentação de Orçamento and the opportunity lacks an estimated value or a gift item, the menu SHALL open a dialog that asks only for the missing data, saves it, and moves the opportunity.

#### Scenario: Move without gift item
- **WHEN** the user picks Apresentação de Orçamento for OPP-2001, which has no gift item
- **THEN** a dialog asks for the gift item, and confirming it saves the item and moves the opportunity

#### Scenario: Cancel
- **WHEN** the user cancels that dialog
- **THEN** the opportunity stays in its stage and nothing is saved

### Requirement: Gift items
When the gift item is missing, the missing data dialog SHALL ask for one item: gift, quantity, and unit value. The item's total SHALL be suggested as the estimated value, and the user SHALL be able to override it.

#### Scenario: Suggested value
- **WHEN** the user adds 300 "Caneca personalizada" at R$ 15,00
- **THEN** the estimated value field suggests R$ 4.500,00

### Requirement: Lost dialog
Marking an opportunity as lost SHALL require a reason from this list: Preço, Prazo de entrega, Escolheu concorrente, Sem orçamento, Sem resposta do cliente, Outro. The dialog SHALL also offer an optional detail field, which becomes required when the reason is Outro. Only non-final opportunities can be marked as lost.

#### Scenario: Reason required
- **WHEN** the user confirms the lost dialog without a reason
- **THEN** the dialog stays open and says "Escolha o motivo da perda"

#### Scenario: Other needs detail
- **WHEN** the user picks "Outro" and leaves the detail empty
- **THEN** the dialog says "Descreva o motivo"
