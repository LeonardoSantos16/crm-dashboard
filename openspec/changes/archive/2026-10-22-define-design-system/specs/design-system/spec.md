# Spec Delta

## Purpose

Defines the shared visual language of the CRM: color, type, state colors, accessibility rules, and feedback patterns. It exists so that every screen shows urgency and status the same way and a salesperson can find the deal to work on today at a glance.

## ADDED Requirements

### Requirement: Single source of visual tokens
The interface SHALL use only the colors, font families, type sizes, radii, and shadows defined in the design tokens. A color, font, or shadow that is not a token SHALL NOT appear in application code.

#### Scenario: Off-palette utility is unavailable
- **WHEN** a component uses a color utility that is not a design token (for example a default palette color such as red-500)
- **THEN** no style is generated for it and the automated token check fails

#### Scenario: Hard-coded color is rejected
- **WHEN** a hex, rgb, or hsl color literal appears in a component, page, or arbitrary utility value outside the token definitions
- **THEN** the automated token check fails and names the file

### Requirement: Light theme only
The interface SHALL render the light theme regardless of the operating system's color-scheme preference.

#### Scenario: Dark preference ignored
- **WHEN** the user's system prefers a dark color scheme
- **THEN** the page background is `paper` (#F8FDFA) and body text is `ink` (#174F2D)

### Requirement: Text contrast meets WCAG AA
Every text and background pair declared in the design system SHALL have a contrast ratio of at least 4.5:1.

#### Scenario: Declared text pairs pass
- **WHEN** the contrast check computes the ratio of each declared text pair (for example `ink-soft` on `paper-shade`, `attention-fg` on `attention-bg`, white on `forest`)
- **THEN** every ratio is at least 4.5:1

#### Scenario: Low-contrast brand colors are not used for text on light surfaces
- **WHEN** text is placed on `paper`, `paper-shade`, or `surface`
- **THEN** its color is not `crown` (1.77:1 on white)

### Requirement: Non-text contrast meets WCAG AA
Borders of form controls, focus indicators, and state indicator marks (solid tones) SHALL have a contrast ratio of at least 3:1 against the surface they sit on.

#### Scenario: Input border is visible
- **WHEN** a text input is rendered on `surface` or `paper`
- **THEN** its border uses `border-strong` (#7B8A82, at least 3.52:1)

#### Scenario: Decorative dividers are exempt
- **WHEN** a divider only separates content and carries no meaning
- **THEN** it may use `border` (#E5E5E5)

### Requirement: Opportunity states have distinct visual identities
The system SHALL provide six states, each with a text tone, a soft background tone, and a solid tone:
- attention
- error
- success (Fechamento)
- lost (Perdida)
- snoozed (adiado)
- escalated (escalonado)

#### Scenario: State tokens exist
- **WHEN** a screen needs to show any of the six states
- **THEN** it uses that state's `fg`, `bg`, and `solid` tokens and no other color

#### Scenario: Lost is not shown as an error
- **WHEN** an opportunity is in the Perdida stage
- **THEN** it is shown with the neutral `lost` tones, not the `error` tones

### Requirement: State is never conveyed by color alone
Every state indicator SHALL show an icon and a pt-BR text label in addition to its color.

#### Scenario: Status badge content
- **WHEN** a status badge for the escalated state is rendered
- **THEN** it shows an icon and the text "Escalonada", and the icon is hidden from assistive technology

#### Scenario: Grayscale reading
- **WHEN** the screen is viewed without color perception
- **THEN** each of the six states can still be told apart by its icon and label

### Requirement: One alert state per opportunity
When an opportunity matches more than one alert state, the interface SHALL show only the most severe one. The order is escalated, then attention, then snoozed.

#### Scenario: Escalated outranks attention
- **WHEN** an opportunity is both in attention and escalated
- **THEN** only the escalated indicator is shown

### Requirement: Typography roles
The interface SHALL use two font families:
- Archivo for UI text and headings.
- Montserrat with tabular figures for opportunity codes, currency values, dates, and uppercase labels.

Fonts SHALL be self-hosted at build time, not requested from a third-party host at runtime.

#### Scenario: Numbers align in columns
- **WHEN** currency values are listed one below another
- **THEN** their digits align vertically

#### Scenario: No runtime font requests to third parties
- **WHEN** a page loads in the browser
- **THEN** no request is made to fonts.googleapis.com or fonts.gstatic.com

### Requirement: Type scale
The interface SHALL use only the type sizes 11, 12, 14, 16, 18, 20, and 24px. Body text in dense views SHALL be at least 14px. The 11px size SHALL be used only for uppercase labels.

#### Scenario: Form inputs on mobile
- **WHEN** a text input is focused on a viewport narrower than 768px
- **THEN** its font size is 16px, so the browser does not zoom the page

### Requirement: Interactive target size
Interactive controls SHALL be at least 44×44px on viewports narrower than 768px. On wider viewports they SHALL be at least 36px tall and never smaller than 24×24px.

#### Scenario: Mobile button
- **WHEN** a button is rendered on a 375px-wide viewport
- **THEN** its height is at least 44px

#### Scenario: Desktop button
- **WHEN** a button is rendered on a 1280px-wide viewport
- **THEN** its height is 36px

### Requirement: Visible keyboard focus
Every focusable element SHALL show a visible focus indicator when focused from the keyboard. The indicator SHALL have at least 3:1 contrast against its background.

#### Scenario: Focus on light surface
- **WHEN** a button on `paper` receives keyboard focus
- **THEN** a 2px `forest` outline appears around it

#### Scenario: Focus on the navigation bar
- **WHEN** a navigation item on `forest-deep` receives keyboard focus
- **THEN** a 2px `crown` outline appears around it

### Requirement: Navigation brand treatment
The navigation bar SHALL use a `forest-deep` background, with `moss` for item text and `crown` for the active item. The active item SHALL also be marked by a non-color cue and `aria-current="page"`.

#### Scenario: Active navigation item
- **WHEN** the user is on the Kanban page
- **THEN** the Kanban item is shown in `crown` with an underline and has `aria-current="page"`

### Requirement: Loading pattern
While content loads, the interface SHALL show placeholders shaped like the content they replace. The busy region SHALL be announced to assistive technology.

#### Scenario: Loading opportunities
- **WHEN** opportunity data is being fetched
- **THEN** skeleton placeholders in `paper-shade` are shown, and the region has `aria-busy="true"` and a screen-reader text "Carregando oportunidades"

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** the skeletons do not animate

### Requirement: Error pattern
When a request fails, the interface SHALL show, inside the affected region:
- the error tones;
- an icon;
- one pt-BR sentence that says what failed;
- a retry action.

The error SHALL be announced to assistive technology.

#### Scenario: Failed load
- **WHEN** loading opportunities fails
- **THEN** the region shows "Não foi possível carregar as oportunidades." and a "Tentar novamente" button, inside an element with `role="alert"`

#### Scenario: Retry
- **WHEN** the user activates "Tentar novamente"
- **THEN** the retry handler provided by the screen is called

### Requirement: Empty-result pattern
When a query returns no items, the interface SHALL say so in neutral tones, without error colors. When filters caused the empty result, it SHALL offer a way to clear them.

#### Scenario: No results with filters
- **WHEN** the active filters match no opportunity
- **THEN** the region shows "Nenhuma oportunidade com esses filtros." and a "Limpar filtros" action

#### Scenario: Empty Kanban column
- **WHEN** a funnel stage has no opportunities
- **THEN** the column shows a short neutral text and no error or alert styling

### Requirement: Motion
Transitions SHALL last 150ms or less and SHALL be limited to color, shadow, and small position changes. Every animation SHALL be disabled when the user prefers reduced motion.

#### Scenario: Card hover
- **WHEN** the pointer hovers over a card
- **THEN** its shadow changes from `card` to `lift` within 150ms

#### Scenario: Reduced motion on hover
- **WHEN** the user prefers reduced motion and hovers over a card
- **THEN** the shadow changes without a transition and the card does not move

### Requirement: Token reference page in development
A page that renders every color token with its contrast ratio, the state colors, the type scale, and the feedback components SHALL be available in development. It SHALL NOT be available in production.

#### Scenario: Development
- **WHEN** a developer opens `/design-tokens` while running the development server
- **THEN** the reference page is shown

#### Scenario: Production
- **WHEN** anyone requests `/design-tokens` on a production build
- **THEN** the response is the 404 page
