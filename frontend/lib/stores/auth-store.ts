"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api/client";
import type { Role, User, UserSession } from "@/lib/types/domain";

const AUTH_STORAGE_KEY = "school-erp.session";

type AuthState = UserSession & {
  username: string | null;
  hydrated: boolean;
  setSession: (session: UserSession & { username: string; role: Role }) => void;
  hydrateSession: () => void;
  syncSession: () => Promise<void>;
  clearSession: () => void;
};

const emptySession = {
  username: null,
  accessToken: "",
  refreshToken: "",
  role: "parent" as Role,
  fullName: "",
  forcePasswordReset: false
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...emptySession,
  hydrated: false,
  setSession: (session) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
    set({ ...session, hydrated: true });
  },
  hydrateSession: () => {
    if (get().hydrated || typeof window === "undefined") {
      return;
    }
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      set({ hydrated: true });
      return;
    }
    try {
      const session = JSON.parse(rawSession) as UserSession & { username: string };
      set({ ...session, hydrated: true });
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({ ...emptySession, hydrated: true });
    }
  },
  syncSession: async () => {
    const { accessToken } = get();
    if (!accessToken) return;
    try {
      const user = await apiRequest<User>("/auth/me", { accessToken });
      set({
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        forcePasswordReset: user.force_password_reset
      });
    } catch {
      get().clearSession();
    }
  },
  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    set({ ...emptySession, hydrated: true });
  }
}));
