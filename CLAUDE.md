@AGENTS.md

## Design rules

- Before styling anything, read `openspec/specs/design-system/spec.md` (until that change is archived: `openspec/changes/define-design-system/specs/design-system/spec.md`) and the tokens in the `@theme` block of `src/app/globals.css`.
- Use no color, font, radius, or shadow outside the `@theme` tokens: no default Tailwind palette, no hex/rgb/hsl literals, no arbitrary color values. `npm test` fails on violations.
- Never convey state by color alone. Every state shows an icon and a pt-BR text label; use `StatusBadge` and the other components in `src/components/feedback/`.
- UI text is in Brazilian Portuguese (pt-BR); code identifiers, file names, and CSS tokens are in English.
- Light theme only: no `dark:` variants or color-scheme media queries.
- Adjustments from Claude Design prototypes go into `@theme` and the design-system spec, never inline in a component.
- `/design-tokens` (development only) renders every token, contrast pair, and feedback pattern for visual comparison.
