"use client";

import { CircleX, Undo2 } from "lucide-react";
import { useState } from "react";
import type { CompleteDataRequest, OpportunityActionsProps, OpportunityDialog } from "@/types/opportunity";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { isFinalStage } from "@/utils/opportunity";
import { CompleteDataDialog } from "./dialogs/CompleteDataDialog";
import { FollowUpDialog } from "./dialogs/FollowUpDialog";
import { LostDialog } from "./dialogs/LostDialog";
import { SnoozeDialog } from "./dialogs/SnoozeDialog";
import { MoveMenu } from "./MoveMenu";

export const OpportunityActions = ({ opportunity, layout }: OpportunityActionsProps) => {
  const [openDialog, setOpenDialog] = useState<OpportunityDialog | null>(null);
  const [completeRequest, setCompleteRequest] = useState<CompleteDataRequest | null>(null);

  if (isFinalStage(opportunity.stage)) return null;

  const isPanel = layout === "panel";

  const dialogProps = (dialog: OpportunityDialog) => ({
    opportunity,
    open: openDialog === dialog,
    onOpenChange: (isOpen: boolean) => setOpenDialog(isOpen ? dialog : null),
  });

  const renderFollowUp = () => (
    <button
      type="button"
      onClick={() => setOpenDialog("followUp")}
      className={`${BUTTON_STYLES.primary} ${isPanel ? "flex-1" : ""}`}
    >
      <Undo2 aria-hidden="true" className="size-4" />
      Marcar como retornado
    </button>
  );

  const renderSecondary = () => (
    <>
      <button type="button" onClick={() => setOpenDialog("snooze")} className={BUTTON_STYLES.secondary}>
        Adiar
      </button>
      <MoveMenu opportunity={opportunity} onRequestComplete={setCompleteRequest} />
      <button
        type="button"
        onClick={() => setOpenDialog("lost")}
        className={`${BUTTON_STYLES.lost} ${isPanel ? "flex-1" : ""}`}
      >
        <CircleX aria-hidden="true" className="size-4 text-lost-solid" />
        Marcar como perdida
      </button>
    </>
  );

  const renderDialogs = () => (
    <>
      <FollowUpDialog {...dialogProps("followUp")} />
      <SnoozeDialog {...dialogProps("snooze")} />
      <LostDialog {...dialogProps("lost")} />
      {completeRequest && (
        <CompleteDataDialog
          opportunity={opportunity}
          toStage={completeRequest.toStage}
          missing={completeRequest.missing}
          open
          onOpenChange={(isOpen) => !isOpen && setCompleteRequest(null)}
        />
      )}
    </>
  );

  const renderButtons = () =>
    isPanel ? (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">{renderFollowUp()}</div>
        <div className="flex flex-wrap gap-2">{renderSecondary()}</div>
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        {renderFollowUp()}
        {renderSecondary()}
      </div>
    );

  return (
    <>
      {renderButtons()}
      {renderDialogs()}
    </>
  );
};
