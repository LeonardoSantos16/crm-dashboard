"use client";

import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export function FeedbackDemo() {
  const [retries, setRetries] = useState(0);
  const [cleared, setCleared] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <ErrorState
          message="Não foi possível carregar as oportunidades."
          onRetry={() => setRetries((n) => n + 1)}
        />
        <p className="text-xs text-ink-soft">Tentativas: {retries}</p>
      </div>
      <div className="rounded-sm border border-border bg-surface">
        <EmptyState
          message={cleared ? "Filtros limpos." : "Nenhuma oportunidade com esses filtros."}
          action={cleared ? undefined : { label: "Limpar filtros", onClick: () => setCleared(true) }}
        />
      </div>
    </div>
  );
}
