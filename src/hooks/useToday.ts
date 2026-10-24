import { useSyncExternalStore } from "react";
import { getToday, subscribeToday } from "@/lib/today";

export function useToday() {
  return useSyncExternalStore(subscribeToday, getToday, () => null);
}
