import { EmptyState } from "@/components/feedback/EmptyState";
import type { BoardEmptyProps } from "../_types/board";
import { hasNarrowingFilters } from "../_utils/filters";

export const BoardEmpty = ({ filters, isManager, onChange }: BoardEmptyProps) => {
  if (hasNarrowingFilters(filters, isManager)) {
    return (
      <EmptyState
        message="Nenhuma oportunidade com esses filtros."
        action={{ label: "Limpar filtros", onClick: () => onChange({ q: "", situation: [], ownerId: null }) }}
      />
    );
  }

  if (filters.q) {
    return (
      <EmptyState
        message={`Nenhuma oportunidade encontrada para “${filters.q}”.`}
        action={{ label: "Limpar busca", onClick: () => onChange({ q: "" }) }}
      />
    );
  }

  return <EmptyState message="Você ainda não tem oportunidades. Cadastre a primeira para começar a acompanhar o funil." />;
};
