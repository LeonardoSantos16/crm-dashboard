import type { Metadata } from "next";
import { Suspense } from "react";
import { Board } from "./_components/Board";
import { BoardSkeleton } from "./_components/BoardSkeleton";

export const metadata: Metadata = { title: "Oportunidades" };

const OpportunitiesPage = () => (
  <Suspense
    fallback={
      <div className="px-4 py-5 md:px-6">
        <BoardSkeleton />
      </div>
    }
  >
    <Board />
  </Suspense>
);

export default OpportunitiesPage;
