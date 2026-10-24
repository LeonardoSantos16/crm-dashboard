import { Info } from "lucide-react";
import type { OpportunityNoticeProps } from "@/types/opportunity";
import { pluralize } from "@/utils/format";
import { STAGE_LABELS } from "@/utils/labels";

export const DeadlineHint = ({ opportunity }: OpportunityNoticeProps) => {
  if (!opportunity.alert) return null;

  return (
    <span className="flex items-start gap-1.5">
      <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      Sem data, o alerta volta em {pluralize(opportunity.alert.deadlineDays, "dia", "dias")} (prazo de{" "}
      {STAGE_LABELS[opportunity.stage]}).
    </span>
  );
};
