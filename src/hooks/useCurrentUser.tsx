"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";
import type { User } from "@/lib/api/types";
import { api, setApiUserId } from "@/lib/axios";

const STORAGE_KEY = "crm.currentUserId";

let selectedUserId: number | null | undefined;
const listeners = new Set<() => void>();

function readStoredUserId() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}

function getSelectedUserId() {
  if (selectedUserId === undefined) selectedUserId = readStoredUserId();
  return selectedUserId;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function selectUser(id: number) {
  selectedUserId = id;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(id));
  } catch {}
  listeners.forEach((listener) => listener());
}

type CurrentUserValue = {
  user: User | null;
  users: User[];
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
  selectUser: (id: number) => void;
};

const CurrentUserContext = createContext<CurrentUserValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ users: User[] }>("/users");
      return response.data.users;
    },
    staleTime: Infinity,
  });
  const selectedId = useSyncExternalStore(subscribe, getSelectedUserId, () => null);

  const users = usersQuery.data ?? [];
  const user = users.find((item) => item.id === selectedId) ?? users.find((item) => item.role === "SELLER") ?? null;
  const userId = user?.id ?? null;

  useLayoutEffect(() => {
    setApiUserId(userId);
  }, [userId]);

  return (
    <CurrentUserContext
      value={{
        user,
        users,
        isPending: usersQuery.isPending,
        isError: usersQuery.isError,
        refetch: usersQuery.refetch,
        selectUser,
      }}
    >
      {children}
    </CurrentUserContext>
  );
}

export function useCurrentUser() {
  const value = useContext(CurrentUserContext);
  if (!value) throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  return value;
}
