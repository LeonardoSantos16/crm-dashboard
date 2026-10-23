# Spec Delta

## Purpose

Defines the frame every CRM screen lives in: the top bar, navigation between Oportunidades, Retornos, and Time, and the demo identity that decides which data and tabs a user sees.

## ADDED Requirements

### Requirement: Top bar
Every screen SHALL show a top bar with the "Nobre CRM" logo, the navigation tabs, a "Nova oportunidade" button, a notification bell, and the identity selector. The bar follows the design-system navigation treatment.

#### Scenario: Top bar contents on desktop
- **WHEN** a salesperson opens any screen on a 1280px-wide viewport
- **THEN** the top bar shows the logo, the tabs "Oportunidades" and "Retornos", the "Nova oportunidade" button, the bell, and "Entrando como: <name>"

#### Scenario: Active tab
- **WHEN** the user is on the Kanban screen
- **THEN** the "Oportunidades" tab is marked as active with an underline and `aria-current="page"`

### Requirement: Mobile navigation
On viewports narrower than 768px, the navigation tabs SHALL move to a fixed bottom bar, and the identity selector SHALL move to a menu opened from the top bar.

#### Scenario: Bottom bar
- **WHEN** the screen is 375px wide
- **THEN** the tabs are shown in a bar fixed to the bottom of the viewport, each tab with an icon and a text label

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

### Requirement: Role-based tabs
The "Time" tab SHALL be shown only to managers.

#### Scenario: Salesperson tabs
- **WHEN** the active user is a salesperson
- **THEN** the top bar shows "Oportunidades" and "Retornos" and no "Time" tab

#### Scenario: Manager tabs
- **WHEN** the active user is a manager
- **THEN** the top bar shows "Oportunidades", "Retornos", and "Time"
