import { ChevronDown } from "lucide-react";
import type { SelectProps } from "../_types/board";
import { CONTROL_HEIGHT } from "../_utils/toolbar";

export const Select = ({ label, value, onChange, children }: SelectProps) => (
  <label className="flex items-center gap-2 text-sm text-ink-soft">
    {label}
    <span className="relative flex items-center">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL_HEIGHT} cursor-pointer appearance-none rounded-md border border-border-strong bg-surface pr-8 pl-3 text-base font-medium text-ink md:text-sm`}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 size-4 text-ink-soft" />
    </span>
  </label>
);
