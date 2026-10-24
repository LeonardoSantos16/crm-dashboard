"use client";

import { useFormContext } from "react-hook-form";
import type { LossReasonFieldValues } from "@/types/opportunity";
import { fieldErrorId } from "@/utils/formStyles";
import { LOSS_REASONS, LOSS_REASON_LABELS } from "@/utils/labels";

const FIELD_ID = "lost-reason";

export const LossReasonField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LossReasonFieldValues>();

  const renderError = () =>
    errors.reason && (
      <span id={fieldErrorId(FIELD_ID)} className="text-sm text-error-fg">
        {errors.reason.message}
      </span>
    );

  return (
    <fieldset aria-describedby={errors.reason ? fieldErrorId(FIELD_ID) : undefined} className="flex flex-col gap-1">
      <legend className="mb-1 text-sm font-semibold">
        Motivo<span aria-hidden="true"> *</span>
      </legend>
      {LOSS_REASONS.map((reason) => (
        <label key={reason} className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
          <input type="radio" value={reason} className="size-4.5 cursor-pointer accent-forest" {...register("reason")} />
          {LOSS_REASON_LABELS[reason]}
        </label>
      ))}
      {renderError()}
    </fieldset>
  );
};
