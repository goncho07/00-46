import { create } from 'zustand';

export interface AcademicLevels {
  inicial: boolean;
  primaria: boolean;
  secundaria: boolean;
}

interface AcademicSettingsState {
  enabledLevels: AcademicLevels;
  setEnabledLevels: (levels: AcademicLevels) => void;
  toggleLevel: (level: keyof AcademicLevels) => void;
}

export const useAcademicSettingsStore = create<AcademicSettingsState>((set) => ({
  enabledLevels: {
    inicial: false,
    primaria: true,
    secundaria: true,
  },
  setEnabledLevels: (levels) => set({ enabledLevels: levels }),
  toggleLevel: (level) => set((state) => ({
    enabledLevels: {
        ...state.enabledLevels,
        [level]: !state.enabledLevels[level]
    }
  })),
}));
