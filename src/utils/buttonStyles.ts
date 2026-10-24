const BASE =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed md:h-9";

export const BUTTON_STYLES = {
  primary: `${BASE} border-forest bg-forest text-white enabled:hover:border-forest-deep enabled:hover:bg-forest-deep`,
  secondary: `${BASE} border-border-strong bg-surface text-ink enabled:hover:bg-paper-shade`,
  lost: `${BASE} border-lost-solid bg-lost-bg text-lost-fg enabled:hover:border-lost-fg`,
  ghost: `${BASE} border-transparent px-2 text-forest enabled:hover:bg-paper-shade`,
};
