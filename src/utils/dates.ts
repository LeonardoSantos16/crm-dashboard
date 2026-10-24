import type { CalendarDate, IsoInstant } from "@/types/api";

const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = "America/Sao_Paulo";

export const EVENT_NEAR_DAYS = 7;
export const MAX_DAYS_AHEAD = 30;

function toUtcMs(date: CalendarDate) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  return new Date(toUtcMs(date) + days * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(from: CalendarDate, to: CalendarDate) {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

export function formatDate(date: CalendarDate) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function formatShortDate(date: CalendarDate) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(instant: IsoInstant) {
  return dateTimeFormat.format(new Date(instant)).replace(",", "");
}

const calendarDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function toCalendarDate(instant: IsoInstant): CalendarDate {
  return calendarDateFormat.format(new Date(instant));
}

export function expiredDays(validUntil: CalendarDate, today: CalendarDate) {
  const days = daysBetween(validUntil, today);
  return days > 0 ? days : null;
}

export function isEventNear(eventDate: CalendarDate, today: CalendarDate) {
  const days = daysBetween(today, eventDate);
  return days >= 0 && days <= EVENT_NEAR_DAYS;
}

export function nextDateRange(today: CalendarDate) {
  return { min: addDays(today, 1), max: addDays(today, MAX_DAYS_AHEAD) };
}
