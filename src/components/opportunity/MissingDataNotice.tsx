import { Info } from "lucide-react";
import type { MissingDataNoticeProps } from "@/types/opportunity";
import { describeMissing } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { getMissingFields } from "@/utils/opportunity";

export const MissingDataNotice = ({ opportunity }: MissingDataNoticeProps) => {
  const missing = getMissingFields(opportunity);
  if (!missing) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border-strong bg-paper-shade px-3 py-2.5 text-sm">
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-soft" />
      <div className="flex flex-col items-start gap-2">
        <p>{describeMissing(missing)} para enviar orçamento.</p>
        <button type="button" disabled className={BUTTON_STYLES.secondary}>
          Completar dados
        </button>
      </div>
    </div>
  );
};
