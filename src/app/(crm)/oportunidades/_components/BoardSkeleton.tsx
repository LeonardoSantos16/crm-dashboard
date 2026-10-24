import { LoadingRegion, Skeleton } from "@/components/feedback/Skeleton";
import type { FunnelStage } from "@/types/api";
import { FUNNEL_STAGES, STAGE_LABELS } from "@/utils/labels";

const SKELETON_CARDS = [0, 1, 2];

export const BoardSkeleton = () => {
  const renderCard = (index: number) => (
    <div key={index} className="flex flex-col gap-2 rounded-md border border-border bg-surface px-3 py-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-12" />
    </div>
  );

  const renderColumn = (stage: FunnelStage) => (
    <div key={stage} className="flex flex-col gap-2">
      <div className="flex min-h-16 flex-col justify-end gap-1 border-b-2 border-border pb-2">
        <p aria-hidden="true" className="font-mono text-xs font-bold tracking-wide uppercase">
          {STAGE_LABELS[stage]}
        </p>
        <Skeleton className="h-4 w-6" />
      </div>
      {SKELETON_CARDS.map(renderCard)}
    </div>
  );

  return (
    <LoadingRegion label="Carregando oportunidades" className="grid min-w-300 grid-cols-5 gap-3">
      {FUNNEL_STAGES.map(renderColumn)}
    </LoadingRegion>
  );
};
