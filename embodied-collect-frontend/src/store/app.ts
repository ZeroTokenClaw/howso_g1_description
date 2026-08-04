import { create } from "zustand";

interface AppState {
  collapsed: boolean;
  loadingCount: number;
  toggleCollapsed: () => void;
  startLoading: () => void;
  endLoading: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  collapsed: false,
  loadingCount: 0,
  toggleCollapsed: () => set({ collapsed: !get().collapsed }),
  startLoading: () => set({ loadingCount: get().loadingCount + 1 }),
  endLoading: () => set({ loadingCount: Math.max(0, get().loadingCount - 1) }),
}));
