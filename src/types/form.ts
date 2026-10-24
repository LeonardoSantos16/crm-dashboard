import type { ReactNode } from "react";

export type FieldProps = {
  id: string;
  label: string;
  isRequired?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
};

export type MoneyInputProps = {
  id: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  describedBy?: string;
};

export type DialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

export type DialogSectionProps = {
  children: ReactNode;
};

export type FormErrorProps = {
  message: string | undefined;
};

export type GiftItemFieldValues = {
  description: string;
  quantity: number | null;
  unitValue: number | null;
};

export type EstimatedValueFieldValues = {
  estimatedValue: number | null;
};

export type GiftItemFieldsProps = {
  idPrefix: string;
};

export type EstimatedValueFieldProps = {
  id: string;
  isRequired?: boolean;
  suggestion: number | null;
};

export type SuggestedValueHintProps = {
  suggestion: number;
  onUse: () => void;
};
