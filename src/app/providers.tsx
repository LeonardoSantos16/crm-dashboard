"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CurrentUserProvider } from "@/hooks/useCurrentUser";
import { ToastProvider } from "@/hooks/useToast";
import { queryClient } from "@/lib/react-query";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <ToastProvider>{children}</ToastProvider>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}
