"use client";

import { Search } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import type { SearchInputProps } from "../_types/board";

const DEBOUNCE_MS = 300;

export const SearchInput = ({ value, onSearch }: SearchInputProps) => {
  const [text, setText] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }

  const search = useEffectEvent(onSearch);

  useEffect(() => {
    if (text.trim() === value) return;
    const timeout = setTimeout(() => search(text.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [text, value]);

  return (
    <label className="relative flex w-full max-w-75 items-center">
      <span className="sr-only">Buscar por código ou empresa</span>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-ink-soft" />
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Buscar por código ou empresa"
        className="h-11 w-full rounded-md border border-border-strong bg-surface pr-3 pl-9 text-base text-ink placeholder:text-ink-soft md:h-9 md:text-sm"
      />
    </label>
  );
};
