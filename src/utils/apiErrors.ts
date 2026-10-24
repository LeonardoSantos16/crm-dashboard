import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiError, ApiErrorBody, MissingField, MoveBlockReason, ValidationIssue } from "@/types/api";

export const MOVE_BLOCK_REASON_LABELS: Record<MoveBlockReason, string> = {
  FINAL_STAGE: "Etapa final: não muda mais",
  NO_RETURN_TO_FIRST_CONTACT: "Não volta para Primeiro Contato",
  ONLY_FROM_FORECAST: "Só a partir de Forecast",
  RETURN_NOT_ALLOWED: "Retorno não permitido",
  ONE_STEP_AT_A_TIME: "Avança uma etapa por vez",
  SAME_STAGE: "Já está nesta etapa",
  USE_LOSE_ACTION: "Use “Marcar como perdida”",
};

const MISSING_FIELD_LABELS: Record<MissingField, string> = {
  estimatedValue: "valor estimado",
  items: "item de brinde",
};

export function describeMissing(missing: MissingField[]) {
  return `Falta ${missing.map((field) => MISSING_FIELD_LABELS[field]).join(" e ")}`;
}

const NETWORK_ERROR_MESSAGE = "Não foi possível falar com a API. Verifique sua conexão e tente de novo.";

export function getApiError(error: unknown): ApiError | null {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return null;
  return error.response?.data?.error ?? null;
}

export function isNotFoundError(error: unknown) {
  return getApiError(error)?.code === "NOT_FOUND";
}

export function getErrorMessage(error: unknown) {
  const apiError = getApiError(error);
  if (!apiError) return NETWORK_ERROR_MESSAGE;

  switch (apiError.code) {
    case "VALIDATION_ERROR":
      return "Confira os campos destacados.";
    case "INVALID_JSON":
      return "Não foi possível enviar os dados. Tente de novo.";
    case "UNAUTHENTICATED":
      return "Usuário de demonstração inválido. Escolha outro em “Entrando como”.";
    case "FORBIDDEN":
      return "Você não tem permissão para esta ação.";
    case "NOT_FOUND":
      return "Oportunidade não encontrada.";
    case "INVALID_TRANSITION":
      return MOVE_BLOCK_REASON_LABELS[apiError.details.reason];
    case "FINAL_STAGE":
      return "A oportunidade está numa etapa final e não pode mais ser alterada.";
    case "STAGE_CONFLICT":
      return "A etapa mudou enquanto você salvava. Atualize e tente de novo.";
    case "MISSING_VALUE_OR_ITEMS":
      return describeMissing(apiError.details.missing);
    case "INTERNAL_ERROR":
      return "Algo deu errado na API. Tente de novo.";
  }
}

function describeIssue(issue: ValidationIssue) {
  switch (issue.code) {
    case "too_small":
      return issue.minimum === 1 && issue.origin === "string" ? "Campo obrigatório" : "Valor abaixo do mínimo";
    case "too_big":
      return issue.origin === "string" ? "Texto longo demais" : "Valor acima do máximo";
    case "invalid_format":
      return issue.format === "email" ? "E-mail inválido" : "Formato inválido";
    default:
      return "Valor inválido";
  }
}

export function applyValidationErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  const apiError = getApiError(error);
  if (apiError?.code !== "VALIDATION_ERROR") return false;
  for (const issue of apiError.details) {
    setError(issue.path.join(".") as Path<T>, { message: describeIssue(issue) });
  }
  return apiError.details.length > 0;
}
