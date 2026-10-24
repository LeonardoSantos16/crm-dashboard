import { ArrowRight, ClockAlert } from "lucide-react";
import { STAGE_LABELS } from "@/utils/labels";
import type { BoardColumnProps } from "../_types/board";
import { isColumnEmpty } from "../_utils/board";
import { OpportunityCard } from "./OpportunityCard";

export const BoardColumn = ({ column, today, isOwnerVisible, isAllClosed, onToggleAllClosed }: BoardColumnProps) => {
  const isClosing = column.stage === "CLOSING";
  const headingId = `column-${column.stage}`;

  const renderClosingPeriod = () =>
    isClosing && <p className="text-xs text-ink-soft">{isAllClosed ? "todas" : "últimos 30 dias"}</p>;

  const renderAlertCount = () =>
    column.alertCount > 0 && (
      <>
        <span aria-hidden="true" className="text-ink-soft">
          ·
        </span>
        <span className="flex items-center gap-1 font-semibold text-attention-fg">
          <ClockAlert aria-hidden="true" className="size-3.5 text-attention-solid" />
          {column.alertCount} com alerta
        </span>
      </>
    );

  const renderCards = () => {
    if (isColumnEmpty(column)) {
      return (
        <p className="rounded-md border border-dashed border-border-strong px-3 py-4 text-center text-sm text-ink-soft">
          Nenhuma oportunidade nesta etapa
        </p>
      );
    }
    return (
      <ul className="flex flex-col gap-2">
        {[...column.cards, ...column.lostCards].map((card) => (
          <li key={card.id}>
            <OpportunityCard card={card} today={today} isOwnerVisible={isOwnerVisible} />
          </li>
        ))}
      </ul>
    );
  };

  const renderClosingToggle = () =>
    isClosing && (
      <button
        type="button"
        onClick={onToggleAllClosed}
        className="inline-flex h-9 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-forest transition-colors hover:bg-paper-shade"
      >
        {isAllClosed ? "Ver só os últimos 30 dias" : "Ver todas"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    );

  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-2">
      <header className="flex min-h-16 flex-col justify-end gap-1 border-b-2 border-border pb-2">
        <h2 id={headingId} className="font-mono text-xs font-bold tracking-wide uppercase">
          {STAGE_LABELS[column.stage]}
        </h2>
        {renderClosingPeriod()}
        <p className="flex items-center gap-1.5 text-sm">
          <span className="font-mono font-bold">{column.cards.length}</span>
          {renderAlertCount()}
        </p>
      </header>
      {renderCards()}
      {renderClosingToggle()}
    </section>
  );
};
