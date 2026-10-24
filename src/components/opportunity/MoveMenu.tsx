"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Ban, Check, ChevronDown } from "lucide-react";
import { useMoveOpportunity } from "@/hooks/opportunities/useMoveOpportunity";
import type { FunnelStage } from "@/types/api";
import type { MoveMenuProps } from "@/types/opportunity";
import { MOVE_BLOCK_REASON_LABELS } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { FUNNEL_STAGES, STAGE_LABELS } from "@/utils/labels";
import { findMove } from "@/utils/opportunity";

const ITEM_CLASS = "flex min-h-9 w-full items-center gap-2 px-3 py-1.5 text-left text-sm -outline-offset-2";

export const MoveMenu = ({ opportunity, onRequestComplete }: MoveMenuProps) => {
  const move = useMoveOpportunity();

  const handleSelect = (stage: FunnelStage) => {
    const target = findMove(opportunity, stage);
    if (!target?.allowed) return;
    if (target.missing && target.missing.length > 0) {
      onRequestComplete({ toStage: stage, missing: target.missing });
      return;
    }
    move.mutate({ id: opportunity.id, toStage: stage });
  };

  const renderCurrent = (stage: FunnelStage) => (
    <DropdownMenu.Item key={stage} disabled className={`${ITEM_CLASS} font-semibold`}>
      <Check aria-hidden="true" className="size-4 shrink-0 text-forest" />
      <span className="flex-1">{STAGE_LABELS[stage]}</span>
      <span className="text-xs font-normal text-ink-soft">etapa atual</span>
    </DropdownMenu.Item>
  );

  const renderItem = (stage: FunnelStage) => {
    if (stage === opportunity.stage) return renderCurrent(stage);
    const target = findMove(opportunity, stage);
    if (!target) return null;

    if (!target.allowed) {
      return (
        <DropdownMenu.Item key={stage} disabled className={`${ITEM_CLASS} flex-col items-start gap-0.5 text-ink-soft`}>
          <span className="pl-6">{STAGE_LABELS[stage]}</span>
          <span className="flex items-center gap-1.5 pl-6 text-xs">
            <Ban aria-hidden="true" className="size-3.5 shrink-0" />
            {MOVE_BLOCK_REASON_LABELS[target.reason]}
          </span>
        </DropdownMenu.Item>
      );
    }

    return (
      <DropdownMenu.Item
        key={stage}
        onSelect={() => handleSelect(stage)}
        className={`${ITEM_CLASS} cursor-pointer data-highlighted:bg-paper-shade`}
      >
        <span className="w-4 shrink-0" />
        {STAGE_LABELS[stage]}
      </DropdownMenu.Item>
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={move.isPending} className={BUTTON_STYLES.secondary}>
        Mover para…
        <ChevronDown aria-hidden="true" className="size-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-30 min-w-72 rounded-md border border-border bg-surface py-1 text-ink shadow-overlay"
        >
          <DropdownMenu.Label className="border-b border-border px-3 pt-1.5 pb-2 text-sm font-semibold">
            Mover para…
          </DropdownMenu.Label>
          {FUNNEL_STAGES.map(renderItem)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
