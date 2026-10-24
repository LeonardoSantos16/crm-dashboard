"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GiftItemFieldValues, GiftItemFieldsProps } from "@/types/form";
import { INPUT_CLASS, describedBy } from "@/utils/formStyles";
import { toNullableNumber } from "@/utils/formValues";
import { Field } from "./Field";
import { MoneyInput } from "./MoneyInput";

export const GiftItemFields = ({ idPrefix }: GiftItemFieldsProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<GiftItemFieldValues>();

  const descriptionId = `${idPrefix}-description`;
  const quantityId = `${idPrefix}-quantity`;
  const unitValueId = `${idPrefix}-unit-value`;

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem_9rem]">
      <Field id={descriptionId} label="Brinde" isRequired error={errors.description?.message}>
        <input
          id={descriptionId}
          aria-required="true"
          aria-invalid={errors.description ? "true" : undefined}
          aria-describedby={describedBy(descriptionId, { hasError: !!errors.description, hasHint: false })}
          className={INPUT_CLASS}
          {...register("description")}
        />
      </Field>
      <Field id={quantityId} label="Qtd." isRequired error={errors.quantity?.message}>
        <input
          id={quantityId}
          type="number"
          min={1}
          step={1}
          aria-required="true"
          aria-invalid={errors.quantity ? "true" : undefined}
          aria-describedby={describedBy(quantityId, { hasError: !!errors.quantity, hasHint: false })}
          className={`${INPUT_CLASS} font-mono`}
          {...register("quantity", { setValueAs: toNullableNumber })}
        />
      </Field>
      <Field id={unitValueId} label="Valor un." error={errors.unitValue?.message}>
        <Controller
          control={control}
          name="unitValue"
          render={({ field }) => (
            <MoneyInput
              id={unitValueId}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.unitValue}
            />
          )}
        />
      </Field>
    </div>
  );
};
