import type { Announcements, Active, Over, ScreenReaderInstructions } from "@dnd-kit/core";
import type { FunnelStage, OpportunityCard } from "@/types/api";
import { FUNNEL_STAGES, STAGE_LABELS } from "@/utils/labels";
import { isFinalStage } from "@/utils/opportunity";
import type { CardDragData } from "../_types/board";

export const DRAG_ENABLED_QUERY = "(min-width: 768px)";

export const DRAG_ACTIVATION_DISTANCE = 6;

export const BOARD_DND_ID = "opportunity-board";

export const IGNORE_OPEN = () => undefined;

export function isCardDraggable(card: OpportunityCard) {
  return !isFinalStage(card.stage);
}

export function getDraggedCard(active: Active | null) {
  return (active?.data.current as CardDragData | undefined)?.card ?? null;
}

export function getDropStage(over: Over | null): FunnelStage | null {
  const stage = over?.id;
  return FUNNEL_STAGES.find((item) => item === stage) ?? null;
}

function describeCard(active: Active) {
  const card = getDraggedCard(active);
  return card ? `${card.code} · ${card.company.name}` : "Oportunidade";
}

export const SCREEN_READER_INSTRUCTIONS: ScreenReaderInstructions = {
  draggable: "Arraste o card com o mouse para outra etapa. Pelo teclado, abra o card e use “Mover para…”.",
};

export const DRAG_ANNOUNCEMENTS: Announcements = {
  onDragStart: ({ active }) => `${describeCard(active)} em movimento.`,
  onDragOver: ({ active, over }) => {
    const stage = getDropStage(over);
    return stage ? `${describeCard(active)} sobre ${STAGE_LABELS[stage]}.` : undefined;
  },
  onDragEnd: ({ active, over }) => {
    const stage = getDropStage(over);
    return stage ? `${describeCard(active)} solta em ${STAGE_LABELS[stage]}.` : `${describeCard(active)} não foi movida.`;
  },
  onDragCancel: ({ active }) => `Movimento de ${describeCard(active)} cancelado.`,
};
