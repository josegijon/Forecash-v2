import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CashflowItem, Frequency } from "@core";

export type { Frequency, CashflowItem };

export type NewCashflowItem = Omit<CashflowItem, "id">;

interface CashflowState {
    items: Record<string, CashflowItem[]>;

    addItem: (item: NewCashflowItem) => void;
    updateItem: (
        id: string,
        scenarioId: string,
        changes: Partial<CashflowItem>
    ) => void;
    removeItem: (id: string, scenarioId: string) => void;
    removeAllByScenario: (scenarioId: string) => void;
    duplicateScenarioItems: (sourceId: string, targetId: string) => void;
}

export const useCashflowStore = create<CashflowState>()(
    persist(
        (set, get) => ({
            // ── Estado ──
            items: {},

            // ── Acciones ──
            addItem: (item) =>
                set((state) => {
                    const newItem: CashflowItem = {
                        ...item,
                        id: crypto.randomUUID(),
                    };

                    const scenarioItems =
                        state.items[item.scenarioId] ?? [];

                    return {
                        items: {
                            ...state.items,
                            [item.scenarioId]: [
                                ...scenarioItems,
                                newItem,
                            ],
                        },
                    };
                }),

            updateItem: (id, scenarioId, changes) =>
                set((state) => {
                    const scenarioItems =
                        state.items[scenarioId] ?? [];

                    return {
                        items: {
                            ...state.items,
                            [scenarioId]: scenarioItems.map((item) =>
                                item.id === id
                                    ? { ...item, ...changes }
                                    : item
                            ),
                        },
                    };
                }),

            removeItem: (id, scenarioId) =>
                set((state) => {
                    const scenarioItems =
                        state.items[scenarioId] ?? [];

                    return {
                        items: {
                            ...state.items,
                            [scenarioId]: scenarioItems.filter(
                                (item) => item.id !== id
                            ),
                        },
                    };
                }),

            removeAllByScenario: (scenarioId) =>
                set((state) => {
                    const { [scenarioId]: _, ...rest } =
                        state.items;
                    return { items: rest };
                }),

            duplicateScenarioItems: (sourceId, targetId) => {
                const sourceItems = get().items[sourceId] ?? [];
                const duplicated = sourceItems.map((item) => ({
                    ...item,
                    id: crypto.randomUUID(),
                    scenarioId: targetId,
                }));
                set((state) => ({
                    items: {
                        ...state.items,
                        [targetId]: duplicated,
                    },
                }));
            },
        }),
        {
            name: "cashflow-storage",

            partialize: (state) => ({
                items: state.items,
            }),

            version: 1,
        }
    )
);

// ── Selectores auxiliares ──
const EMPTY_ITEMS: CashflowItem[] = []; // referencia estable, no se recrea en cada render

export const useScenarioItems = (scenarioId: string) =>
    useCashflowStore((state) => state.items[scenarioId] ?? EMPTY_ITEMS);

export const useScenarioIncomes = (scenarioId: string) =>
    useCashflowStore((state) =>
        (state.items[scenarioId] ?? EMPTY_ITEMS).filter((i) => i.type === "income")
    );

export const useScenarioExpenses = (scenarioId: string) =>
    useCashflowStore((state) =>
        (state.items[scenarioId] ?? EMPTY_ITEMS).filter((i) => i.type === "expense")
    );