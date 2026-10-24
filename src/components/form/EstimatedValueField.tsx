"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { EstimatedValueFieldProps, EstimatedValueFieldValues } from "@/types/form";
import { describedBy } from "@/utils/formStyles";
import { Field } from "./Field";
import { MoneyInput } from "./MoneyInput";
import { SuggestedValueHint } from "./SuggestedValueHint";

export const EstimatedValueField = ({ id, isRequired = false, suggestion }: EstimatedValueFieldProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<EstimatedValueFieldValues>();

  const error = errors.estimatedValue?.message;
  const hasSuggestion = suggestion !== null;

  const handleUseSuggestion = () => {
    if (suggestion !== null) setValue("estimatedValue", suggestion, { shouldValidate: true });
  };

  const renderHint = () =>
    suggestion !== null && <SuggestedValueHint suggestion={suggestion} onUse={handleUseSuggestion} />;

  return (
    <Field id={id} label="Valor estimado" isRequired={isRequired} hint={renderHint()} error={error}>
      <Controller
        control={control}
        name="estimatedValue"
        render={({ field }) => (
          <MoneyInput
            id={id}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={!!error}
            describedBy={describedBy(id, { hasError: !!error, hasHint: hasSuggestion })}
          />
        )}
      />
    </Field>
  );
};
