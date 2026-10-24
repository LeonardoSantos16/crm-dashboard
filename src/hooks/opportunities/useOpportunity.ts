import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "@/lib/axios";
import type { OpportunityDetail } from "@/types/api";
import { opportunityKey } from "@/utils/queryKeys";

export const useOpportunity = (id: number | null) => {
  const { user } = useCurrentUser();
  const userId = user?.id;

  return useQuery({
    queryKey: opportunityKey(userId, id),
    queryFn: async () => {
      const response = await api.get<OpportunityDetail>(`/opportunities/${id}`);
      return response.data;
    },
    enabled: userId !== undefined && id !== null,
  });
};
