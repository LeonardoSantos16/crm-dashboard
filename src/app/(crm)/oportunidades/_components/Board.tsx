"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useOpportunities } from "@/hooks/opportunities/useOpportunities";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToday } from "@/hooks/useToday";
import { useBoardFilters } from "../_hooks/useBoardFilters";
import { useOpenOpportunity } from "../_hooks/useOpenOpportunity";
import { groupByStage } from "../_utils/board";
import { toListQuery } from "../_utils/filters";
import { detailPath } from "../_utils/panel";
import { BoardColumn } from "./BoardColumn";
import { BoardEmpty } from "./BoardEmpty";
import { BoardSkeleton } from "./BoardSkeleton";
import { BoardToolbar } from "./BoardToolbar";
import { OpportunityPanel } from "./OpportunityPanel";

export const Board = () => {
  const { user, users, isPending: isUserPending, refetch: refetchUsers } = useCurrentUser();
  const { filters, setFilters } = useBoardFilters();
  const { openId, setOpenId } = useOpenOpportunity();
  const router = useRouter();
  const today = useToday();
  const isManager = user?.role === "MANAGER";

  const query = useMemo(() => toListQuery(filters, isManager), [filters, isManager]);
  const opportunities = useOpportunities(query);

  const team = useMemo(
    () => (isManager && user ? users.filter((member) => member.managerId === user.id) : []),
    [isManager, user, users],
  );

  const columns = useMemo(
    () => groupByStage(opportunities.data?.opportunities ?? []),
    [opportunities.data],
  );

  const handleToggleAllClosed = useCallback(
    () => setFilters({ allClosed: !filters.allClosed }),
    [filters.allClosed, setFilters],
  );

  const handleOpen = useCallback(
    (id: number) => (id === openId ? router.push(detailPath(id)) : setOpenId(id)),
    [openId, router, setOpenId],
  );

  const handleClosePanel = useCallback(() => setOpenId(null), [setOpenId]);

  const renderMessage = (children: ReactNode) => <div className="max-w-160">{children}</div>;

  const renderUsersError = () =>
    renderMessage(
      <ErrorState
        message="Não foi possível carregar os usuários. Verifique se a API está no ar e tente de novo."
        onRetry={() => refetchUsers()}
      />,
    );

  const renderLoadError = () =>
    renderMessage(
      <ErrorState
        message="Não foi possível carregar as oportunidades. Verifique sua conexão e tente de novo."
        onRetry={() => opportunities.refetch()}
      />,
    );

  const renderEmpty = () =>
    renderMessage(<BoardEmpty filters={filters} isManager={isManager} onChange={setFilters} />);

  const renderColumns = () => (
    <div className="grid min-w-300 grid-cols-5 gap-3">
      {columns.map((column) => (
        <BoardColumn
          key={column.stage}
          column={column}
          today={today}
          isOwnerVisible={isManager}
          isAllClosed={filters.allClosed}
          onToggleAllClosed={handleToggleAllClosed}
          openId={openId}
          onOpen={handleOpen}
        />
      ))}
    </div>
  );

  const renderContent = () => {
    if (!user && !isUserPending) return renderUsersError();
    if (!user || opportunities.isPending) return <BoardSkeleton />;
    if (opportunities.isError) return renderLoadError();
    if (opportunities.data.opportunities.length === 0) return renderEmpty();
    return renderColumns();
  };

  const renderPanel = () =>
    openId !== null && user && <OpportunityPanel id={openId} today={today} onClose={handleClosePanel} />;

  return (
    <div className="flex flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="sr-only">Oportunidades</h1>
        <BoardToolbar
          filters={filters}
          onChange={setFilters}
          team={team}
          needsAttention={opportunities.data?.needsAttention}
        />
        <div className="flex-1 overflow-x-auto px-4 py-5 md:px-6">{renderContent()}</div>
      </div>
      {renderPanel()}
    </div>
  );
};
