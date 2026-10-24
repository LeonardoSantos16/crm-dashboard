import { CalendarX } from "lucide-react";
import type { ProposalDateProps } from "@/types/opportunity";
import { expiredDays, formatDate } from "@/utils/dates";
import { pluralize } from "@/utils/format";
import { EMPTY_VALUE } from "@/utils/labels";

export const ProposalDate = ({ validUntil, today }: ProposalDateProps) => {
  if (!validUntil) return <span className="text-ink-soft">{EMPTY_VALUE}</span>;

  const expired = today ? expiredDays(validUntil, today) : null;

  const renderExpired = () =>
    expired !== null && (
      <span className="flex items-center gap-1 text-xs font-semibold text-attention-fg">
        <CalendarX aria-hidden="true" className="size-3.5 text-attention-solid" />
        Vencida há {pluralize(expired, "dia", "dias")}
      </span>
    );

  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-mono">{formatDate(validUntil)}</span>
      {renderExpired()}
    </span>
  );
};
