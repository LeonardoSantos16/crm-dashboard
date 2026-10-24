"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { AlertSummary } from "@/components/opportunity/AlertSummary";
import { MissingDataNotice } from "@/components/opportunity/MissingDataNotice";
import { OpportunityActions } from "@/components/opportunity/OpportunityActions";
import { useOpportunity } from "@/hooks/opportunities/useOpportunity";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToday } from "@/hooks/useToday";
import type { OpportunityDetail } from "@/types/api";
import { isNotFoundError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { getSnoozeReason, parseId } from "../_utils/detail";
import { ActivitySection } from "./ActivitySection";
import { DataSection } from "./DataSection";
import { DetailSkeleton } from "./DetailSkeleton";

export const OpportunityDetailView = () => {
  const params = useParams<{ id: string }>();
  const id = parseId(params.id);
  const { user, isPending: isUserPending } = useCurrentUser();
  const opportunity = useOpportunity(id);
  const today = useToday();

  const snoozeReason = useMemo(
    () => (opportunity.data ? getSnoozeReason(opportunity.data) : null),
    [opportunity.data],
  );

  const renderBackLink = () => (
    <Link href="/oportunidades" className={`${BUTTON_STYLES.ghost} self-start`}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      Oportunidades
    </Link>
  );

  const renderMessage = (title: string, message: string) => (
    <div className="flex flex-col gap-3 px-4 py-5 md:px-6">
      {renderBackLink()}
      <h1 className="display-title">{title}</h1>
      <p className="text-sm text-ink-soft">{message}</p>
    </div>
  );

  const renderError = () => (
    <div className="flex max-w-160 flex-col gap-3 px-4 py-5 md:px-6">
      {renderBackLink()}
      <h1 className="sr-only">Erro ao carregar a oportunidade</h1>
      <ErrorState message="Não foi possível carregar a oportunidade." onRetry={() => opportunity.refetch()} />
    </div>
  );

    const renderView = () => {
    if (id === null) return renderMessage("Oportunidade não encontrada", "O endereço não aponta para uma oportunidade.");
    if (!user) {
      if (isUserPending) return <DetailSkeleton />;
      return renderMessage("Usuários indisponíveis", "Não foi possível carregar os usuários. Verifique se a API está no ar.");
    }
    if (opportunity.isPending) return <DetailSkeleton />;
    if (isNotFoundError(opportunity.error)) {
      return renderMessage("Oportunidade não encontrada", "Ela não existe ou não está visível para o usuário atual.");
    }
    if (opportunity.isError) return renderError();
    return renderContent(opportunity.data);
  };

  const renderContent = (data: OpportunityDetail) => (
    <>
      <header className="flex flex-col gap-3 border-b border-border px-4 pt-4 pb-5 md:px-6">
        {renderBackLink()}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="display-title">
              <span className="font-mono">{data.code}</span> · {data.company.name}
            </h1>
            <AlertSummary opportunity={data} today={today} snoozeReason={snoozeReason} variant="pill" />
          </div>
          <OpportunityActions opportunity={data} layout="header" />
        </div>
        <div className="max-w-160">
          <MissingDataNotice opportunity={data} />
        </div>
      </header>
      <div className="grid items-start gap-4 px-4 py-5 md:px-6 lg:grid-cols-2">
        <DataSection opportunity={data} today={today} />
        <ActivitySection opportunity={data} />
      </div>
    </>
  );
  
  return renderView();
};
