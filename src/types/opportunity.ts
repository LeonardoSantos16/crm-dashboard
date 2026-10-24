import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { FollowUpChannel, FunnelStage, LossReason, MissingField, MoveInput, OpportunitySummary } from "@/types/api";

export type ActionPath = "follow-up" | "snooze" | "lose" | "comments";

export type StateTone = "attention" | "escalated" | "snoozed" | "lost" | "success";

export type AlertSummaryData = {
  tone: StateTone;
  icon: LucideIcon;
  title: string;
  text: string;
};

export type AlertSummaryProps = {
  opportunity: OpportunitySummary;
  today: string | null;
  snoozeReason?: string | null;
  variant?: "box" | "pill";
};

export type DataListProps = {
  children: ReactNode;
};

export type DataRowProps = {
  label: string;
  children?: ReactNode;
};

export type ProposalDateProps = {
  validUntil: string | null;
  today: string | null;
};

export type MissingDataNoticeProps = {
  opportunity: OpportunitySummary;
};

export type OpportunityActionsProps = {
  opportunity: OpportunitySummary;
  layout: "panel" | "header";
};

export type OpportunityDialogProps = {
  opportunity: OpportunitySummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type CompleteDataDialogProps = OpportunityDialogProps & {
  toStage: FunnelStage;
  missing: MissingField[];
};

export type CompleteDataRequest = {
  toStage: FunnelStage;
  missing: MissingField[];
};

export type MoveMenuProps = {
  opportunity: OpportunitySummary;
  onRequestComplete: (request: CompleteDataRequest) => void;
};

export type OpportunityDialog = "followUp" | "snooze" | "lost";

export type DialogHeadingProps = {
  opportunity: OpportunitySummary;
  showStage?: boolean;
};

export type ChannelPickerProps = {
  value: FollowUpChannel | null;
  onChange: (value: FollowUpChannel | null) => void;
};

export type LossReasonFieldValues = {
  reason: LossReason | undefined;
};

export type OpportunityNoticeProps = {
  opportunity: OpportunitySummary;
};

export type MoveRequest = MoveInput & {
  id: number;
};
