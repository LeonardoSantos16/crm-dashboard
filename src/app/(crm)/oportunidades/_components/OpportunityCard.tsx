import { useMemo } from "react";
import { formatCurrency, formatQuantity } from "@/utils/format";
import type { OpportunityCardProps } from "../_types/board";
import { CARD_BAND_STYLES, getCardBand } from "../_utils/card";

export const OpportunityCard = ({ card, today, isOwnerVisible }: OpportunityCardProps) => {
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
    card.estimatedValue !== null && <p className="font-mono text-sm font-bold">{formatCurrency(card.estimatedValue)}</p>;

  const renderItem = () =>
    item && (
      <p className={`flex min-w-0 gap-1 text-sm ${isLost ? "" : "text-ink-soft"}`}>
        <span className="truncate">{item.description}</span>
        <span className="shrink-0 font-mono">· {formatQuantity(item.quantity)}</span>
        {otherItems.length > 0 && <span className="shrink-0">+{otherItems.length}</span>}
      </p>
    );

  const renderBand = () => {
    if (!band) return null;
    const { className, iconClassName } = CARD_BAND_STYLES[band.tone];
    return (
      <p className={`flex items-center gap-1.5 border-t px-3 py-1 text-xs font-semibold ${className}`}>
        <band.icon aria-hidden="true" className={`size-3.5 shrink-0 ${iconClassName}`} />
        {band.text}
      </p>
    );
  };

  return (
    <article
      className={`overflow-hidden rounded-md border ${
        isLost ? "border-lost-bg bg-lost-bg text-lost-fg" : "border-border bg-surface text-ink shadow-card"
      }`}
    >
      <div className="flex flex-col gap-0.5 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium tracking-wide text-ink-soft">{card.code}</span>
          {renderOwner()}
        </div>
        <h3 className="truncate text-sm font-semibold">{card.company.name}</h3>
        {renderValue()}
        {renderItem()}
      </div>
      {renderBand()}
    </article>
  );
};
