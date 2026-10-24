# Spec Delta

## MODIFIED Requirements

### Requirement: Text contrast meets WCAG AA
Every text and background pair declared in the design system SHALL have a contrast ratio of at least 4.5:1.

#### Scenario: Declared text pairs pass
- **WHEN** the contrast check computes the ratio of each declared text pair (for example `ink-soft` on `paper-shade`, `attention-fg` on `attention-bg`, white on `forest`)
- **THEN** every ratio is at least 4.5:1

#### Scenario: Low-contrast brand colors are not used for text on light surfaces
- **WHEN** text is placed on `paper`, `paper-shade`, or `surface`
- **THEN** its color is not `crown` (1.77:1 on white)

#### Scenario: Solid state tones are not text colors
- **WHEN** a state is shown on its own soft background
- **THEN** its text uses the state's `-fg` tone, and the `-solid` tone is used only for icons, borders, and marks (for example `attention-solid` on `attention-bg` is 4.26:1 and `lost-solid` on `lost-bg` is 4.16:1)

#### Scenario: Column background keeps secondary text readable
- **WHEN** `ink-soft` text is placed on `paper-shade` (#EAF2EE)
- **THEN** the ratio is at least 4.5:1 (4.53:1), so `paper-shade` cannot be darkened further without changing `ink-soft`

### Requirement: Non-text contrast meets WCAG AA
Borders of form controls, focus indicators, and state indicator marks (solid tones) SHALL have a contrast ratio of at least 3:1 against the surface they sit on.

#### Scenario: Input border is visible
- **WHEN** a text input is rendered on `surface` or `paper`
- **THEN** its border uses `border-strong` (#7B8A82, at least 3.52:1)

#### Scenario: Decorative dividers are exempt
- **WHEN** a divider only separates content and carries no meaning
- **THEN** it may use `border` (#D8E3DC)

#### Scenario: State marks on their soft background
- **WHEN** a state icon in its `-solid` tone sits on the state's `-bg` tone
- **THEN** the ratio is at least 3:1

#### Scenario: Card separates from its column
- **WHEN** a `surface` card sits on a `paper-shade` Kanban column
- **THEN** the column is visibly distinct from the card (1.14:1) and from the page background `paper` (1.11:1), while the card keeps its `card` shadow
