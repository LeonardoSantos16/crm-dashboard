# Spec Delta

## Purpose

Defines how a user views, edits, moves, closes as lost, and creates a single opportunity: a quick side panel, a full detail page with an activity timeline and comments, and the dialogs those flows need.

## ADDED Requirements

### Requirement: Side panel on first click
Activating a card SHALL open a side panel over the board with the opportunity's summary, and the board SHALL stay visible. The URL SHALL identify the open opportunity. On viewports narrower than 768px the panel SHALL fill the screen.

#### Scenario: Open panel
- **WHEN** the user clicks the OPP-2003 card
- **THEN** a side panel opens with OPP-2003's summary, and the URL contains `op=OPP-2003`

#### Scenario: Open from link
- **WHEN** a user opens a board link that contains `op=OPP-2003`
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

### Requirement: Move menu
The panel and the detail page SHALL offer "Mover para…", a menu of stages. Stages the opportunity cannot move to SHALL be disabled and show the reason. This is the way to move on mobile and with the keyboard.

#### Scenario: Disabled stage
- **WHEN** a Follow-up opportunity opens "Mover para…"
- **THEN** Fechamento is disabled with "Só a partir de Forecast"

### Requirement: Detail page layout
The detail page SHALL show a header with a link back to Oportunidades, the code and company, the alert badge, and the actions. Below it, two areas: Dados (data, dates, and gift items) and Atividade. On viewports narrower than 768px the two areas SHALL be tabs.

#### Scenario: Mobile tabs
- **WHEN** the detail page opens on a 375px-wide screen
- **THEN** it shows the tabs "Dados" and "Atividade", with Dados selected

### Requirement: Activity timeline
The Atividade area SHALL show, newest first, in one timeline: comments, stage changes, follow-ups, snoozes, and escalations. Each entry SHALL show its author, date and time, and an icon for its type.

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

### Requirement: Edit modal
The detail page SHALL offer "Editar", which opens a modal with the opportunity's fields and its gift items. The modal SHALL fill the screen on viewports narrower than 768px. Saving SHALL validate every field and show errors next to the fields.

#### Scenario: Save edit
- **WHEN** the user changes the contact phone and saves
- **THEN** the modal closes and the page shows the new phone

#### Scenario: Editing does not reset the alert clock
- **WHEN** the user edits any field of an idle opportunity
- **THEN** its alert stays as it was

### Requirement: Gift items
The edit modal SHALL let the user add and remove gift items, each with gift, quantity, and unit value. The items' total SHALL be suggested as the estimated value, and the user SHALL be able to override it.

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

### Requirement: Create opportunity
"Nova oportunidade" SHALL open a dialog with company, contact, and owner as required fields, and gift, quantity, and estimated value as optional fields. A new opportunity SHALL start in Primeiro Contato.

#### Scenario: Salesperson creates
- **WHEN** Ana opens "Nova oportunidade"
- **THEN** the owner field shows Ana and cannot be changed

#### Scenario: Manager creates
- **WHEN** Marcos (manager) opens "Nova oportunidade"
- **THEN** the owner field is a selector with his team

#### Scenario: Created
- **WHEN** the user saves a valid new opportunity
- **THEN** it appears in the Primeiro Contato column and its panel opens
