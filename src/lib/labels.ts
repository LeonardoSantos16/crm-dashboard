import type { UserRole } from "@/lib/api/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  MANAGER: "gestor",
  SELLER: "vendedor",
};
