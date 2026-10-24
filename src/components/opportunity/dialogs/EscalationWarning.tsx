import { Siren } from "lucide-react";
import type { OpportunityNoticeProps } from "@/types/opportunity";
import { isNextSnoozeEscalating } from "@/utils/opportunity";

export const EscalationWarning = ({ opportunity }: OpportunityNoticeProps) => {
  if (!isNextSnoozeEscalating(opportunity)) return null;

  return (
    <p className="flex items-start gap-2.5 rounded-md border border-escalated-solid bg-escalated-bg px-3 py-2.5 text-sm text-escalated-fg">
      <Siren aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-escalated-solid" />
      Este é o 2º adiamento seguido. A oportunidade será escalonada para o gestor.
    </p>
  );
};
