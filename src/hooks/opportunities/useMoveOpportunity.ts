import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncOpportunity } from "@/hooks/opportunities/useSyncOpportunity";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/axios";
import type { OpportunityDetail, OpportunityList } from "@/types/api";
import type { MoveRequest } from "@/types/opportunity";
import { getErrorMessage } from "@/utils/apiErrors";
import { STAGE_LABELS } from "@/utils/labels";
import { moveCardInList } from "@/utils/opportunity";
import { OPPORTUNITIES_KEY, opportunityKey } from "@/utils/queryKeys";

export const useMoveOpportunity = () => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const syncOpportunity = useSyncOpportunity();
  const { showToast } = useToast();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ id, ...input }: MoveRequest) => {
      const response = await api.post<OpportunityDetail>(`/opportunities/${id}/move`, input);
      return response.data;
    },
    onMutate: async ({ id, toStage }) => {
      const detailKey = opportunityKey(userId, id);
      await queryClient.cancelQueries({ queryKey: [OPPORTUNITIES_KEY] });
      const lists = queryClient.getQueriesData<OpportunityList>({ queryKey: [OPPORTUNITIES_KEY] });
      const detail = queryClient.getQueryData<OpportunityDetail>(detailKey);
      queryClient.setQueriesData<OpportunityList>({ queryKey: [OPPORTUNITIES_KEY] }, (list) =>
        list ? moveCardInList(list, id, toStage) : list,
      );
      if (detail) queryClient.setQueryData(detailKey, { ...detail, stage: toStage });
      return { lists, detail, detailKey };
    },
    onError: (error, request, context) => {
      context?.lists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.detail) queryClient.setQueryData(context.detailKey, context.detail);
      if (!request.complete) {
        showToast({
          tone: "error",
          message: `Não foi possível mover para ${STAGE_LABELS[request.toStage]}: ${getErrorMessage(error)}`,
        });
      }
    },
    onSuccess: (detail) => {
      syncOpportunity(detail);
      showToast({ tone: "success", message: `${detail.code} movida para ${STAGE_LABELS[detail.stage]}.` });
    },
  });
};
