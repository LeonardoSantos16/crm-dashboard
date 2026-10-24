import type { ActivityProps } from "../_types/detail";
import { CommentForm } from "./CommentForm";
import { TimelineItem } from "./TimelineItem";

export const ActivitySection = ({ opportunity }: ActivityProps) => (
  <section aria-labelledby="activity-heading" className="min-w-0 rounded-md border border-border bg-surface shadow-card">
    <header className="flex min-h-14 items-center border-b border-border px-4 py-2.5">
      <h2 id="activity-heading" className="label text-ink">
        Atividade
      </h2>
    </header>
    <CommentForm opportunityId={opportunity.id} />
    <ol aria-label="Linha do tempo">
      {opportunity.timeline.map((entry, index) => (
        <TimelineItem key={`${entry.type}-${entry.at}-${index}`} entry={entry} />
      ))}
    </ol>
  </section>
);
