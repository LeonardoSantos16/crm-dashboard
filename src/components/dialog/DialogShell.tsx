"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { DialogSectionProps, DialogShellProps } from "@/types/form";

export const DialogShell = ({ open, onOpenChange, title, children }: DialogShellProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-forest-deep/40" />
      <Dialog.Content
        aria-describedby={undefined}
        className="fixed top-16 left-1/2 z-50 flex max-h-[calc(100dvh-5.5rem)] w-[calc(100vw-2rem)] max-w-150 -translate-x-1/2 flex-col rounded-md bg-surface text-ink shadow-overlay"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border py-2.5 pr-3 pl-6">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Close
            aria-label="Fechar"
            className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-paper-shade md:size-9"
          >
            <X aria-hidden="true" className="size-5" />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const DialogBody = ({ children }: DialogSectionProps) => (
  <div className="flex flex-col gap-3.5 overflow-y-auto px-6 pt-4 pb-5">{children}</div>
);

export const DialogFooter = ({ children }: DialogSectionProps) => (
  <div className="flex justify-end gap-2 border-t border-border px-6 pt-3 pb-4">{children}</div>
);
