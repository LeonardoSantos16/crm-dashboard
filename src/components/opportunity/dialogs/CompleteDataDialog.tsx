"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { DialogBody, DialogFooter, DialogShell } from "@/components/dialog/DialogShell";
import { EstimatedValueField } from "@/components/form/EstimatedValueField";
import { FormError } from "@/components/form/FormError";
import { GiftItemFields } from "@/components/form/GiftItemFields";
import { useMoveOpportunity } from "@/hooks/opportunities/useMoveOpportunity";
import type { MissingField } from "@/types/api";
import type { CompleteDataDialogProps } from "@/types/opportunity";
import { applyFormError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { STAGE_LABELS } from "@/utils/labels";
import { suggestEstimatedValue } from "@/utils/opportunity";

const completeSchema = z.object({
  description: z.string().trim().max(200, "Use até 200 caracteres"),
  quantity: z.number({ error: "Use um número" }).int("Use um número inteiro").positive("Use uma quantidade maior que zero").nullable(),
  unitValue: z.number().positive("Use um valor maior que zero").nullable(),
  estimatedValue: z.number().positive("Use um valor maior que zero").nullable(),
});

const createCompleteSchema = (missing: MissingField[]) =>
  completeSchema.superRefine((data, context) => {
    if (missing.includes("items")) {
      if (!data.description) context.addIssue({ code: "custom", path: ["description"], message: "Informe o brinde" });
      if (data.quantity === null) context.addIssue({ code: "custom", path: ["quantity"], message: "Informe a quantidade" });
    }
    if (missing.includes("estimatedValue") && data.estimatedValue === null) {
      context.addIssue({ code: "custom", path: ["estimatedValue"], message: "Informe o valor estimado" });
    }
  });

type CompleteData = z.infer<typeof completeSchema>;

const DEFAULT_VALUES: CompleteData = { description: "", quantity: null, unitValue: null, estimatedValue: null };

export const CompleteDataDialog = ({ opportunity, toStage, missing, open, onOpenChange }: CompleteDataDialogProps) => {
  const move = useMoveOpportunity(opportunity.id);
  const resolver = useMemo(() => zodResolver(createCompleteSchema(missing)), [missing]);
  const needsItem = missing.includes("items");
  const needsValue = missing.includes("estimatedValue");

  const form = useForm<CompleteData>({ resolver, defaultValues: DEFAULT_VALUES });
  const {
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const [quantity, unitValue] = useWatch({ control, name: ["quantity", "unitValue"] });
  const suggestion = useMemo(() => suggestEstimatedValue([{ quantity, unitValue }]), [quantity, unitValue]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset(DEFAULT_VALUES);
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: CompleteData) => {
    try {
      await move.mutateAsync({
        toStage,
        complete: {
          estimatedValue: data.estimatedValue ?? undefined,
          items:
            data.description && data.quantity !== null
              ? [{ description: data.description, quantity: data.quantity, unitValue: data.unitValue ?? undefined }]
              : undefined,
        },
      });
      handleOpenChange(false);
    } catch (error) {
      applyFormError(error, setError);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={handleOpenChange} title="Completar dados para enviar orçamento">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-col">
          <DialogBody>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">
                <span className="font-mono">{opportunity.code}</span> · {opportunity.company.name} →{" "}
                {STAGE_LABELS[toStage]}
              </p>
              <p className="text-sm text-ink-soft">
                Para avançar, a oportunidade precisa de valor estimado e de pelo menos um item de brinde.
              </p>
            </div>
            {needsItem && <GiftItemFields idPrefix="complete" />}
            {needsValue && <EstimatedValueField id="complete-estimated-value" isRequired suggestion={suggestion} />}
            <FormError message={errors.root?.message} />
          </DialogBody>
          <DialogFooter>
            <button type="button" onClick={() => handleOpenChange(false)} className={BUTTON_STYLES.secondary}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className={BUTTON_STYLES.primary}>
              Salvar e mover
            </button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogShell>
  );
};
