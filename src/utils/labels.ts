import type { AlertState, FunnelStage, Stage, UserRole } from "@/types/api";

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
