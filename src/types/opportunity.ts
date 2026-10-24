import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { OpportunitySummary } from "@/types/api";

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
