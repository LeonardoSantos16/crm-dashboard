"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const TABS = [
  { href: "/oportunidades", label: "Oportunidades", isManagerOnly: false },
  { href: "/retornos", label: "Retornos", isManagerOnly: false },
  { href: "/time", label: "Time", isManagerOnly: true },
];

export function NavTabs() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const tabs = TABS.filter((tab) => !tab.isManagerOnly || user?.role === "MANAGER");

  return (
    <nav aria-label="Principal" className="h-full">
      <ul className="flex h-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href} className="flex">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center border-y-3 border-transparent px-3 text-sm transition-colors ${
                  isActive ? "border-b-crown font-bold text-crown" : "font-medium text-moss hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
