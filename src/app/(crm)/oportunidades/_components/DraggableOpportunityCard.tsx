"use client";

import { useDraggable } from "@dnd-kit/core";
import type { CardDragData, DraggableOpportunityCardProps } from "../_types/board";
import { isCardDraggable } from "../_utils/drag";
import { OpportunityCard } from "./OpportunityCard";

export const DraggableOpportunityCard = ({ isDragEnabled, ...props }: DraggableOpportunityCardProps) => {
  const isDraggable = isDragEnabled && isCardDraggable(props.card);
  const data: CardDragData = { card: props.card };

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: props.card.id,
    data,
    disabled: !isDraggable,
    attributes: { roleDescription: "card arrastável" },
  });

  const dragHandle = isDraggable ? { ref: setNodeRef, attributes, listeners } : undefined;

  return <OpportunityCard {...props} dragHandle={dragHandle} isDragging={isDragging} />;
};
