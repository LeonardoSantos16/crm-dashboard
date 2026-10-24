"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { LoadingRegion } from "@/components/feedback/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ROLE_LABELS } from "@/utils/labels";

export function IdentityMenu() {
  const { user, users, isPending, refetch, selectUser } = useCurrentUser();

  if (isPending) {
    return (
      <LoadingRegion label="Carregando usuários">
        <div className="h-9 w-36 rounded-md bg-forest md:w-56" />
      </LoadingRegion>
    );
  }

  if (!user) {
    return (
      <p role="alert" className="flex items-center gap-2 text-sm text-moss">
        Não foi possível carregar os usuários.
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex h-9 items-center rounded-md px-2 font-semibold text-white transition-colors hover:bg-forest"
        >
          Tentar novamente
        </button>
      </p>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-moss transition-colors hover:bg-forest">
          <span className="sr-only md:not-sr-only">Entrando como:</span>
          <span className="font-semibold text-white">
            {user.name} ({ROLE_LABELS[user.role]})
          </span>
          <ChevronDown aria-hidden="true" className="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className="z-20 min-w-60 rounded-md border border-border bg-surface py-1 text-ink shadow-overlay"
          >
            <DropdownMenu.Label className="label px-3 py-2 text-ink-soft">
              Entrando como (modo demonstração)
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup value={String(user.id)} onValueChange={(value) => selectUser(Number(value))}>
              {users.map((item) => (
                <DropdownMenu.RadioItem
                  key={item.id}
                  value={String(item.id)}
                  className="flex min-h-9 cursor-pointer items-center gap-2 px-3 py-1.5 text-sm -outline-offset-2 data-highlighted:bg-paper-shade data-[state=checked]:font-semibold"
                >
                  <span className="flex size-4 items-center justify-center">
                    <DropdownMenu.ItemIndicator>
                      <Check aria-hidden="true" className="size-4 text-forest" />
                    </DropdownMenu.ItemIndicator>
                  </span>
                  {item.name} · {ROLE_LABELS[item.role]}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <span className="label px-2 text-crown">Modo demonstração</span>
    </div>
  );
}
