import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipo de un escenario individual
export interface Scenario {
    id: string;
    name: string;
    initialBalance: number;
    savingsGoal: number;
    cushionBalance: number;
}

interface ScenarioState {
    scenarios: Scenario[];
    activeScenarioId: string;
    addScenario: (name: string) => string;
    removeScenario: (id: string) => string | null;
    removeAllScenarios: () => void;
    renameScenario: (id: string, newName: string) => void;
    duplicateScenario: (id: string) => string | null;
    setActiveScenario: (id: string) => void;
    setInitialBalance: (id: string, balance: number) => void;
    setSavingsGoal: (id: string, goal: number) => void;
    setCushionBalance: (id: string, cushion: number) => void;
}

const DEFAULT_ID = "scenario-1";

export const useScenarioStore = create<ScenarioState>()(
    persist(
        (set, get) => ({
            // ── Estado ──
            scenarios: [
                {
                    id: DEFAULT_ID,
                    name: "Escenario principal",
                    initialBalance: 0,
                    savingsGoal: 0,
                    cushionBalance: 0,
                },
            ],
            activeScenarioId: DEFAULT_ID,

            // ── Acciones existentes ──
            addScenario: (name) => {
                const newScenario: Scenario = {
                    id: `scenario-${Date.now()}`,
                    name,
                    initialBalance: 0,
                    savingsGoal: 0,
                    cushionBalance: 0,
                };
                set((state) => ({
                    scenarios: [...state.scenarios, newScenario],
                }));
                return newScenario.id;
            },

            removeScenario: (id) => {
                const state = get();
                if (state.scenarios.length <= 1) return null;
                const remaining = state.scenarios.filter((s) => s.id !== id);
                const newActiveId =
                    state.activeScenarioId === id ? remaining[0].id : state.activeScenarioId;
                set({ scenarios: remaining, activeScenarioId: newActiveId });
                return newActiveId;
            },

            removeAllScenarios: () => {
                const defaultScenario: Scenario = {
                    id: DEFAULT_ID,
                    name: "Escenario principal",
                    initialBalance: 0,
                    savingsGoal: 0,
                    cushionBalance: 0,
                };
                set({ scenarios: [defaultScenario], activeScenarioId: DEFAULT_ID });
            },

            renameScenario: (id, newName) => {
                set((state) => ({
                    scenarios: state.scenarios.map((s) =>
                        s.id === id ? { ...s, name: newName } : s
                    ),
                }));
            },

            duplicateScenario: (id) => {
                const state = get();
                const source = state.scenarios.find((s) => s.id === id);
                if (!source) return null;
                const newScenario: Scenario = {
                    ...source,
                    id: `scenario-${Date.now()}`,
                    name: `${source.name} (copia)`,
                };
                set((state) => ({
                    scenarios: [...state.scenarios, newScenario],
                }));
                return newScenario.id;
            },

            setActiveScenario: (id) => {
                set({ activeScenarioId: id });
            },

            setInitialBalance: (id, balance) => {
                set((state) => ({
                    scenarios: state.scenarios.map((s) =>
                        s.id === id ? { ...s, initialBalance: balance } : s
                    ),
                }));
            },

            setSavingsGoal: (id, goal) => {
                set((state) => ({
                    scenarios: state.scenarios.map((s) =>
                        s.id === id ? { ...s, savingsGoal: goal } : s
                    ),
                }));
            },

            setCushionBalance: (id, cushion) => {
                set((state) => ({
                    scenarios: state.scenarios.map((s) =>
                        s.id === id ? { ...s, cushionBalance: cushion } : s
                    ),
                }));
            },
        }),
        {
            name: "scenario-storage",
            version: 2,
        }
    )
);

// ── Selector auxiliar: obtiene el escenario activo ──
export const useActiveScenario = () =>
    useScenarioStore((s) => s.scenarios.find((sc) => sc.id === s.activeScenarioId));