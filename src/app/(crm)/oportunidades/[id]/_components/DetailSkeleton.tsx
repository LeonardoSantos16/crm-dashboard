import { LoadingRegion, Skeleton } from "@/components/feedback/Skeleton";

export const DetailSkeleton = () => (
  <LoadingRegion label="Carregando oportunidade" className="flex flex-col gap-5 px-6 py-5">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-8 w-80" />
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  </LoadingRegion>
);
