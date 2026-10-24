import type { AlertState, ListQuery } from "@/types/api";
import type { BoardFilters } from "../_types/board";

const SITUATIONS: AlertState[] = ["ATTENTION", "SNOOZED", "ESCALATED", "ON_TIME"];
const FILTER_KEYS = ["q", "situation", "ownerId", "sort", "allClosed", "includeLost"];

export const NEEDS_ATTENTION: AlertState[] = ["ATTENTION", "ESCALATED"];

export function parseFilters(params: URLSearchParams): BoardFilters {
  const ownerId = Number(params.get("ownerId"));
  return {
    q: params.get("q") ?? "",
    situation: SITUATIONS.filter((situation) => params.getAll("situation").includes(situation)),
    ownerId: Number.isInteger(ownerId) && ownerId > 0 ? ownerId : null,
    sort: params.get("sort") === "value" ? "value" : "priority",
    allClosed: params.get("allClosed") === "true",
    includeLost: params.get("includeLost") === "true",
  };
}

export function writeFilters(params: URLSearchParams, filters: BoardFilters) {
  FILTER_KEYS.forEach((key) => params.delete(key));
  if (filters.q) params.set("q", filters.q);
  filters.situation.forEach((situation) => params.append("situation", situation));
  if (filters.ownerId !== null) params.set("ownerId", String(filters.ownerId));
  if (filters.sort === "value") params.set("sort", "value");
  if (filters.allClosed) params.set("allClosed", "true");
  if (filters.includeLost) params.set("includeLost", "true");
  return params;
}

export function toListQuery(filters: BoardFilters, canFilterOwner: boolean): ListQuery {
  return {
    q: filters.q || undefined,
    situation: filters.situation.length > 0 ? filters.situation : undefined,
    ownerId: canFilterOwner && filters.ownerId !== null ? filters.ownerId : undefined,
    sort: filters.sort === "value" ? "value" : undefined,
    allClosed: filters.allClosed || undefined,
    includeLost: filters.includeLost || undefined,
  };
}

export function isNeedsAttention(situation: AlertState[]) {
  return situation.length === NEEDS_ATTENTION.length && NEEDS_ATTENTION.every((item) => situation.includes(item));
}

export function toggleSituation(situation: AlertState[], item: AlertState) {
  return situation.includes(item) ? situation.filter((current) => current !== item) : [...situation, item];
}

export function hasNarrowingFilters(filters: BoardFilters, isManager: boolean) {
  return filters.situation.length > 0 || (isManager && filters.ownerId !== null);
}
