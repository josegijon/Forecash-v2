import { create } from "zustand";

// Tipo de un escenario individual
export interface Scenario {
    id: string;
    name: string;
}

// Tipo del store completo (estado + acciones)
interface ScenarioState {
    scenarios: Scenario[];
    activeScenarioId: string;
    addScenario: (name: string) => void;
    removeScenario: (id: string) => void;
    renameScenario: (id: string, newName: string) => void;
    duplicateScenario: (id: string) => void;
    setActiveScenario: (id: string) => void;
}

// ID inicial para el escenario por defecto
const DEFAULT_ID = "scenario-1";

export const useScenarioStore = create<ScenarioState>((set) => ({
    // ── Estado ──
    scenarios: [
        {
            id: DEFAULT_ID,
            name: "Escenario principal"
        },
    ],
    activeScenarioId: DEFAULT_ID,

    // ── Acciones ──
    addScenario: (name) =>
        set((state) => {
            const newScenario: Scenario = {
                id: `scenario-${Date.now()}`,
                name,
            };
            return {
                scenarios: [...state.scenarios, newScenario],
                activeScenarioId: newScenario.id, // auto-seleccionar el nuevo
            };
        }),

    removeScenario: (id) =>
        set((state) => {
            // No permitir eliminar si solo queda uno
            if (state.scenarios.length <= 1) return state;

            const filtered = state.scenarios.filter((s) => s.id !== id);
            return {
                scenarios: filtered,
                // Si se elimina el activo, seleccionar el primero que quede
                activeScenarioId:
                    state.activeScenarioId === id
                        ? filtered[0].id
                        : state.activeScenarioId,
            };
        }),

    renameScenario: (id, newName) =>
        set((state) => ({
            scenarios: state.scenarios.map((s) =>
                s.id === id ? { ...s, name: newName } : s
            ),
        })),

    duplicateScenario: (id) =>
        set((state) => {
            const original = state.scenarios.find((s) => s.id === id);
            if (!original) return state;

            const duplicate: Scenario = {
                id: `scenario-${Date.now()}`,
                name: `${original.name} (copia)`,
            };
            return {
                scenarios: [...state.scenarios, duplicate],
                activeScenarioId: duplicate.id,
            };
        }),

    setActiveScenario: (id) =>
        set({ activeScenarioId: id }),
}));