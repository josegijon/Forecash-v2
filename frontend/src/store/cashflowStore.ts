import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Tipos ──

export type Frequency =
    | "once"
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "bimonthly"
    | "quarterly"
    | "semiannual"
    | "annual";

export interface CashflowItem {
    id: string;
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startDate: string;
    endDate?: string;
    note?: string;
}

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
                        id: crypto.randomUUID(), // 🔥 mejor que Date.now()
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
// Se usan así: const items = useScenarioItems("scenario-1") 
const EMPTY_ITEMS: CashflowItem[] = []; // referencia estable, no se recrea en cada render 

export const useScenarioItems = (scenarioId: string) =>
    useCashflowStore((state) => state.items[scenarioId] ?? EMPTY_ITEMS);

export const useScenarioIncomes = (scenarioId: string) =>
    useCashflowStore(
        (state) => (state.items[scenarioId] ?? EMPTY_ITEMS).filter((i) => i.type === "income"));

export const useScenarioExpenses = (scenarioId: string) =>
    useCashflowStore((state) =>
        (state.items[scenarioId] ?? EMPTY_ITEMS).filter((i) => i.type === "expense"));