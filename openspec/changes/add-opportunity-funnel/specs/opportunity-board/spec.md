# Spec Delta

## Purpose

Defines the Oportunidades screen, a Kanban of the sales funnel where a salesperson sees every open opportunity by stage, finds the ones that need attention first, and moves them between stages.

## ADDED Requirements

### Requirement: One column per stage
The board SHALL show one column per funnel stage, in this order: Primeiro Contato, Apresentação de Orçamento, Follow-up, Forecast, Fechamento. Perdida SHALL NOT be a column.

#### Scenario: Column order
- **WHEN** the board loads
- **THEN** it shows five columns in funnel order, and no Perdida column

### Requirement: Fechamento shows recent closes only
The Fechamento column SHALL show only opportunities closed in the last 30 days and SHALL offer a "Ver todas" link to the rest.

#### Scenario: Old close hidden
- **WHEN** an opportunity was closed 45 days ago
- **THEN** it does not appear in the Fechamento column, and the column footer shows "Ver todas"

### Requirement: Column header
Each column header SHALL show the stage name, the number of cards in the column, and, when there are any, the number of cards with an alert, with an icon and a text label.

#### Scenario: Column with alerts
- **WHEN** Follow-up holds 4 cards and 2 of them have an alert
- **THEN** its header reads "Follow-up · 4" and shows an alert icon with "2 com alerta"

### Requirement: Card content
Each card SHALL show the code, company, estimated value, and gift with quantity. It SHALL show the alert badge when the opportunity has one, and the client event date when it is 7 days away or less. Empty fields SHALL be omitted. Managers SHALL also see the owner's initial.

#### Scenario: Card with alert
- **WHEN** OPP-2004 has been idle beyond its stage deadline
- **THEN** its card shows "OPP-2004", "Agência Pulso", "R$ 3.900", "Camiseta estampada · 80", and an attention badge

#### Scenario: Card with missing value
- **WHEN** an opportunity has no estimated value
- **THEN** its card shows no value line and no placeholder

#### Scenario: Alert and event share a line
- **WHEN** a card has an alert and its client event is 7 days away or less
- **THEN** both are shown on one line, for example "Parada 9 dias · evento 18/10", and the card does not grow an extra line

#### Scenario: No state badge on closed cards
- **WHEN** a card is in the Fechamento column
- **THEN** it shows no "Fechada" badge, because the column already states it

#### Scenario: Owner visible to manager only
- **WHEN** a manager views the board
- **THEN** each card shows its owner's initial, and a salesperson viewing the same card does not see it

### Requirement: Priority order within a column
Cards SHALL be ordered by priority: first by the share of the stage deadline already used (highest first), then by estimated value (highest first). The user SHALL be able to sort by value only instead.

#### Scenario: Overdue card first
- **WHEN** a column holds a card at 150% of its deadline and another at 40%
- **THEN** the card at 150% is shown above

#### Scenario: Sort by value
- **WHEN** the user picks "Ordenar por: Valor"
- **THEN** each column is ordered by estimated value, highest first

### Requirement: Search
The toolbar SHALL offer a search by opportunity code or company name that narrows every column to the matching cards.

#### Scenario: Search by company
- **WHEN** the user types "clínica"
- **THEN** only cards whose company contains "Clínica", ignoring case and accents, remain on the board

### Requirement: Filters
The toolbar SHALL offer these controls:
- a "Precisam de atenção" chip with the count of cards that have an alert;
- situation chips: Atrasada, Adiada, Escalonada, Em dia;
- an owner filter, for managers only;
- a "Mostrar perdidas" checkbox.

#### Scenario: Needs attention
- **WHEN** the user activates "Precisam de atenção"
- **THEN** only cards with an alert remain, and the chip shows its active state with a check icon

#### Scenario: Show lost
- **WHEN** the user checks "Mostrar perdidas"
- **THEN** opportunities lost in the last 30 days appear at the end of the column of the stage they were lost from, in lost tones with the lost badge, and are not counted in the column header

#### Scenario: Old lost hidden
- **WHEN** "Mostrar perdidas" is checked and an opportunity was lost 45 days ago
- **THEN** it does not appear on the board

### Requirement: Board state in the URL
Search text, filters, and sort SHALL be stored in the URL, so that reloading or sharing the link restores the same board.

#### Scenario: Shared link
- **WHEN** a user opens a link with an active search and the "Precisam de atenção" filter
- **THEN** the board shows the same search text, filter, and results

### Requirement: Move by drag and drop
On viewports 768px wide and wider, the user SHALL be able to drag a card to another column to request a stage change. The API SHALL decide whether the move is valid.

#### Scenario: Valid move
- **WHEN** the user drags OPP-2005 from Forecast to Fechamento
- **THEN** the card moves to Fechamento and the change is recorded in its history

### Requirement: Forbidden columns marked during drag
While a card is dragged, columns it cannot move to SHALL be dimmed and SHALL show an icon and the reason as text.

#### Scenario: Fechamento outside Forecast
- **WHEN** the user drags a Follow-up card
- **THEN** the Fechamento column is dimmed and shows "Só a partir de Forecast"

### Requirement: Missing data dialog on move
When a card is dropped on Apresentação de Orçamento without an estimated value or a gift item, the board SHALL open a dialog to fill in the missing data and move it, instead of failing.

#### Scenario: Move without value
- **WHEN** the user drops OPP-2001, which has no gift item, on Apresentação de Orçamento
- **THEN** a dialog asks for the missing data, and confirming it saves the data and moves the card

#### Scenario: Cancel
- **WHEN** the user cancels that dialog
- **THEN** the card returns to its original column

### Requirement: Rejected move
When the API rejects a move, the card SHALL return to its original column and the API's reason SHALL be shown in pt-BR.

#### Scenario: API rejects
- **WHEN** the API rejects a move
- **THEN** the card is back in its column and a message with an error icon shows the reason

### Requirement: Lost drop area
While a card is dragged, the board SHALL show a "Marcar como perdida" area. Dropping a card there SHALL open the lost dialog.

#### Scenario: Drop on lost
- **WHEN** the user drops a card on "Marcar como perdida"
- **THEN** the lost dialog opens for that opportunity

### Requirement: Mobile board
On viewports narrower than 768px, the board SHALL show one column at a time, with scrollable stage tabs that show each stage's card count. The tabs SHALL use the short labels Contato, Orçamento, Follow-up, Forecast, and Fechamento. Cards SHALL NOT be draggable; stage moves use "Mover para…".

#### Scenario: Switch stage
- **WHEN** the user taps the "Forecast" tab on a 375px-wide screen
- **THEN** only the Forecast column is shown

#### Scenario: Short labels
- **WHEN** the stage tabs are shown on a 375px-wide screen
- **THEN** they read "Contato", "Orçamento", "Follow-up", "Forecast", and "Fechamento", with no abbreviation dots

### Requirement: Board loading, error, and empty states
The board SHALL use the design-system feedback patterns for each state:
- **Loading:** three skeleton cards per column.
- **Load failure:** an error in place of the board, with "Tentar novamente".
- **Search with no match:** a message naming the search, with "Limpar busca".
- **Empty column:** "Nenhuma oportunidade nesta etapa".
- **User with no opportunities:** a message with "Nova oportunidade".

#### Scenario: No search result
- **WHEN** the search "xyz" matches no opportunity
- **THEN** the board shows "Nenhuma oportunidade encontrada para “xyz”." and a "Limpar busca" action

#### Scenario: No opportunities at all
- **WHEN** the active salesperson owns no opportunity
- **THEN** the board shows "Você ainda não tem oportunidades." and a "Nova oportunidade" action
