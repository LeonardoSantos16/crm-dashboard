import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncOpportunity } from "@/hooks/opportunities/useSyncOpportunity";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/axios";
import type { MoveInput, OpportunityDetail, OpportunityList } from "@/types/api";
import { getErrorMessage } from "@/utils/apiErrors";
import { STAGE_LABELS } from "@/utils/labels";
import { moveCardInList } from "@/utils/opportunity";
import { OPPORTUNITIES_KEY, opportunityKey } from "@/utils/queryKeys";

export const useMoveOpportunity = (id: number) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const syncOpportunity = useSyncOpportunity();
  const { showToast } = useToast();
  const detailKey = opportunityKey(user?.id, id);

  return useMutation({
    mutationFn: async (input: MoveInput) => {
      const response = await api.post<OpportunityDetail>(`/opportunities/${id}/move`, input);
      return response.data;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [OPPORTUNITIES_KEY] });
      const lists = queryClient.getQueriesData<OpportunityList>({ queryKey: [OPPORTUNITIES_KEY] });
      const detail = queryClient.getQueryData<OpportunityDetail>(detailKey);
      queryClient.setQueriesData<OpportunityList>({ queryKey: [OPPORTUNITIES_KEY] }, (list) =>
        list ? moveCardInList(list, id, input.toStage) : list,
      );
      if (detail) queryClient.setQueryData(detailKey, { ...detail, stage: input.toStage });
      return { lists, detail };
    },
    onError: (error, input, context) => {
      context?.lists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.detail) queryClient.setQueryData(detailKey, context.detail);
      if (!input.complete) {
        showToast({ tone: "error", message: `Não foi possível mover para ${STAGE_LABELS[input.toStage]}: ${getErrorMessage(error)}` });
      }
    },
    onSuccess: (detail) => {
      syncOpportunity(detail);
      showToast({ tone: "success", message: `${detail.code} movida para ${STAGE_LABELS[detail.stage]}.` });
    },
  });
};
