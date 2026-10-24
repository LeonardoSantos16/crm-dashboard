import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailSkeleton } from "./_components/DetailSkeleton";
import { OpportunityDetailView } from "./_components/OpportunityDetailView";

export const metadata: Metadata = { title: "Oportunidade" };

const OpportunityPage = () => (
  <Suspense fallback={<DetailSkeleton />}>
    <OpportunityDetailView />
  </Suspense>
);

export default OpportunityPage;
