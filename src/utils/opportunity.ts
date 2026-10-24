import { AlarmClockOff, CircleCheck, CircleX, ClockAlert, Siren } from "lucide-react";
import type { FunnelStage, OpportunityList, OpportunitySummary, Stage } from "@/types/api";
import type { AlertSummaryData, CompleteDataRequest, StateTone } from "@/types/opportunity";
import { formatDate, formatShortDate, toCalendarDate } from "@/utils/dates";
import { formatQuantity, pluralize } from "@/utils/format";
import { LOSS_REASON_LABELS } from "@/utils/labels";

export const STATE_TONE_STYLES: Record<StateTone, { className: string; iconClassName: string }> = {
  attention: {
    className: "border-attention-solid bg-attention-bg text-attention-fg",
    iconClassName: "text-attention-solid",
  },
  escalated: {
    className: "border-escalated-solid bg-escalated-bg text-escalated-fg",
    iconClassName: "text-escalated-solid",
  },
  snoozed: {
    className: "border-snoozed-solid bg-snoozed-bg text-snoozed-fg",
    iconClassName: "text-snoozed-solid",
  },
  lost: {
    className: "border-lost-solid bg-lost-bg text-lost-fg",
    iconClassName: "text-lost-solid",
  },
  success: {
    className: "border-success-solid bg-success-bg text-success-fg",
    iconClassName: "text-success-solid",
  },
};

export function isFinalStage(stage: Stage) {
  return stage === "CLOSING" || stage === "LOST";
}

export function getMissingMove(opportunity: OpportunitySummary): CompleteDataRequest | null {
  for (const move of opportunity.moves) {
    if (move.allowed && move.missing && move.missing.length > 0) return { toStage: move.stage, missing: move.missing };
  }
  return null;
}

function describeIdle(idleDays: number, deadlineDays: number) {
  return `Parada há ${pluralize(idleDays, "dia", "dias")} · prazo da etapa: ${pluralize(deadlineDays, "dia", "dias")}`;
}

export function getAlertSummary(
  opportunity: OpportunitySummary,
  today: string | null,
  snoozeReason?: string | null,
): AlertSummaryData | null {
  if (opportunity.stage === "LOST") {
    const reason = opportunity.lossReason ? LOSS_REASON_LABELS[opportunity.lossReason] : "motivo não informado";
    const detail = opportunity.lossDetail ? ` · “${opportunity.lossDetail}”` : "";
    return { tone: "lost", icon: CircleX, title: "Perdida", text: `${reason}${detail}` };
  }

  if (opportunity.stage === "CLOSING") {
    return {
      tone: "success",
      icon: CircleCheck,
      title: "Fechada",
      text: `desde ${formatDate(toCalendarDate(opportunity.stageEnteredAt))}`,
    };
  }

  const { alert } = opportunity;
  if (!alert) return null;

  switch (alert.state) {
    case "ATTENTION":
      return { tone: "attention", icon: ClockAlert, title: "Atenção", text: describeIdle(alert.idleDays, alert.deadlineDays) };
    case "ESCALATED":
      return {
        tone: "escalated",
        icon: Siren,
        title: "Escalonada",
        text: `Escalonada para o gestor · ${describeIdle(alert.idleDays, alert.deadlineDays).toLowerCase()}`,
      };
    case "SNOOZED": {
      const until = opportunity.snoozedUntil ? `até ${formatShortDate(opportunity.snoozedUntil)}` : "";
      const reason = snoozeReason ? ` · “${snoozeReason}”` : "";
      return { tone: "snoozed", icon: AlarmClockOff, title: "Adiada", text: `${until}${reason}` };
    }
    case "ON_TIME":
      return {
        tone: "success",
        icon: CircleCheck,
        title: "Em dia",
        text:
          alert.dueDate === today
            ? `Vence hoje · prazo da etapa: ${pluralize(alert.deadlineDays, "dia", "dias")}`
            : `Vence em ${formatShortDate(alert.dueDate)} · prazo da etapa: ${pluralize(alert.deadlineDays, "dia", "dias")}`,
      };
  }
}

export function formatGift(opportunity: OpportunitySummary) {
  const [item, ...otherItems] = opportunity.items;
  if (!item) return null;
  const extra = otherItems.length > 0 ? ` +${otherItems.length}` : "";
  return `${item.description} · ${formatQuantity(item.quantity)}${extra}`;
}

export function formatInstantDate(instant: string | null) {
  return instant ? formatDate(toCalendarDate(instant)) : null;
}

export function moveCardInList(list: OpportunityList, id: number, toStage: Stage): OpportunityList {
  return {
    ...list,
    opportunities: list.opportunities.map((card) => (card.id === id ? { ...card, stage: toStage } : card)),
  };
}

export function suggestEstimatedValue(items: { quantity?: number | null; unitValue?: number | null }[]) {
  let total = 0;
  for (const item of items) {
    if (!item.quantity || !item.unitValue) continue;
    total += item.quantity * item.unitValue;
  }
  return total > 0 ? Math.round(total * 100) / 100 : null;
}

export function isNextSnoozeEscalating(opportunity: OpportunitySummary) {
  return opportunity.snoozeCount >= 1;
}

export function findMove(opportunity: OpportunitySummary, stage: FunnelStage) {
  return opportunity.moves.find((move) => move.stage === stage) ?? null;
}
