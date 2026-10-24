export function toNullableNumber(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}
