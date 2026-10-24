"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [{ href: "/oportunidades", label: "Oportunidades" }];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="h-full">
      <ul className="flex h-full">
        {TABS.map((tab) => {
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
