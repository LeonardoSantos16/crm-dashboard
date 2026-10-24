import { AlarmClockOff, ArrowRight, CirclePlus, CircleX, MessageSquare, Siren, Undo2 } from "lucide-react";
import type { GiftItem, OpportunityDetail, TimelineEntry } from "@/types/api";
import { formatDateTime, formatShortDate } from "@/utils/dates";
import { CHANNEL_LABELS, ESCALATION_CAUSE_LABELS, LOSS_REASON_LABELS, STAGE_LABELS } from "@/utils/labels";
import type { TimelineTone, TimelineView } from "../_types/detail";

export const TIMELINE_TONE_STYLES: Record<TimelineTone, string> = {
  neutral: "bg-paper-shade text-ink-soft",
  follow: "bg-success-bg text-success-solid",
  snoozed: "bg-snoozed-bg text-snoozed-solid",
  lost: "bg-lost-bg text-lost-solid",
  escalated: "bg-escalated-bg text-escalated-solid",
};

export function parseId(value: string | string[] | undefined) {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function quote(text: string | null) {
  return text ? `“${text}”` : null;
}

function joinParts(parts: (string | null)[]) {
  return parts.filter(Boolean).join(" · ");
}

export function describeTimelineEntry(entry: TimelineEntry): TimelineView {
  switch (entry.type) {
    case "CREATED":
      return { icon: CirclePlus, tone: "neutral", text: `Oportunidade criada em ${STAGE_LABELS[entry.stage]}` };
    case "STAGE_CHANGE":
      return {
        icon: ArrowRight,
        tone: "neutral",
        text: `${STAGE_LABELS[entry.fromStage]} → ${STAGE_LABELS[entry.toStage]}`,
      };
    case "LOST":
      return {
        icon: CircleX,
        tone: "lost",
        text: joinParts([
          "Marcada como perdida",
          entry.reason ? LOSS_REASON_LABELS[entry.reason] : null,
          quote(entry.detail),
        ]),
      };
    case "FOLLOW_UP":
      return {
        icon: Undo2,
        tone: "follow",
        text: joinParts([
          "Retornado",
          entry.channel ? CHANNEL_LABELS[entry.channel] : null,
          quote(entry.summary),
          entry.nextDate ? `próximo contato em ${formatShortDate(entry.nextDate)}` : null,
        ]),
      };
    case "SNOOZE":
      return {
        icon: AlarmClockOff,
        tone: "snoozed",
        text: joinParts([`Adiada até ${formatShortDate(entry.until)}`, quote(entry.reason)]),
      };
    case "COMMENT":
      return { icon: MessageSquare, tone: "neutral", text: `“${entry.body}”` };
    case "ESCALATED":
      return {
        icon: Siren,
        tone: "escalated",
        text: `Escalonada para o gestor · ${ESCALATION_CAUSE_LABELS[entry.cause]}`,
      };
  }
}

export function describeTimelineMeta(entry: TimelineEntry) {
  const date = formatDateTime(entry.at);
  return entry.author ? `${entry.author.name} · ${date}` : date;
}

export function getSnoozeReason(opportunity: OpportunityDetail) {
  if (opportunity.alert?.state !== "SNOOZED") return null;
  const snooze = opportunity.timeline.find((entry) => entry.type === "SNOOZE");
  return snooze?.type === "SNOOZE" ? snooze.reason : null;
}

export function getItemTotal(item: GiftItem) {
  return item.unitValue === null ? null : item.unitValue * item.quantity;
}
