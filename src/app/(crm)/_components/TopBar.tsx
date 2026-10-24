import { Bell, Crown, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { IdentityMenu } from "./IdentityMenu";
import { NavTabs } from "./NavTabs";

export function TopBar() {
  return (
    <header className="nav-surface">
      <div className="flex flex-wrap items-center gap-x-4 px-4 md:h-14 md:flex-nowrap md:gap-8 md:px-6">
        <Link href="/oportunidades" className="flex h-14 items-center gap-2 text-base font-bold text-white">
          <Crown aria-hidden="true" className="size-5 text-crown" />
          Nobre CRM
        </Link>
        <div className="order-last h-11 w-full md:order-none md:h-full md:w-auto">
          <Suspense fallback={<div className="h-full w-72" />}>
            <NavTabs />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <button
            type="button"
            disabled
            aria-label="Nova oportunidade"
            className="inline-flex size-9 items-center justify-center gap-1.5 rounded-md bg-crown text-sm font-semibold text-forest-deep transition-colors enabled:hover:bg-moss disabled:cursor-not-allowed sm:w-auto sm:px-3.5"
          >
            <Plus aria-hidden="true" className="size-4" />
            <span aria-hidden="true" className="hidden sm:inline">
              Nova oportunidade
            </span>
          </button>
          <button
            type="button"
            disabled
            aria-label="Notificações"
            className="hidden size-9 items-center justify-center rounded-md text-moss disabled:cursor-not-allowed sm:inline-flex"
          >
            <Bell aria-hidden="true" className="size-5" />
          </button>
          <IdentityMenu />
        </div>
      </div>
    </header>
  );
}
