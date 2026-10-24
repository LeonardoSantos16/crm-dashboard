import { AlarmClockOff, CircleCheck, ClockAlert, Siren } from "lucide-react";
import type { SituationChip } from "../_types/board";

export const CONTROL_HEIGHT = "h-11 md:h-9";

export const SITUATION_CHIPS: SituationChip[] = [
  {
    situation: "ATTENTION",
    icon: ClockAlert,
    iconClassName: "text-attention-solid",
    pressedClassName: "border-attention-solid bg-attention-bg text-attention-fg",
  },
  {
    situation: "SNOOZED",
    icon: AlarmClockOff,
    iconClassName: "text-snoozed-solid",
    pressedClassName: "border-snoozed-solid bg-snoozed-bg text-snoozed-fg",
  },
  {
    situation: "ESCALATED",
    icon: Siren,
    iconClassName: "text-escalated-solid",
    pressedClassName: "border-escalated-solid bg-escalated-bg text-escalated-fg",
  },
  {
    situation: "ON_TIME",
    icon: CircleCheck,
    iconClassName: "text-success-solid",
    pressedClassName: "border-success-solid bg-success-bg text-success-fg",
  },
];
