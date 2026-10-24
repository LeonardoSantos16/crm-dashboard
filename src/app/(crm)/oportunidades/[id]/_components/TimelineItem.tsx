import { useMemo } from "react";
import type { TimelineItemProps } from "../_types/detail";
import { TIMELINE_TONE_STYLES, describeTimelineEntry, describeTimelineMeta } from "../_utils/detail";

export const TimelineItem = ({ entry }: TimelineItemProps) => {
  const view = useMemo(() => describeTimelineEntry(entry), [entry]);

  return (
    <li className="flex gap-3 border-t border-border px-4 py-3">
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${TIMELINE_TONE_STYLES[view.tone]}`}
      >
        <view.icon aria-hidden="true" className="size-4" />
      </span>
      <p className="flex min-w-0 flex-col text-sm">
        <span className="break-words">{view.text}</span>
        <span className="text-xs text-ink-soft">{describeTimelineMeta(entry)}</span>
      </p>
    </li>
  );
};
