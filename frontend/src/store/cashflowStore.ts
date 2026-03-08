import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CashflowItem, Frequency } from "@core";
import { validateCashflowItem } from "@core";
import { CashflowPersistedSchema } from "@/schemas/store.schemas";
import { createValidatedMerge } from "./persist-validation";

export type { Frequency, CashflowItem };

export type NewCashflowItem = Omit<CashflowItem, "id">;

/** Campos que el caller puede modificar en un item existente. */
type CashflowItemUpdatable = Omit<CashflowItem, "id" | "scenarioId">;

interface CashflowState {
    items: Record<string, CashflowItem[]>;

    addItem: (item: NewCashflowItem) => void;
    updateItem: (
        id: string,
        scenarioId: string,
        changes: Partial<CashflowItemUpdatable>,
    ) => void;
    removeItem: (id: string, scenarioId: string) => void;
    removeAllByScenario: (scenarioId: string) => void;
    duplicateScenarioItems: (sourceId: string, targetId: string) => void;
}

export const useCashflowStore = create<CashflowState>()(
    persist(
        (set, get) => ({
            items: {},

            addItem: (item) => {
                // Validación de invariantes de dominio antes de persistir
                const violations = validateCashflowItem(item);
                if (violations.length > 0) {
                    if (import.meta.env.DEV) {
                        console.error(
                            `[cashflowStore] addItem rechazado: [${violations.join(", ")}]`,
                        );
                    }
                    return;
                }

                set((state) => {
                    const newItem: CashflowItem = {
                        ...item,
                        id: crypto.randomUUID(),
                    };
                    const scenarioItems = state.items[item.scenarioId] ?? [];
                    return {
                        items: {
                            ...state.items,
                            [item.scenarioId]: [...scenarioItems, newItem],
                        },
                    };
                });
            },

            updateItem: (id, scenarioId, changes) =>
                set((state) => {
                    const scenarioItems = state.items[scenarioId] ?? [];
                    return {
                        items: {
                            ...state.items,
                            [scenarioId]: scenarioItems.map((item) =>
                                item.id === id
                                    ? { ...item, ...changes }
                                    : item,
                            ),
                        },
                    };
                }),

            removeItem: (id, scenarioId) =>
                set((state) => {
                    const scenarioItems = state.items[scenarioId] ?? [];
                    return {
                        items: {
                            ...state.items,
                            [scenarioId]: scenarioItems.filter(
                                (item) => item.id !== id,
                            ),
                        },
                    };
                }),

            removeAllByScenario: (scenarioId) =>
                set((state) => {
                    const { [scenarioId]: _, ...rest } = state.items;
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
            partialize: (state) => ({ items: state.items }),
            version: 1,
            merge: createValidatedMerge<CashflowState>(
                CashflowPersistedSchema,
                "cashflowStore",
            ),
        },
    ),
);

// ── Selectores auxiliares ──
const EMPTY_ITEMS: CashflowItem[] = [];

export const useScenarioItems = (scenarioId: string) =>
    useCashflowStore((state) => state.items[scenarioId] ?? EMPTY_ITEMS);

export const useScenarioIncomes = (scenarioId: string) =>
    useCashflowStore((state) =>
        (state.items[scenarioId] ?? EMPTY_ITEMS).filter(
            (i) => i.type === "income",
        ),
    );

export const useScenarioExpenses = (scenarioId: string) =>
    useCashflowStore((state) =>
        (state.items[scenarioId] ?? EMPTY_ITEMS).filter(
            (i) => i.type === "expense",
        ),
    );