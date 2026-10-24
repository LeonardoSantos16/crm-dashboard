import { Bell, Crown, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { IdentityMenu } from "./IdentityMenu";
import { NavTabs } from "./NavTabs";

export function TopBar() {
  return (
    <header className="nav-surface">
      <div className="flex h-14 items-center gap-8 px-6">
        <Link href="/oportunidades" className="flex items-center gap-2 text-base font-bold text-white">
          <Crown aria-hidden="true" className="size-5 text-crown" />
          Nobre CRM
        </Link>
        <Suspense fallback={<div className="h-full w-72" />}>
          <NavTabs />
        </Suspense>
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-crown px-3.5 text-sm font-semibold text-forest-deep transition-colors enabled:hover:bg-moss disabled:cursor-not-allowed"
          >
            <Plus aria-hidden="true" className="size-4" />
            Nova oportunidade
          </button>
          <button
            type="button"
            disabled
            aria-label="Notificações"
            className="inline-flex size-9 items-center justify-center rounded-md text-moss disabled:cursor-not-allowed"
          >
            <Bell aria-hidden="true" className="size-5" />
          </button>
          <IdentityMenu />
        </div>
      </div>
    </header>
  );
}
