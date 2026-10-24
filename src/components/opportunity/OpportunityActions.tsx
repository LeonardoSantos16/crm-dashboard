import { ChevronDown, CircleX, Undo2 } from "lucide-react";
import type { OpportunityActionsProps } from "@/types/opportunity";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { isFinalStage } from "@/utils/opportunity";

export const OpportunityActions = ({ opportunity, layout }: OpportunityActionsProps) => {
  if (isFinalStage(opportunity.stage)) return null;

  const isPanel = layout === "panel";

  const renderFollowUp = () => (
    <button type="button" disabled className={`${BUTTON_STYLES.primary} ${isPanel ? "flex-1" : ""}`}>
      <Undo2 aria-hidden="true" className="size-4" />
      Marcar como retornado
    </button>
  );

  const renderSecondary = () => (
    <>
      <button type="button" disabled className={BUTTON_STYLES.secondary}>
        Adiar
      </button>
      <button type="button" disabled className={BUTTON_STYLES.secondary}>
        Mover para…
        <ChevronDown aria-hidden="true" className="size-4" />
      </button>
      <button type="button" disabled className={`${BUTTON_STYLES.lost} ${isPanel ? "flex-1" : ""}`}>
        <CircleX aria-hidden="true" className="size-4 text-lost-solid" />
        Marcar como perdida
      </button>
    </>
  );

  if (isPanel) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">{renderFollowUp()}</div>
        <div className="flex flex-wrap gap-2">{renderSecondary()}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {renderFollowUp()}
      {renderSecondary()}
    </div>
  );
};
