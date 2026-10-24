"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import type { ToastProps } from "@/types/feedback";

const TOAST_STYLES = {
  success: {
    icon: CircleCheck,
    className: "border-success-solid bg-success-bg text-success-fg",
    iconClassName: "text-success-solid",
  },
  error: {
    icon: CircleAlert,
    className: "border-error-solid bg-error-bg text-error-fg",
    iconClassName: "text-error-solid",
  },
};

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const { icon: Icon, className, iconClassName } = TOAST_STYLES[toast.tone];

  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm shadow-overlay ${className}`}
    >
      <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} />
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};
