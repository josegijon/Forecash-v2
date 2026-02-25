import { create } from "zustand";

// ── Mes actual real ──
const now = new Date();
const CURRENT_MONTH = now.getMonth();   // 0-indexed (0 = Enero)
const CURRENT_YEAR = now.getFullYear();

interface PlanningState {
    activeMonth: number;
    activeYear: number;

    goForward: () => void;
    goBack: () => void;
    goToToday: () => void;
}

export const usePlanningStore = create<PlanningState>()((set) => ({
    activeMonth: CURRENT_MONTH,
    activeYear: CURRENT_YEAR,

    goForward: () =>
        set((state) => {
            if (state.activeMonth === 11) {
                return { activeMonth: 0, activeYear: state.activeYear + 1 };
            }
            return { activeMonth: state.activeMonth + 1 };
        }),

    goBack: () =>
        set((state) => {
            if (state.activeMonth === 0) {
                return { activeMonth: 11, activeYear: state.activeYear - 1 };
            }
            return { activeMonth: state.activeMonth - 1 };
        }),

    goToToday: () =>
        set({ activeMonth: CURRENT_MONTH, activeYear: CURRENT_YEAR }),
}));
