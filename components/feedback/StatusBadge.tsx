import {
  AlarmClockOff,
  CircleAlert,
  CircleCheck,
  CircleX,
  ClockAlert,
  Siren,
  type LucideIcon,
} from "lucide-react";

export type StatusState = "attention" | "error" | "success" | "lost" | "snoozed" | "escalated";

const states: Record<StatusState, { label: string; icon: LucideIcon; className: string }> = {
  attention: { label: "Atenção", icon: ClockAlert, className: "bg-attention-bg text-attention-fg" },
  error: { label: "Erro", icon: CircleAlert, className: "bg-error-bg text-error-fg" },
  success: { label: "Fechada", icon: CircleCheck, className: "bg-success-bg text-success-fg" },
  lost: { label: "Perdida", icon: CircleX, className: "bg-lost-bg text-lost-fg" },
  snoozed: { label: "Adiada", icon: AlarmClockOff, className: "bg-snoozed-bg text-snoozed-fg" },
  escalated: { label: "Escalonada", icon: Siren, className: "bg-escalated-bg text-escalated-fg" },
};

type StatusBadgeProps = {
  state: StatusState;
  label?: string;
};

export function StatusBadge({ state, label }: StatusBadgeProps) {
  const { label: defaultLabel, icon: Icon, className } = states[state];
  return (
    <span
      data-state={state}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.25} />
      {label ?? defaultLabel}
    </span>
  );
}

const alertSeverity = ["escalated", "attention", "snoozed"] as const;

export type AlertState = (typeof alertSeverity)[number];

export function pickAlertState(states: readonly StatusState[]): AlertState | undefined {
  return alertSeverity.find((state) => states.includes(state));
}
