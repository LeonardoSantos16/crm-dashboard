import { useMutation } from "@tanstack/react-query";
import { useSyncOpportunity } from "@/hooks/opportunities/useSyncOpportunity";
import { api } from "@/lib/axios";
import type {
  CommentInput,
  FollowUpInput,
  LoseInput,
  OpportunityDetail,
  SnoozeInput,
} from "@/types/api";
import type { ActionPath } from "@/types/opportunity";

const useOpportunityAction = <TInput>(id: number, path: ActionPath) => {
  const syncOpportunity = useSyncOpportunity();

  return useMutation({
    mutationFn: async (input: TInput) => {
      const response = await api.post<OpportunityDetail>(`/opportunities/${id}/${path}`, input);
      return response.data;
    },
    onSuccess: syncOpportunity,
  });
};

export const useFollowUp = (id: number) => useOpportunityAction<FollowUpInput>(id, "follow-up");

export const useSnooze = (id: number) => useOpportunityAction<SnoozeInput>(id, "snooze");

export const useLoseOpportunity = (id: number) => useOpportunityAction<LoseInput>(id, "lose");

export const useComment = (id: number) => useOpportunityAction<CommentInput>(id, "comments");
