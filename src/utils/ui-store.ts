import { create } from "zustand";

type UIState = {
  isConfigMenuOpen: boolean;
  setConfigMenuOpen: (isOpen: boolean) => void;
  toggleConfigMenu: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isConfigMenuOpen: false,
  setConfigMenuOpen: (isOpen) => set({ isConfigMenuOpen: isOpen }),
  toggleConfigMenu: () =>
    set((state) => ({ isConfigMenuOpen: !state.isConfigMenuOpen })),
}));
