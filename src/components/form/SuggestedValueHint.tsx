import type { SuggestedValueHintProps } from "@/types/form";
import { formatCurrencyWithCents } from "@/utils/format";

export const SuggestedValueHint = ({ suggestion, onUse }: SuggestedValueHintProps) => (
  <span className="flex flex-wrap items-center gap-2">
    Sugestão pelos itens: <span className="font-mono">{formatCurrencyWithCents(suggestion)}</span>
    <button type="button" onClick={onUse} className="font-semibold text-forest underline">
      Usar sugestão
    </button>
  </span>
);
