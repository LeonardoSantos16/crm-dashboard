import type { ReactNode } from "react";

export type ToastTone = "success" | "error";

export type ToastInput = {
  tone: ToastTone;
  message: string;
};

export type ToastItem = ToastInput & {
  id: number;
};

export type ToastProps = {
  toast: ToastItem;
  onDismiss: (id: number) => void;
};

export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

export type ToastProviderProps = {
  children: ReactNode;
};
