"use client";

import { Check, ClockAlert } from "lucide-react";
import { useCallback } from "react";
import type { AlertState } from "@/types/api";
import { SITUATION_LABELS } from "@/utils/labels";
import type { BoardToolbarProps } from "../_types/board";
import { NEEDS_ATTENTION, isNeedsAttention, toggleSituation } from "../_utils/filters";
import { CONTROL_HEIGHT, SITUATION_CHIPS } from "../_utils/toolbar";
import { SearchInput } from "./SearchInput";
import { Select } from "./Select";

export const BoardToolbar = ({ filters, onChange, team, needsAttention }: BoardToolbarProps) => {
  const isNeedsAttentionActive = isNeedsAttention(filters.situation);

  const handleSearch = useCallback((q: string) => onChange({ q }), [onChange]);

  const handleToggleNeedsAttention = () => onChange({ situation: isNeedsAttentionActive ? [] : NEEDS_ATTENTION });

  const handleToggleSituation = (situation: AlertState) =>
    onChange({ situation: toggleSituation(filters.situation, situation) });

  const renderNeedsAttention = () => (
    <button
      type="button"
      aria-pressed={isNeedsAttentionActive}
      onClick={handleToggleNeedsAttention}
      className={`inline-flex ${CONTROL_HEIGHT} items-center gap-1.5 rounded-md border border-attention-solid px-3 text-sm font-semibold transition-colors ${
        isNeedsAttentionActive ? "bg-attention-solid text-white" : "bg-attention-bg text-attention-fg"
      }`}
    >
      {isNeedsAttentionActive ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <ClockAlert aria-hidden="true" className="size-4 text-attention-solid" />
      )}
      Precisam de atenção{needsAttention !== undefined && ` (${needsAttention})`}
    </button>
  );

  const renderSituationChips = () => (
    <div role="group" aria-labelledby="situation-label" className="flex flex-wrap items-center gap-2">
      <span id="situation-label" className="text-sm text-ink-soft">
        Situação:
      </span>
      {SITUATION_CHIPS.map(({ situation, icon: Icon, iconClassName, pressedClassName }) => {
        const isPressed = filters.situation.includes(situation);
        return (
          <button
            key={situation}
            type="button"
            aria-pressed={isPressed}
            onClick={() => handleToggleSituation(situation)}
            className={`inline-flex ${CONTROL_HEIGHT} items-center gap-1.5 rounded-md border px-3 text-sm transition-colors ${
              isPressed
                ? `${pressedClassName} font-semibold inset-ring inset-ring-current`
                : "border-border-strong bg-surface font-medium text-ink hover:bg-paper-shade"
            }`}
          >
            <Icon aria-hidden="true" className={`size-4 ${iconClassName}`} />
            {SITUATION_LABELS[situation]}
          </button>
        );
      })}
    </div>
  );

  const renderOwnerSelect = () =>
    team.length > 0 && (
      <Select
        label="Vendedor:"
        value={filters.ownerId === null ? "" : String(filters.ownerId)}
        onChange={(value) => onChange({ ownerId: value ? Number(value) : null })}
      >
        <option value="">Todos</option>
        {team.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </Select>
    );

  const renderSortSelect = () => (
    <Select
      label="Ordenar por:"
      value={filters.sort}
      onChange={(value) => onChange({ sort: value === "value" ? "value" : "priority" })}
    >
      <option value="priority">Prioridade</option>
      <option value="value">Valor</option>
    </Select>
  );

  const renderLostToggle = () => (
    <label className={`inline-flex ${CONTROL_HEIGHT} cursor-pointer items-center gap-2 text-sm`}>
      <input
        type="checkbox"
        checked={filters.includeLost}
        onChange={(event) => onChange({ includeLost: event.target.checked })}
        className="size-4.5 cursor-pointer accent-forest"
      />
      Mostrar perdidas
    </label>
  );

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-surface px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={filters.q} onSearch={handleSearch} />
        {renderNeedsAttention()}
        {renderSituationChips()}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {renderOwnerSelect()}
        {renderSortSelect()}
        {renderLostToggle()}
      </div>
    </div>
  );
};
