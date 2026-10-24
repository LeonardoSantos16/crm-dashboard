import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { BoardFilters, SetBoardFilters } from "../_types/board";
import { parseFilters, writeFilters } from "../_utils/filters";

export const useBoardFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams)), [searchParams]);

  const setFilters: SetBoardFilters = useCallback(
    (patch: Partial<BoardFilters>) => {
      const params = new URLSearchParams(window.location.search);
      const query = writeFilters(params, { ...parseFilters(params), ...patch }).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return { filters, setFilters };
};
