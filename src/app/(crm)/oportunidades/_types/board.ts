import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { AlertState, FunnelStage, OpportunityCard, User } from "@/types/api";

export type BoardFilters = {
  q: string;
  situation: AlertState[];
  ownerId: number | null;
  sort: "priority" | "value";
  allClosed: boolean;
  includeLost: boolean;
};

export type SetBoardFilters = (patch: Partial<BoardFilters>) => void;

export type BoardColumnData = {
  stage: FunnelStage;
  cards: OpportunityCard[];
  lostCards: OpportunityCard[];
  alertCount: number;
};

export type CardBandTone = "attention" | "escalated" | "snoozed" | "lost" | "event";

export type CardBand = {
  tone: CardBandTone;
  icon: LucideIcon;
  text: string;
};

export type SituationChip = {
  situation: AlertState;
  icon: LucideIcon;
  iconClassName: string;
  pressedClassName: string;
};

export type CardDragHandle = {
  ref: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
};

export type CardDragData = {
  card: OpportunityCard;
};

export type OpportunityCardProps = {
  card: OpportunityCard;
  today: string | null;
  isOwnerVisible: boolean;
  isOpen: boolean;
  onOpen: (id: number) => void;
  dragHandle?: CardDragHandle;
  isDragging?: boolean;
  isOverlay?: boolean;
};

export type DraggableOpportunityCardProps = Omit<OpportunityCardProps, "dragHandle" | "isDragging" | "isOverlay"> & {
  isDragEnabled: boolean;
};

export type BoardColumnProps = {
  column: BoardColumnData;
  today: string | null;
  isOwnerVisible: boolean;
  isAllClosed: boolean;
  onToggleAllClosed: () => void;
  openId: number | null;
  onOpen: (id: number) => void;
  isDragEnabled: boolean;
};

export type BoardToolbarProps = {
  filters: BoardFilters;
  onChange: SetBoardFilters;
  team: User[];
  needsAttention: number | undefined;
};

export type BoardEmptyProps = {
  filters: BoardFilters;
  isManager: boolean;
  onChange: SetBoardFilters;
};

export type SearchInputProps = {
  value: string;
  onSearch: (value: string) => void;
};

export type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

export type OpportunityPanelProps = {
  id: number;
  today: string | null;
  onClose: () => void;
};
