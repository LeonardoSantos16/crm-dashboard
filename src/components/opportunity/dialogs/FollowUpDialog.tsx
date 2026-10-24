"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { DialogBody, DialogFooter, DialogShell } from "@/components/dialog/DialogShell";
import { Field } from "@/components/form/Field";
import { FormError } from "@/components/form/FormError";
import { useFollowUp } from "@/hooks/opportunities/useOpportunityAction";
import { useToast } from "@/hooks/useToast";
import { useToday } from "@/hooks/useToday";
import type { OpportunityDialogProps } from "@/types/opportunity";
import { applyFormError } from "@/utils/apiErrors";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { MAX_DAYS_AHEAD, nextDateRange } from "@/utils/dates";
import { INPUT_CLASS, TEXTAREA_CLASS, describedBy } from "@/utils/formStyles";
import { FOLLOW_UP_CHANNELS } from "@/utils/labels";
import { ChannelPicker } from "./ChannelPicker";
import { DeadlineHint } from "./DeadlineHint";
import { DialogHeading } from "./DialogHeading";

const createFollowUpSchema = (today: string | null) => {
  const range = today ? nextDateRange(today) : null;
  return z.object({
    channel: z.enum(FOLLOW_UP_CHANNELS).nullable(),
    summary: z.string().trim().max(500, "Use até 500 caracteres"),
    nextDate: z
      .string()
      .refine((value) => !value || !range || value >= range.min, "Escolha uma data depois de hoje")
      .refine((value) => !value || !range || value <= range.max, `Escolha uma data em até ${MAX_DAYS_AHEAD} dias`),
  });
};

type FollowUpData = z.infer<ReturnType<typeof createFollowUpSchema>>;

const DEFAULT_VALUES: FollowUpData = { channel: null, summary: "", nextDate: "" };

export const FollowUpDialog = ({ opportunity, open, onOpenChange }: OpportunityDialogProps) => {
  const today = useToday();
  const followUp = useFollowUp(opportunity.id);
  const { showToast } = useToast();
  const resolver = useMemo(() => zodResolver(createFollowUpSchema(today)), [today]);
  const range = today ? nextDateRange(today) : null;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FollowUpData>({ resolver, defaultValues: DEFAULT_VALUES });

  const channel = useWatch({ control, name: "channel" });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset(DEFAULT_VALUES);
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: FollowUpData) => {
    try {
      await followUp.mutateAsync({
        channel: data.channel ?? undefined,
        summary: data.summary || undefined,
        nextDate: data.nextDate || undefined,
      });
      showToast({ tone: "success", message: `Retorno registrado em ${opportunity.code}.` });
      handleOpenChange(false);
    } catch (error) {
      applyFormError(error, setError);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={handleOpenChange} title="Marcar como retornado">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-col">
        <DialogBody>
          <div className="flex flex-col gap-0.5">
            <DialogHeading opportunity={opportunity} showStage />
            <p className="text-sm text-ink-soft">Todos os campos são opcionais.</p>
          </div>
          <ChannelPicker value={channel} onChange={(value) => setValue("channel", value)} />
          <Field id="follow-up-summary" label="Resumo" error={errors.summary?.message}>
            <textarea
              id="follow-up-summary"
              rows={3}
              aria-invalid={errors.summary ? "true" : undefined}
              aria-describedby={describedBy("follow-up-summary", { hasError: !!errors.summary, hasHint: false })}
              className={TEXTAREA_CLASS}
              {...register("summary")}
            />
          </Field>
          <Field
            id="follow-up-next-date"
            label="Próxima data"
            hint={<DeadlineHint opportunity={opportunity} />}
            error={errors.nextDate?.message}
          >
            <input
              id="follow-up-next-date"
              type="date"
              min={range?.min}
              max={range?.max}
              aria-invalid={errors.nextDate ? "true" : undefined}
              aria-describedby={describedBy("follow-up-next-date", { hasError: !!errors.nextDate, hasHint: true })}
              className={`${INPUT_CLASS} max-w-48 font-mono`}
              {...register("nextDate")}
            />
          </Field>
          <FormError message={errors.root?.message} />
        </DialogBody>
        <DialogFooter>
          <button type="button" onClick={() => handleOpenChange(false)} className={BUTTON_STYLES.secondary}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className={BUTTON_STYLES.primary}>
            Marcar como retornado
          </button>
        </DialogFooter>
      </form>
    </DialogShell>
  );
};
