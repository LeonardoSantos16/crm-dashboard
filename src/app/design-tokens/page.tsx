import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingRegion, Skeleton } from "@/components/feedback/Skeleton";
import { StatusBadge, type StatusState } from "@/components/feedback/StatusBadge";
import { contrastPairs, contrastRatio, readColorTokens } from "../../../tests/design-system/contrast";
import { FeedbackDemo } from "./FeedbackDemo";
import { FormDemo } from "./FormDemo";

const statuses: StatusState[] = ["attention", "error", "success", "lost", "snoozed", "escalated"];

const typeScale = [
  { className: "label", name: "label · 11/16", sample: "Etapa · OPP-2001" },
  { className: "text-xs", name: "xs · 12/16", sample: "Atualizada há 2 horas" },
  { className: "text-sm", name: "sm · 14/20", sample: "Parada há 6 dias, sem resposta do cliente" },
  { className: "text-base", name: "base · 16/24", sample: "Marcar como retornado" },
  { className: "text-lg", name: "lg · 18/28", sample: "Brindes corporativos para fim de ano" },
  { className: "text-xl", name: "xl · 20/28", sample: "Proposta enviada" },
  { className: "display-title", name: "display-title · 24/32", sample: "Oportunidades de hoje" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="label text-ink-soft">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignTokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const tokens = readColorTokens();
  const colors = Object.entries(tokens);

  return (
    <div className="flex flex-col">
      <nav aria-label="Principal" className="nav-surface">
        <ul className="flex gap-1 px-4 md:px-6">
          {["Kanban", "Lista", "Equipe"].map((item) => {
            const active = item === "Kanban";
            return (
              <li key={item}>
                <a
                  href="#"
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center px-3 text-sm font-medium md:h-9 ${
                    active ? "text-crown underline decoration-2 underline-offset-8" : "text-moss"
                  }`}
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 md:px-6">
        <h1 className="display-title">Tokens de design</h1>

        <Section title="Cores">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {colors.map(([name, hex]) => (
              <li key={name} className="overflow-hidden rounded-sm border border-border bg-surface shadow-card">
                <div className="h-12 border-b border-border" style={{ backgroundColor: `var(--color-${name})` }} />
                <div className="p-2">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="font-mono text-xs text-ink-soft">{hex}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Contraste">
          <div className="overflow-x-auto rounded-sm border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label px-3 py-2 text-ink-soft">Amostra</th>
                  <th className="label px-3 py-2 text-ink-soft">Par</th>
                  <th className="label px-3 py-2 text-right text-ink-soft">Razão</th>
                  <th className="label px-3 py-2 text-right text-ink-soft">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {contrastPairs.map(({ fg, bg, min }) => {
                  const ratio = contrastRatio(tokens[fg], tokens[bg]);
                  return (
                    <tr key={`${fg}/${bg}`} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <span
                          className="inline-flex h-7 items-center rounded-sm px-2 font-medium"
                          style={{ color: `var(--color-${fg})`, backgroundColor: `var(--color-${bg})` }}
                        >
                          {min === 3 ? "■ ■ ■" : "Aa"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {fg} / {bg}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">{ratio.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono">{min === 3 ? "3 (não texto)" : "4,5 (texto)"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Estados">
          <div className="flex flex-wrap gap-2">
            {statuses.map((state) => (
              <StatusBadge key={state} state={state} />
            ))}
          </div>
        </Section>

        <Section title="Tipografia">
          <ul className="flex flex-col gap-3 rounded-sm border border-border bg-surface p-4">
            {typeScale.map(({ className, name, sample }) => (
              <li key={name} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                <span className="w-44 shrink-0 font-mono text-xs text-ink-soft">{name}</span>
                <span className={className}>{sample}</span>
              </li>
            ))}
          </ul>
          <div className="flex w-fit flex-col items-end rounded-sm border border-border bg-surface p-4 font-mono text-sm">
            <span>R$ 4.500</span>
            <span>R$ 38.000</span>
            <span>15/10/2026</span>
          </div>
        </Section>

        <Section title="Carregando, erro e vazio">
          <LoadingRegion label="Carregando oportunidades" className="grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2 rounded-sm bg-surface p-3 shadow-card">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </LoadingRegion>
          <FeedbackDemo />
          <div className="rounded-sm bg-paper-shade">
            <EmptyState message="Nenhuma oportunidade nesta etapa." />
          </div>
        </Section>

        <Section title="Avisos e campo de valor">
          <FormDemo />
        </Section>

        <Section title="Cartão">
          <article
            tabIndex={0}
            className="w-full max-w-xs rounded-sm bg-surface p-3 shadow-card transition-shadow hover:shadow-lift"
          >
            <p className="label text-ink-soft">OPP-2001</p>
            <p className="text-sm font-medium">Kit de boas-vindas · 120 unidades</p>
            <p className="font-mono text-sm">R$ 38.000</p>
          </article>
        </Section>
      </main>
    </div>
  );
}
