import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { useMoveOpportunity } from "@/hooks/opportunities/useMoveOpportunity";
import type { OpportunityCard } from "@/types/api";
import { DRAG_ACTIVATION_DISTANCE, getDraggedCard, getDropStage } from "../_utils/drag";

export const useCardDrag = () => {
  const { mutate: moveOpportunity } = useMoveOpportunity();
  const [activeCard, setActiveCard] = useState<OpportunityCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => setActiveCard(getDraggedCard(event.active)), []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      const card = getDraggedCard(event.active);
      const stage = getDropStage(event.over);
      if (!card || !stage || stage === card.stage) return;
      moveOpportunity({ id: card.id, toStage: stage });
    },
    [moveOpportunity],
  );

  const handleDragCancel = useCallback(() => setActiveCard(null), []);

  return { sensors, activeCard, handleDragStart, handleDragEnd, handleDragCancel };
};
