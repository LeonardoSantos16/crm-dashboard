import type { AlertState, FollowUpChannel, FunnelStage, LossReason, Stage, UserRole } from "@/types/api";

export const ROLE_LABELS: Record<UserRole, string> = {
  MANAGER: "gestor",
  SELLER: "vendedor",
};

export const FUNNEL_STAGES: FunnelStage[] = ["FIRST_CONTACT", "BUDGET_PRESENTATION", "FOLLOW_UP", "FORECAST", "CLOSING"];

export const STAGE_LABELS: Record<Stage, string> = {
  FIRST_CONTACT: "Primeiro Contato",
  BUDGET_PRESENTATION: "Apresentação de Orçamento",
  FOLLOW_UP: "Follow-up",
  FORECAST: "Forecast",
  CLOSING: "Fechamento",
  LOST: "Perdida",
};

export const SITUATION_LABELS: Record<AlertState, string> = {
  ATTENTION: "Atrasada",
  SNOOZED: "Adiada",
  ESCALATED: "Escalonada",
  ON_TIME: "Em dia",
};

export const CHANNEL_LABELS: Record<FollowUpChannel, string> = {
  CALL: "Ligação",
  WHATSAPP: "WhatsApp",
  EMAIL: "E-mail",
  MEETING: "Reunião",
};

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  PRICE: "Preço",
  DELIVERY_TIME: "Prazo de entrega",
  COMPETITOR: "Escolheu concorrente",
  NO_BUDGET: "Sem orçamento",
  NO_RESPONSE: "Sem resposta do cliente",
  OTHER: "Outro",
};

export const ESCALATION_CAUSE_LABELS: Record<"DEADLINE" | "SNOOZES", string> = {
  DEADLINE: "prazo da etapa vencido",
  SNOOZES: "2º adiamento seguido",
};

export const EMPTY_VALUE = "Não informado";

export const FOLLOW_UP_CHANNELS: FollowUpChannel[] = ["CALL", "WHATSAPP", "EMAIL", "MEETING"];

export const LOSS_REASONS: LossReason[] = ["PRICE", "DELIVERY_TIME", "COMPETITOR", "NO_BUDGET", "NO_RESPONSE", "OTHER"];
