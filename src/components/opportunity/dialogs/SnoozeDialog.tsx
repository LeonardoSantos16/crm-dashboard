"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogBody, DialogFooter, DialogShell } from "@/components/dialog/DialogShell";
import { Field } from "@/components/form/Field";
import { FormError } from "@/components/form/FormError";
import { useSnooze } from "@/hooks/opportunities/useOpportunityAction";
import { useToast } from "@/hooks/useToast";
import { useToday } from "@/hooks/useToday";
import type { OpportunityDialogProps } from "@/types/opportunity";
import { applyFormError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { MAX_DAYS_AHEAD, nextDateRange } from "@/utils/dates";
import { INPUT_CLASS, TEXTAREA_CLASS, describedBy } from "@/utils/formStyles";
import { DialogHeading } from "./DialogHeading";
import { EscalationWarning } from "./EscalationWarning";

const createSnoozeSchema = (today: string | null) => {
  const range = today ? nextDateRange(today) : null;
  return z.object({
    until: z
      .string()
      .min(1, "Escolha até quando adiar")
      .refine((value) => !range || value >= range.min, "Escolha uma data depois de hoje")
      .refine((value) => !range || value <= range.max, `Escolha uma data em até ${MAX_DAYS_AHEAD} dias`),
    reason: z.string().trim().max(500, "Use até 500 caracteres"),
  });
};

type SnoozeData = z.infer<ReturnType<typeof createSnoozeSchema>>;

const DEFAULT_VALUES: SnoozeData = { until: "", reason: "" };

export const SnoozeDialog = ({ opportunity, open, onOpenChange }: OpportunityDialogProps) => {
  const today = useToday();
  const snooze = useSnooze(opportunity.id);
  const { showToast } = useToast();
  const resolver = useMemo(() => zodResolver(createSnoozeSchema(today)), [today]);
  const range = today ? nextDateRange(today) : null;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SnoozeData>({ resolver, defaultValues: DEFAULT_VALUES });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset(DEFAULT_VALUES);
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: SnoozeData) => {
    try {
      await snooze.mutateAsync({ until: data.until, reason: data.reason || undefined });
      showToast({ tone: "success", message: `${opportunity.code} adiada.` });
      handleOpenChange(false);
    } catch (error) {
      applyFormError(error, setError);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={handleOpenChange} title="Adiar">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-col">
        <DialogBody>
          <DialogHeading opportunity={opportunity} />
          <Field
            id="snooze-until"
            label="Adiar até"
            isRequired
            hint={`até ${MAX_DAYS_AHEAD} dias`}
            error={errors.until?.message}
          >
            <input
              id="snooze-until"
              type="date"
              min={range?.min}
              max={range?.max}
              aria-required="true"
              aria-invalid={errors.until ? "true" : undefined}
              aria-describedby={describedBy("snooze-until", { hasError: !!errors.until, hasHint: true })}
              className={`${INPUT_CLASS} max-w-48 font-mono`}
              {...register("until")}
            />
          </Field>
          <Field id="snooze-reason" label="Motivo" error={errors.reason?.message}>
            <textarea
              id="snooze-reason"
              rows={2}
              aria-invalid={errors.reason ? "true" : undefined}
              aria-describedby={describedBy("snooze-reason", { hasError: !!errors.reason, hasHint: false })}
              className={TEXTAREA_CLASS}
              {...register("reason")}
            />
          </Field>
          <EscalationWarning opportunity={opportunity} />
          <FormError message={errors.root?.message} />
        </DialogBody>
        <DialogFooter>
          <button type="button" onClick={() => handleOpenChange(false)} className={BUTTON_STYLES.secondary}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className={BUTTON_STYLES.primary}>
            Adiar
          </button>
        </DialogFooter>
      </form>
    </DialogShell>
  );
};
