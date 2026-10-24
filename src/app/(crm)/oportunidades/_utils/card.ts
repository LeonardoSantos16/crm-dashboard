import { AlarmClockOff, CalendarDays, CircleX, ClockAlert, Siren } from "lucide-react";
import type { OpportunityCard } from "@/types/api";
import { formatShortDate, isEventNear } from "@/utils/dates";
import { pluralize } from "@/utils/format";
import type { CardBand, CardBandTone } from "../_types/board";

export const CARD_BAND_STYLES: Record<CardBandTone, { className: string; iconClassName: string }> = {
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
    className: "border-lost-solid bg-surface text-lost-fg",
    iconClassName: "text-lost-solid",
  },
  event: {
    className: "border-border bg-paper-shade text-ink",
    iconClassName: "text-ink-soft",
  },
};

function getStateBand(card: OpportunityCard): CardBand | null {
  if (card.stage === "LOST") return { tone: "lost", icon: CircleX, text: "Perdida" };
  switch (card.alert?.state) {
    case "ESCALATED":
      return { tone: "escalated", icon: Siren, text: "Escalonada" };
    case "ATTENTION":
      return { tone: "attention", icon: ClockAlert, text: `Parada ${pluralize(card.alert.idleDays, "dia", "dias")}` };
    case "SNOOZED":
      return {
        tone: "snoozed",
        icon: AlarmClockOff,
        text: card.snoozedUntil ? `Adiada · ${formatShortDate(card.snoozedUntil)}` : "Adiada",
      };
    default:
      return null;
  }
}

export function getCardBand(card: OpportunityCard, today: string | null): CardBand | null {
  const stateBand = getStateBand(card);
  const nearEvent = card.eventDate && today && isEventNear(card.eventDate, today) ? card.eventDate : null;
  if (!nearEvent) return stateBand;
  if (!stateBand) return { tone: "event", icon: CalendarDays, text: `Evento em ${formatShortDate(nearEvent)}` };
  return { ...stateBand, text: `${stateBand.text} · evento ${formatShortDate(nearEvent)}` };
}
