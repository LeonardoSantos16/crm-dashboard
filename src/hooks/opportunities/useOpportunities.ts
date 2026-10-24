import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "@/lib/axios";
import type { ListQuery, OpportunityList } from "@/types/api";
import { opportunitiesKey } from "@/utils/queryKeys";

export const useOpportunities = (query: ListQuery) => {
  const { user } = useCurrentUser();
  const userId = user?.id;

  return useQuery({
    queryKey: opportunitiesKey(userId, query),
    queryFn: async () => {
      const response = await api.get<OpportunityList>("/opportunities", { params: query });
      return response.data;
    },
    enabled: userId !== undefined,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === userId ? previousData : undefined,
  });
};
