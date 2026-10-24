export const STAGES = [
  "FIRST_CONTACT",
  "BUDGET_PRESENTATION",
  "FOLLOW_UP",
  "FORECAST",
  "CLOSING",
  "LOST",
] as const;
export type Stage = (typeof STAGES)[number];
export type FunnelStage = Exclude<Stage, "LOST">;

export type UserRole = "SELLER" | "MANAGER";
export type AlertState = "ON_TIME" | "ATTENTION" | "SNOOZED" | "ESCALATED";
export type LossReason =
  | "PRICE"
  | "DELIVERY_TIME"
  | "COMPETITOR"
  | "NO_BUDGET"
  | "NO_RESPONSE"
  | "OTHER";
export type FollowUpChannel = "CALL" | "WHATSAPP" | "EMAIL" | "MEETING";
export type MoveBlockReason =
  | "FINAL_STAGE"
  | "SAME_STAGE"
  | "USE_LOSE_ACTION"
  | "NO_RETURN_TO_FIRST_CONTACT"
  | "ONLY_FROM_FORECAST"
  | "RETURN_NOT_ALLOWED"
  | "ONE_STEP_AT_A_TIME";
export type MissingField = "estimatedValue" | "items";

export type CalendarDate = string;
export type IsoInstant = string;

export type User = {
  id: number;
  name: string;
  role: UserRole;
  managerId: number | null;
};

export type Person = { id: number; name: string };

export type GiftItem = {
  id: number;
  description: string;
  quantity: number;
  unitValue: number | null;
};

export type Alert = {
  state: AlertState;
  dueDate: CalendarDate;
  idleDays: number;
  deadlineDays: number;
  consumedPct: number;
};

export type Move =
  | { stage: FunnelStage; allowed: true; missing?: MissingField[] }
  | { stage: FunnelStage; allowed: false; reason: MoveBlockReason };

type TimelineBase = { at: IsoInstant; author: Person | null };

export type TimelineEntry =
  | (TimelineBase & { type: "CREATED"; stage: Stage })
  | (TimelineBase & {
      type: "STAGE_CHANGE";
      fromStage: Stage;
      toStage: Stage;
    })
  | (TimelineBase & {
      type: "LOST";
      fromStage: Stage;
      reason: LossReason | null;
      detail: string | null;
    })
  | (TimelineBase & {
      type: "FOLLOW_UP";
      channel: FollowUpChannel | null;
      summary: string | null;
      nextDate: CalendarDate | null;
    })
  | (TimelineBase & {
      type: "SNOOZE";
      until: CalendarDate;
      reason: string | null;
    })
  | (TimelineBase & { type: "COMMENT"; body: string })
  | (TimelineBase & {
      type: "ESCALATED";
      author: null;
      date: CalendarDate;
      cause: "DEADLINE" | "SNOOZES";
    });

export type OpportunitySummary = {
  id: number;
  code: string;
  company: { id: number; name: string };
  owner: Person;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  estimatedValue: number | null;
  items: GiftItem[];
  proposalValidUntil: CalendarDate | null;
  eventDate: CalendarDate | null;
  stage: Stage;
  stageEnteredAt: IsoInstant;
  lastContactAt: IsoInstant | null;
  nextFollowUpAt: CalendarDate | null;
  snoozedUntil: CalendarDate | null;
  snoozeCount: number;
  lossReason: LossReason | null;
  lossDetail: string | null;
  alert: Alert | null;
  moves: Move[];
};

export type OpportunityCard = OpportunitySummary & {
  lostFromStage: Stage | null;
};

export type OpportunityDetail = OpportunitySummary & {
  timeline: TimelineEntry[];
};

export type OpportunityList = {
  opportunities: OpportunityCard[];
  needsAttention: number;
};

export type ListQuery = {
  q?: string;
  situation?: AlertState[];
  ownerId?: number;
  sort?: "priority" | "value";
  allClosed?: boolean;
  includeLost?: boolean;
};

export type ItemInput = {
  description: string;
  quantity: number;
  unitValue?: number;
};

export type CreateOpportunityInput = {
  companyName: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  ownerId?: number;
  item?: ItemInput;
  estimatedValue?: number;
};

export type UpdateOpportunityInput = {
  companyName?: string;
  contactName?: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  proposalValidUntil?: CalendarDate | null;
  eventDate?: CalendarDate | null;
  items?: ItemInput[];
  estimatedValue?: number | null;
};

export type MoveInput = {
  toStage: Stage;
  complete?: { estimatedValue?: number; items?: ItemInput[] };
};

export type LoseInput = { reason: LossReason; detail?: string };

export type FollowUpInput = {
  channel?: FollowUpChannel;
  summary?: string;
  nextDate?: CalendarDate;
};

export type SnoozeInput = { until: CalendarDate; reason?: string };

export type CommentInput = { body: string };

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_JSON"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INVALID_TRANSITION"
  | "FINAL_STAGE"
  | "STAGE_CONFLICT"
  | "MISSING_VALUE_OR_ITEMS"
  | "INTERNAL_ERROR";

export type ValidationIssue = {
  path: (string | number)[];
  message: string;
  code: string;
} & Record<string, unknown>;

export type ApiError =
  | {
      code: "VALIDATION_ERROR";
      message: string;
      details: ValidationIssue[];
    }
  | {
      code: "INVALID_TRANSITION";
      message: string;
      details: { reason: MoveBlockReason };
    }
  | {
      code: "MISSING_VALUE_OR_ITEMS";
      message: string;
      details: { missing: MissingField[] };
    }
  | {
      code: Exclude<
        ApiErrorCode,
        "VALIDATION_ERROR" | "INVALID_TRANSITION" | "MISSING_VALUE_OR_ITEMS"
      >;
      message: string;
      details?: undefined;
    };

export type ApiErrorBody = { error: ApiError };

export const TODAY_HEADER = "X-Today";
export const USER_HEADER = "X-User-Id";
