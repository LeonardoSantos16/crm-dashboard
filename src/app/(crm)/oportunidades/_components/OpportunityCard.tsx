import { useMemo } from "react";
import { formatCurrency, formatQuantity } from "@/utils/format";
import type { OpportunityCardProps } from "../_types/board";
import { CARD_BAND_STYLES, getCardBand } from "../_utils/card";

export const OpportunityCard = ({
  card,
  today,
  isOwnerVisible,
  isOpen,
  onOpen,
  dragHandle,
  isDragging = false,
  isOverlay = false,
}: OpportunityCardProps) => {
  const isLost = card.stage === "LOST";
  const [item, ...otherItems] = card.items;
  const band = useMemo(() => getCardBand(card, today), [card, today]);

  const renderOwner = () =>
    isOwnerVisible && (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-moss text-label font-bold text-forest-deep">
        <span aria-hidden="true">{card.owner.name.charAt(0)}</span>
        <span className="sr-only">Responsável: {card.owner.name}</span>
      </span>
    );

  const renderValue = () =>
    card.estimatedValue !== null && (
      <span className="font-mono text-sm font-bold">{formatCurrency(card.estimatedValue)}</span>
    );

  const renderItem = () =>
    item && (
      <span className={`flex min-w-0 gap-1 text-sm ${isLost ? "" : "text-ink-soft"}`}>
        <span className="truncate">{item.description}</span>
        <span className="shrink-0 font-mono">· {formatQuantity(item.quantity)}</span>
        {otherItems.length > 0 && <span className="shrink-0">+{otherItems.length}</span>}
      </span>
    );

  const renderBand = () => {
    if (!band) return null;
    const { className, iconClassName } = CARD_BAND_STYLES[band.tone];
    return (
      <span className={`flex items-center gap-1.5 border-t px-3 py-1 text-xs font-semibold ${className}`}>
        <band.icon aria-hidden="true" className={`size-3.5 shrink-0 ${iconClassName}`} />
        {band.text}
      </span>
    );
  };

  const stateClassName = isLost
    ? "border-lost-bg bg-lost-bg text-lost-fg"
    : "border-border bg-surface text-ink shadow-card hover:shadow-lift";

  const dragClassName = isOverlay
    ? "cursor-grabbing shadow-lift"
    : `${dragHandle ? "cursor-grab" : ""} ${isDragging ? "opacity-40" : ""}`;

  return (
    <button
      type="button"
      ref={dragHandle?.ref}
      {...dragHandle?.attributes}
      {...dragHandle?.listeners}
      onClick={() => onOpen(card.id)}
      aria-current={isOpen ? "true" : undefined}
      aria-hidden={isOverlay ? "true" : undefined}
      tabIndex={isOverlay ? -1 : 0}
      className={`flex w-full flex-col overflow-hidden rounded-md border text-left transition-shadow ${stateClassName} ${dragClassName} ${
        isOpen ? "border-forest ring-2 ring-forest" : ""
      }`}
    >
      <span className="flex flex-col gap-0.5 px-3 py-2.5">
        <span className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium tracking-wide text-ink-soft">{card.code}</span>
          {renderOwner()}
        </span>
        <span className="truncate text-sm font-semibold">{card.company.name}</span>
        {renderValue()}
        {renderItem()}
      </span>
      {renderBand()}
    </button>
  );
};
