import type { DialogHeadingProps } from "@/types/opportunity";
import { STAGE_LABELS } from "@/utils/labels";

export const DialogHeading = ({ opportunity, showStage = false }: DialogHeadingProps) => (
  <p className="text-sm font-semibold">
    <span className="font-mono">{opportunity.code}</span> · {opportunity.company.name}
    {showStage && ` · ${STAGE_LABELS[opportunity.stage]}`}
  </p>
);
