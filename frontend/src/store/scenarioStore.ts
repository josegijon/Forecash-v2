import { create } from "zustand";

// Tipo de un escenario individual
export interface Scenario {
    id: string;
    name: string;
}

interface ScenarioState {
    scenarios: Scenario[];
    activeScenarioId: string;
    addScenario: (name: string) => string;
    removeScenario: (id: string) => string | null;
    renameScenario: (id: string, newName: string) => void;
    duplicateScenario: (id: string) => string | null;
    setActiveScenario: (id: string) => void;
}

// ID inicial para el escenario por defecto
const DEFAULT_ID = "scenario-1";

export const useScenarioStore = create<ScenarioState>((set, get) => ({
    // ── Estado ──
    scenarios: [
        {
            id: DEFAULT_ID,
            name: "Escenario principal"
        },
    ],
    activeScenarioId: DEFAULT_ID,

    // ── Acciones ──
    addScenario: (name) => {
        const newScenario: Scenario = {
            id: `scenario-${Date.now()}`,
            name,
        };
        set((state) => ({
            scenarios: [...state.scenarios, newScenario],
        }));
        return newScenario.id;
    },

    removeScenario: (id) => {
        const state = get();
        if (state.scenarios.length <= 1) return null;

        const filtered = state.scenarios.filter((s) => s.id !== id);
        const needsRedirect = state.activeScenarioId === id;

        set({
            scenarios: filtered,
            ...(needsRedirect ? { activeScenarioId: filtered[0].id } : {}),
        });

        return needsRedirect ? filtered[0].id : null;
    },

    renameScenario: (id, newName) =>
        set((state) => ({
            scenarios: state.scenarios.map((s) =>
                s.id === id ? { ...s, name: newName } : s
            ),
        })),

    duplicateScenario: (id) => {
        const state = get();
        const original = state.scenarios.find((s) => s.id === id);
        if (!original) return null;

        const duplicate: Scenario = {
            id: `scenario-${Date.now()}`,
            name: `${original.name} (copia)`,
        };
        set({
            scenarios: [...state.scenarios, duplicate],
        });
        return duplicate.id;
    },

    setActiveScenario: (id) =>
        set({ activeScenarioId: id }),
}));