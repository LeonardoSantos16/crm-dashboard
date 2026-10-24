"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CurrentUserProvider } from "@/hooks/useCurrentUser";
import { queryClient } from "@/lib/react-query";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>{children}</CurrentUserProvider>
    </QueryClientProvider>
  );
}
