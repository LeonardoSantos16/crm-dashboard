import type { FunnelStage, OpportunityCard } from "@/types/api";
import { FUNNEL_STAGES } from "@/utils/labels";
import type { BoardColumnData } from "../_types/board";

export function hasAlert(card: OpportunityCard) {
  return card.alert?.state === "ATTENTION" || card.alert?.state === "ESCALATED";
}

export function groupByStage(opportunities: OpportunityCard[]): BoardColumnData[] {
  const columns = new Map<FunnelStage, BoardColumnData>(
    FUNNEL_STAGES.map((stage) => [stage, { stage, cards: [], lostCards: [], alertCount: 0 }]),
  );

  for (const card of opportunities) {
    if (card.stage === "LOST") {
      if (card.lostFromStage && card.lostFromStage !== "LOST") columns.get(card.lostFromStage)?.lostCards.push(card);
      continue;
    }
    const column = columns.get(card.stage);
    if (!column) continue;
    column.cards.push(card);
    if (hasAlert(card)) column.alertCount++;
  }

  return [...columns.values()];
}

export function isColumnEmpty(column: BoardColumnData) {
  return column.cards.length === 0 && column.lostCards.length === 0;
}
