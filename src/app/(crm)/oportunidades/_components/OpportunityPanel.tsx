"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingRegion, Skeleton } from "@/components/feedback/Skeleton";
import { AlertSummary } from "@/components/opportunity/AlertSummary";
import { DataList, DataRow } from "@/components/opportunity/DataList";
import { MissingDataNotice } from "@/components/opportunity/MissingDataNotice";
import { OpportunityActions } from "@/components/opportunity/OpportunityActions";
import { ProposalDate } from "@/components/opportunity/ProposalDate";
import { useOpportunity } from "@/hooks/opportunities/useOpportunity";
import type { OpportunityDetail } from "@/types/api";
import { isNotFoundError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { formatDate } from "@/utils/dates";
import { formatCurrencyWithCents } from "@/utils/format";
import { STAGE_LABELS } from "@/utils/labels";
import { formatGift, formatInstantDate } from "@/utils/opportunity";
import type { OpportunityPanelProps } from "../_types/board";
import { detailPath } from "../_utils/panel";

const TITLE_ID = "opportunity-panel-title";

export const OpportunityPanel = ({ id, today, onClose }: OpportunityPanelProps) => {
  const opportunity = useOpportunity(id);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, [id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !event.currentTarget.contains(event.target as Node)) return;
    onClose();
  };

  const renderCloseButton = () => (
    <button
      type="button"
      aria-label="Fechar painel"
      onClick={onClose}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink transition-colors hover:bg-paper-shade md:size-9"
    >
      <X aria-hidden="true" className="size-5" />
    </button>
  );

  const renderLoading = () => (
    <LoadingRegion label="Carregando oportunidade" className="flex flex-col gap-3 px-5 py-4">
      <h2 id={TITLE_ID} className="sr-only">
        Carregando oportunidade
      </h2>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-32 w-full" />
    </LoadingRegion>
  );

  const renderError = () => (
    <div className="flex flex-col gap-3 px-5 py-4">
      <h2 id={TITLE_ID} className="sr-only">
        Erro ao carregar a oportunidade
      </h2>
      {isNotFoundError(opportunity.error) ? (
        <p className="text-sm text-ink-soft">Oportunidade não encontrada.</p>
      ) : (
        <ErrorState message="Não foi possível carregar a oportunidade." onRetry={() => opportunity.refetch()} />
      )}
    </div>
  );

  const renderContent = (data: OpportunityDetail) => (
    <>
      <div className="flex flex-col gap-3 px-5 pb-4">
        <h2 id={TITLE_ID} className="text-xl font-bold">
          {data.company.name}
        </h2>
        <AlertSummary opportunity={data} today={today} />
        <MissingDataNotice opportunity={data} />
      </div>
      <section aria-label="Resumo" className="border-t border-border">
        <DataList>
          <DataRow label="Etapa">{STAGE_LABELS[data.stage]}</DataRow>
          <DataRow label="Valor estimado">
            {data.estimatedValue !== null && (
              <span className="font-mono">{formatCurrencyWithCents(data.estimatedValue)}</span>
            )}
          </DataRow>
          <DataRow label="Brinde">{formatGift(data)}</DataRow>
          <DataRow label="Vendedor">{data.owner.name}</DataRow>
          <DataRow label="Contato">{data.contactName}</DataRow>
        </DataList>
      </section>
      <section aria-label="Datas" className="border-t border-border">
        <DataList>
          <DataRow label="Último contato">
            {data.lastContactAt && <span className="font-mono">{formatInstantDate(data.lastContactAt)}</span>}
          </DataRow>
          <DataRow label="Validade">
            <ProposalDate validUntil={data.proposalValidUntil} today={today} />
          </DataRow>
          <DataRow label="Evento">
            {data.eventDate && <span className="font-mono">{formatDate(data.eventDate)}</span>}
          </DataRow>
        </DataList>
      </section>
      <div className="flex flex-col items-start gap-3 border-t border-border px-5 py-4">
        <div className="w-full">
          <OpportunityActions opportunity={data} layout="panel" />
        </div>
        <Link href={detailPath(data.id)} className={BUTTON_STYLES.ghost}>
          Abrir detalhes
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </>
  );

  const renderBody = () => {
    if (opportunity.isPending) return renderLoading();
    if (opportunity.isError) return renderError();
    return renderContent(opportunity.data);
  };

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-20 flex flex-col overflow-y-auto overscroll-contain bg-surface outline-none md:sticky md:inset-auto md:top-0 md:h-[calc(100dvh-3.5rem)] md:w-105 md:shrink-0 md:border-l md:border-border md:shadow-overlay"
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-3">
        <span className="font-mono text-xs font-medium tracking-wide text-ink-soft">{opportunity.data?.code}</span>
        {renderCloseButton()}
      </div>
      {renderBody()}
    </aside>
  );
};
