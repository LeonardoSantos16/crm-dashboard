import { DataList, DataRow } from "@/components/opportunity/DataList";
import { ProposalDate } from "@/components/opportunity/ProposalDate";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { formatDate } from "@/utils/dates";
import { formatCurrencyWithCents } from "@/utils/format";
import { STAGE_LABELS } from "@/utils/labels";
import { formatInstantDate, isFinalStage } from "@/utils/opportunity";
import type { DetailSectionProps } from "../_types/detail";
import { GiftItemsTable } from "./GiftItemsTable";

export const DataSection = ({ opportunity, today }: DetailSectionProps) => {
  const renderEditButton = () =>
    !isFinalStage(opportunity.stage) && (
      <button type="button" disabled className={BUTTON_STYLES.secondary}>
        Editar
      </button>
    );

  const renderSubheading = (text: string) => (
    <h3 className="label border-t border-border px-4 pt-3 text-ink">{text}</h3>
  );

  return (
    <section aria-labelledby="data-heading" className="min-w-0 rounded-md border border-border bg-surface shadow-card">
      <header className="flex min-h-14 items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <h2 id="data-heading" className="label text-ink">
          Dados
        </h2>
        {renderEditButton()}
      </header>
      <DataList>
        <DataRow label="Empresa">{opportunity.company.name}</DataRow>
        <DataRow label="Contato">{opportunity.contactName}</DataRow>
        <DataRow label="Telefone">{opportunity.contactPhone}</DataRow>
        <DataRow label="E-mail">{opportunity.contactEmail}</DataRow>
        <DataRow label="Vendedor">{opportunity.owner.name}</DataRow>
        <DataRow label="Etapa">
          {STAGE_LABELS[opportunity.stage]} · desde {formatInstantDate(opportunity.stageEnteredAt)}
        </DataRow>
        <DataRow label="Valor estimado">
          {opportunity.estimatedValue !== null && (
            <span className="font-mono">{formatCurrencyWithCents(opportunity.estimatedValue)}</span>
          )}
        </DataRow>
      </DataList>
      {renderSubheading("Datas")}
      <DataList>
        <DataRow label="Último contato">
          {opportunity.lastContactAt && (
            <span className="font-mono">{formatInstantDate(opportunity.lastContactAt)}</span>
          )}
        </DataRow>
        <DataRow label="Validade">
          <ProposalDate validUntil={opportunity.proposalValidUntil} today={today} />
        </DataRow>
        <DataRow label="Evento">
          {opportunity.eventDate && <span className="font-mono">{formatDate(opportunity.eventDate)}</span>}
        </DataRow>
      </DataList>
      {renderSubheading("Itens de brinde")}
      <div className="pt-2 pb-3">
        <GiftItemsTable items={opportunity.items} />
      </div>
    </section>
  );
};
