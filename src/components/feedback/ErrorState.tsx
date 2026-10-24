"use client";

import { CircleAlert } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-sm bg-error-bg p-4 text-error-fg sm:flex-row sm:items-center"
    >
      <p className="flex flex-1 items-start gap-2 text-sm">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-sm border border-error-solid bg-surface px-4 text-sm font-medium text-error-fg transition-colors hover:bg-error-bg active:translate-y-px md:h-9"
      >
        Tentar novamente
      </button>
    </div>
  );
}
