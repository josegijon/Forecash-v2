import { create } from "zustand";

// ── Mes actual en tiempo de carga del módulo (para el estado inicial) ──
// goToToday() recalcula en tiempo de llamada para no quedar obsoleto.
const now = new Date();

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

    goToToday: () => {
        const today = new Date();
        set({ activeMonth: today.getMonth(), activeYear: today.getFullYear() });
    },
}));