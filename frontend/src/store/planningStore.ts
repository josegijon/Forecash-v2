import { create } from "zustand";

const now = new Date();

const MIN_YEAR = 1900;
const MAX_YEAR = 2200;

interface PlanningState {
    activeMonth: number;
    activeYear: number;

    goForward: () => void;
    goBack: () => void;
    goToToday: () => void;
}

export const usePlanningStore = create<PlanningState>()((set) => ({
    activeMonth: now.getMonth(),
    activeYear: now.getFullYear(),

    goForward: () =>
        set((state) => {
            if (state.activeYear >= MAX_YEAR && state.activeMonth === 11) return state;
            if (state.activeMonth === 11) {
                return { activeMonth: 0, activeYear: state.activeYear + 1 };
            }
            return { activeMonth: state.activeMonth + 1 };
        }),

    goBack: () =>
        set((state) => {
            if (state.activeYear <= MIN_YEAR && state.activeMonth === 0) return state;
            if (state.activeMonth === 0) {
                return { activeMonth: 11, activeYear: state.activeYear - 1 };
            }
            return { activeMonth: state.activeMonth - 1 };
        }),

    goToToday: () => {
        const today = new Date();
        set({ activeMonth: today.getMonth(), activeYear: today.getFullYear() });
    },
}));