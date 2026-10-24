import type { FieldProps } from "@/types/form";
import { fieldErrorId, fieldHintId } from "@/utils/formStyles";

export const Field = ({ id, label, isRequired = false, hint, error, children }: FieldProps) => {
  const renderHint = () =>
    hint && (
      <span id={fieldHintId(id)} className="text-xs text-ink-soft">
        {hint}
      </span>
    );

  const renderError = () =>
    error && (
      <span id={fieldErrorId(id)} className="text-sm text-error-fg">
        {error}
      </span>
    );

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {isRequired && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {renderHint()}
      {renderError()}
    </div>
  );
};
