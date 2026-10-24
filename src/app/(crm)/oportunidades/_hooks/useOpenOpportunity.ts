import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseOpenId, writeOpenId } from "../_utils/panel";

export const useOpenOpportunity = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const openId = useMemo(() => parseOpenId(new URLSearchParams(searchParams)), [searchParams]);

  const setOpenId = useCallback(
    (id: number | null) => {
      const query = writeOpenId(new URLSearchParams(window.location.search), id).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return { openId, setOpenId };
};
