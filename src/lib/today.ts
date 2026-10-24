import type { CalendarDate } from "@/types/api";

let today: CalendarDate | null = null;
const listeners = new Set<() => void>();

export function getToday() {
  return today;
}

export function setToday(value: CalendarDate) {
  if (value === today) return;
  today = value;
  listeners.forEach((listener) => listener());
}

export function subscribeToday(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
