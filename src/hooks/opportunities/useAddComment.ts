import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "@/lib/axios";
import type { CommentInput, OpportunityDetail } from "@/types/api";
import { OPPORTUNITIES_KEY, opportunityKey } from "@/utils/queryKeys";

export const useAddComment = (id: number) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CommentInput) => {
      const response = await api.post<OpportunityDetail>(`/opportunities/${id}/comments`, input);
      return response.data;
    },
    onSuccess: (detail) => {
      queryClient.setQueryData(opportunityKey(user?.id, detail.id), detail);
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_KEY] });
    },
  });
};
