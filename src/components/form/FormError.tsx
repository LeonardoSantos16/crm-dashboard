import { CircleAlert } from "lucide-react";
import type { FormErrorProps } from "@/types/form";

export const FormError = ({ message }: FormErrorProps) =>
  message && (
    <p role="alert" className="flex items-start gap-2 rounded-md border border-error-solid bg-error-bg px-3 py-2 text-sm text-error-fg">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-error-solid" />
      {message}
    </p>
  );
