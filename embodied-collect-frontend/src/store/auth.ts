import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "@/types/auth";

interface AuthState {
  token: string;
  refreshToken: string;
  user?: UserInfo;
  setAuth: (payload: { token: string; refreshToken: string; user?: UserInfo }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      refreshToken: "",
      user: undefined,
      setAuth: ({ token, refreshToken, user }) => set({ token, refreshToken, user }),
      logout: () => set({ token: "", refreshToken: "", user: undefined }),
    }),
    { name: "embodied-auth" },
  ),
);
