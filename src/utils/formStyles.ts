export const INPUT_CLASS =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-2.5 text-base text-ink placeholder:text-ink-soft aria-invalid:border-error-solid md:h-9 md:text-sm";

export const TEXTAREA_CLASS =
  "min-h-16 w-full resize-y rounded-md border border-border-strong bg-surface px-2.5 py-2 text-base text-ink placeholder:text-ink-soft aria-invalid:border-error-solid md:text-sm";

export function fieldErrorId(id: string) {
  return `${id}-error`;
}

export function fieldHintId(id: string) {
  return `${id}-hint`;
}

export function describedBy(id: string, { hasError, hasHint }: { hasError: boolean; hasHint: boolean }) {
  const ids = [hasHint ? fieldHintId(id) : null, hasError ? fieldErrorId(id) : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}
