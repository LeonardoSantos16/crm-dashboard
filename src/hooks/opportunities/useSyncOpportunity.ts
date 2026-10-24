import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { OpportunityDetail } from "@/types/api";
import { OPPORTUNITIES_KEY, opportunityKey } from "@/utils/queryKeys";

export const useSyncOpportunity = () => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useCallback(
    (detail: OpportunityDetail) => {
      queryClient.setQueryData(opportunityKey(userId, detail.id), detail);
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_KEY] });
    },
    [queryClient, userId],
  );
};
