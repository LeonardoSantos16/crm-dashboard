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
