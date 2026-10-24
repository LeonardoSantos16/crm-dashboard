"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { DialogBody, DialogFooter, DialogShell } from "@/components/dialog/DialogShell";
import { Field } from "@/components/form/Field";
import { FormError } from "@/components/form/FormError";
import { useLoseOpportunity } from "@/hooks/opportunities/useOpportunityAction";
import { useToast } from "@/hooks/useToast";
import type { OpportunityDialogProps } from "@/types/opportunity";
import { applyFormError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { TEXTAREA_CLASS, describedBy } from "@/utils/formStyles";
import { LOSS_REASONS } from "@/utils/labels";
import { DialogHeading } from "./DialogHeading";
import { LossReasonField } from "./LossReasonField";

const lostSchema = z
  .object({
    reason: z.enum(LOSS_REASONS, { error: "Escolha o motivo da perda" }),
    detail: z.string().trim().max(500, "Use até 500 caracteres"),
  })
  .refine((data) => data.reason !== "OTHER" || data.detail.length > 0, {
    path: ["detail"],
    error: "Descreva o motivo",
  });

type LostFormValues = z.input<typeof lostSchema>;
type LostData = z.output<typeof lostSchema>;

const DEFAULT_VALUES = { detail: "" } as LostFormValues;

export const LostDialog = ({ opportunity, open, onOpenChange }: OpportunityDialogProps) => {
  const lose = useLoseOpportunity(opportunity.id);
  const { showToast } = useToast();

  const form = useForm<LostFormValues, unknown, LostData>({ resolver: zodResolver(lostSchema), defaultValues: DEFAULT_VALUES });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset(DEFAULT_VALUES);
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: LostData) => {
    try {
      await lose.mutateAsync({ reason: data.reason, detail: data.detail || undefined });
      showToast({ tone: "success", message: `${opportunity.code} marcada como perdida.` });
      handleOpenChange(false);
    } catch (error) {
      applyFormError(error, setError);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={handleOpenChange} title="Marcar como perdida">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-col">
          <DialogBody>
            <div className="flex flex-col gap-0.5">
              <DialogHeading opportunity={opportunity} />
              <p className="text-sm text-ink-soft">Perdida é um estado final: a oportunidade sai do funil.</p>
            </div>
            <LossReasonField />
            <Field id="lost-detail" label="Detalhe (obrigatório em “Outro”)" error={errors.detail?.message}>
              <textarea
                id="lost-detail"
                rows={2}
                aria-invalid={errors.detail ? "true" : undefined}
                aria-describedby={describedBy("lost-detail", { hasError: !!errors.detail, hasHint: false })}
                className={TEXTAREA_CLASS}
                {...register("detail")}
              />
            </Field>
            <FormError message={errors.root?.message} />
          </DialogBody>
          <DialogFooter>
            <button type="button" onClick={() => handleOpenChange(false)} className={BUTTON_STYLES.secondary}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className={BUTTON_STYLES.lost}>
              <CircleX aria-hidden="true" className="size-4 text-lost-solid" />
              Marcar como perdida
            </button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogShell>
  );
};
