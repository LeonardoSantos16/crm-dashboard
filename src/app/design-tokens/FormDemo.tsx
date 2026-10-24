"use client";

import { useState } from "react";
import { Field } from "@/components/form/Field";
import { MoneyInput } from "@/components/form/MoneyInput";
import { useToast } from "@/hooks/useToast";
import { BUTTON_STYLES } from "@/utils/buttonStyles";

export const FormDemo = () => {
  const { showToast } = useToast();
  const [value, setValue] = useState<number | null>(4500);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => showToast({ tone: "success", message: "Retorno registrado em OPP-2004." })}
          className={BUTTON_STYLES.secondary}
        >
          Mostrar aviso de sucesso
        </button>
        <button
          type="button"
          onClick={() => showToast({ tone: "error", message: "Não foi possível mover para Fechamento: Só a partir de Forecast" })}
          className={BUTTON_STYLES.secondary}
        >
          Mostrar aviso de erro
        </button>
      </div>
      <div className="flex max-w-60 flex-col gap-1">
        <Field id="demo-money" label="Valor estimado">
          <MoneyInput id="demo-money" value={value} onChange={setValue} />
        </Field>
        <p className="text-xs text-ink-soft">Valor entregue ao formulário: {value === null ? "vazio" : value}</p>
      </div>
    </div>
  );
};
