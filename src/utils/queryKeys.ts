import type { ListQuery } from "@/types/api";

export const OPPORTUNITIES_KEY = "opportunities";
export const OPPORTUNITY_KEY = "opportunity";

export function opportunitiesKey(userId: number | undefined, query: ListQuery) {
  return [OPPORTUNITIES_KEY, userId, query] as const;
}

export function opportunityKey(userId: number | undefined, id: number | null) {
  return [OPPORTUNITY_KEY, userId, id] as const;
}
