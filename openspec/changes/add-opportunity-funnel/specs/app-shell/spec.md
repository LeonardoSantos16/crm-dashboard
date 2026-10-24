# Spec Delta

## Purpose

Defines the frame every CRM screen lives in: the top bar, the navigation, and the demo identity that decides which data a user sees.

## ADDED Requirements

### Requirement: Top bar
Every screen SHALL show a top bar with the "Nobre CRM" logo, the "Oportunidades" navigation tab, and the identity selector. The bar follows the design-system navigation treatment.

#### Scenario: Top bar contents on desktop
- **WHEN** a salesperson opens any screen on a 1280px-wide viewport
- **THEN** the top bar shows the logo, the "Oportunidades" tab, and "Entrando como: <name>" on one row

#### Scenario: Active tab
- **WHEN** the user is on the Kanban screen
- **THEN** the "Oportunidades" tab is marked as active with an underline and `aria-current="page"`

### Requirement: Top bar on small screens
On viewports narrower than 768px, the top bar SHALL wrap into two rows: the logo and the identity selector on the first, the navigation tab on the second. The page SHALL NOT scroll horizontally.

#### Scenario: Top bar at 375px
- **WHEN** the screen is 375px wide
- **THEN** the top bar shows two rows, the "Entrando como:" text is kept for screen readers only, and the page has no horizontal scroll

### Requirement: Demo identity selector
Because the system has no login, the top bar SHALL offer a selector of demo users, each a salesperson or a manager. It SHALL be labeled as demonstration mode. The choice SHALL persist across visits on the same browser.

#### Scenario: Switching user
- **WHEN** the user picks "Marcos (gestor)" in the selector
- **THEN** every screen reloads its data as Marcos, and the selector shows "Entrando como: Marcos (gestor)"

#### Scenario: Remembered choice
- **WHEN** the user returns to the CRM on the same browser
- **THEN** the last selected user is still active

### Requirement: Identity sent to the API
Every API request SHALL carry the selected user's identifier. Opportunity visibility SHALL be enforced by the API, not by the interface.

#### Scenario: Salesperson data
- **WHEN** Ana (salesperson) loads the Kanban
- **THEN** the API returns only opportunities whose owner is Ana

#### Scenario: Manager data
- **WHEN** Marcos (manager) loads the Kanban
- **THEN** the API returns the opportunities of every salesperson on his team
