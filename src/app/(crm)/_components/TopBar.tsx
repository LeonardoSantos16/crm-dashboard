import { Crown } from "lucide-react";
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
          <Suspense fallback={<div className="h-full w-36" />}>
            <NavTabs />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center">
          <IdentityMenu />
        </div>
      </div>
    </header>
  );
}
