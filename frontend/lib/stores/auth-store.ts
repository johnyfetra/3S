"use client";

import { create } from "zustand";
import type { Role, UserSession } from "@/lib/types/domain";

type AuthState = UserSession & {
  username: string | null;
  setSession: (session: UserSession & { username: string; role: Role }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  accessToken: "",
  refreshToken: "",
  role: "parent",
  forcePasswordReset: false,
  setSession: (session) => set(session),
  clearSession: () =>
    set({ username: null, accessToken: "", refreshToken: "", role: "parent", forcePasswordReset: false })
}));

