import { useMemo } from "react";
import type { AlertSummaryProps } from "@/types/opportunity";
import { STATE_TONE_STYLES, getAlertSummary } from "@/utils/opportunity";

export const AlertSummary = ({ opportunity, today, snoozeReason, variant = "box" }: AlertSummaryProps) => {
  const summary = useMemo(() => getAlertSummary(opportunity, today, snoozeReason), [opportunity, today, snoozeReason]);

  if (!summary) return null;

  const { className, iconClassName } = STATE_TONE_STYLES[summary.tone];

  if (variant === "pill") {
    return (
      <p className={`inline-flex items-center gap-1.5 self-start rounded-sm border px-2.5 py-1 text-sm ${className}`}>
        <summary.icon aria-hidden="true" className={`size-4 shrink-0 ${iconClassName}`} />
        <span className="font-semibold">{summary.title}</span>
        {summary.text && <span>· {summary.text}</span>}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm ${className}`}>
      <summary.icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} />
      <p className="flex flex-col">
        <span className="font-semibold">{summary.title}</span>
        {summary.text && <span>{summary.text}</span>}
      </p>
    </div>
  );
};
