"use client";

import type { ChangeEvent } from "react";
import type { MoneyInputProps } from "@/types/form";
import { formatCurrencyWithCents } from "@/utils/format";
import { INPUT_CLASS } from "@/utils/formStyles";

function parseCents(text: string) {
  const digits = text.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : null;
}

export const MoneyInput = ({ id, value, onChange, onBlur, isInvalid = false, describedBy }: MoneyInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(parseCents(event.target.value));

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="R$ 0,00"
      value={value === null || value === undefined ? "" : formatCurrencyWithCents(value)}
      onChange={handleChange}
      onBlur={onBlur}
      aria-invalid={isInvalid ? "true" : undefined}
      aria-describedby={describedBy}
      className={`${INPUT_CLASS} font-mono`}
    />
  );
};
