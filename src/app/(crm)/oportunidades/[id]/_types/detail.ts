import type { LucideIcon } from "lucide-react";
import type { GiftItem, OpportunityDetail, TimelineEntry } from "@/types/api";

export type TimelineTone = "neutral" | "follow" | "snoozed" | "lost" | "escalated";

export type TimelineView = {
  icon: LucideIcon;
  tone: TimelineTone;
  text: string;
};

export type DetailSectionProps = {
  opportunity: OpportunityDetail;
  today: string | null;
};

export type GiftItemsTableProps = {
  items: GiftItem[];
};

export type ActivityProps = {
  opportunity: OpportunityDetail;
};

export type CommentFormProps = {
  opportunityId: number;
};

export type TimelineItemProps = {
  entry: TimelineEntry;
};
