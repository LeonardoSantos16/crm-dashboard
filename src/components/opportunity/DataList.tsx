import type { DataListProps, DataRowProps } from "@/types/opportunity";
import { EMPTY_VALUE } from "@/utils/labels";

export const DataList = ({ children }: DataListProps) => (
  <dl className="grid grid-cols-[9.25rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2.5 px-4 py-3.5">{children}</dl>
);

export const DataRow = ({ label, children }: DataRowProps) => {
  const isEmpty = children === null || children === undefined || children === "";

  return (
    <div className="contents">
      <dt className="label text-ink-soft">{label}</dt>
      <dd className={`text-sm ${isEmpty ? "text-ink-soft" : ""}`}>{isEmpty ? EMPTY_VALUE : children}</dd>
    </div>
  );
};
