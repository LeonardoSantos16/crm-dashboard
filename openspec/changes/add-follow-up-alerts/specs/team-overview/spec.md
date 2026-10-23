# Spec Delta

## Purpose

Defines the Time screen, where a manager sees the follow-up load of each salesperson, and who is overloaded, without being sent every individual alert.

## ADDED Requirements

### Requirement: Manager-only access
The Time screen SHALL be available only to managers. The API SHALL reject team data requests from a salesperson.

#### Scenario: Salesperson opens the URL
- **WHEN** Ana opens `/time` directly
- **THEN** she is sent to Oportunidades and no team data is loaded

### Requirement: Team table
Time SHALL show one row per salesperson on the manager's team. Each row SHALL have these columns:
- Ativas: open opportunities;
- Atrasadas;
- Escalonadas;
- Adiadas.

Rows SHALL be ordered by Escalonadas, highest first, then by Atrasadas.

#### Scenario: Ordering
- **WHEN** Carla has 2 escalated and Bruno has 0
- **THEN** Carla's row is above Bruno's

### Requirement: Drill-down into Retornos
Each non-zero number in Atrasadas, Escalonadas, and Adiadas SHALL link to Retornos, filtered by that salesperson and that situation.

#### Scenario: Open Carla's escalated
- **WHEN** Marcos activates Carla's Escalonadas count
- **THEN** Retornos opens filtered by owner Carla and situation Escalonada

#### Scenario: Zero is not a link
- **WHEN** a count is 0
- **THEN** it is shown as plain text, not as a link

### Requirement: Team totals
The table SHALL end with a total row that sums each column.

#### Scenario: Totals
- **WHEN** the team's Atrasadas counts are 2, 1, and 0
- **THEN** the total row shows 3 under Atrasadas

### Requirement: Time states
Time SHALL use the design-system loading, error, and empty patterns. A manager with no salespeople SHALL see "Nenhum vendedor no time."

#### Scenario: Failed load
- **WHEN** loading Time fails
- **THEN** it shows "Não foi possível carregar o time." and "Tentar novamente"

### Requirement: Mobile Time
On viewports narrower than 768px, each salesperson SHALL be a card with the four counts, keeping the same links.

#### Scenario: Mobile card
- **WHEN** Time opens on a 375px-wide screen
- **THEN** each salesperson is a card showing Ativas, Atrasadas, Escalonadas, and Adiadas with their labels
