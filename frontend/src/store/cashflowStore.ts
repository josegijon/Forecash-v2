import { create } from "zustand";

// ── Tipos ──

export type Frequency =
    | "once"        // pago único
    | "daily"
    | "weekly"
    | "biweekly"    // quincenal
    | "monthly"
    | "bimonthly"   // bimestral
    | "quarterly"   // trimestral
    | "semiannual"  // semestral
    | "annual";

export interface CashflowItem {
    id: string;
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;            // siempre positivo, el tipo indica si suma o resta
    categoryId: string;
    frequency: Frequency;
    startDate: string;         // ISO string "2026-03-01"
    endDate?: string;          // opcional: si no tiene, se repite indefinidamente
    note?: string;
}

// Tipo para crear un ítem (sin id, se genera automáticamente)
export type NewCashflowItem = Omit<CashflowItem, "id">;

interface CashflowState {
    // Mapa: scenarioId → ítems de ese escenario
    items: Record<string, CashflowItem[]>;

    addItem: (item: NewCashflowItem) => void;
    updateItem: (id: string, scenarioId: string, changes: Partial<CashflowItem>) => void;
    removeItem: (id: string, scenarioId: string) => void;
    removeAllByScenario: (scenarioId: string) => void;
}

export const useCashflowStore = create<CashflowState>((set) => ({
    // ── Estado ──
    items: {},

    // ── Acciones ──
    addItem: (item) =>
        set((state) => {
            const newItem: CashflowItem = {
                ...item,
                id: `cf-${Date.now()}`,
            };
            const scenarioItems = state.items[item.scenarioId] ?? [];

            return {
                items: {
                    ...state.items,
                    [item.scenarioId]: [...scenarioItems, newItem],
                },
            };
        }),

    updateItem: (id, scenarioId, changes) =>
        set((state) => {
            const scenarioItems = state.items[scenarioId] ?? [];

            return {
                items: {
                    ...state.items,
                    [scenarioId]: scenarioItems.map((item) =>
                        item.id === id ? { ...item, ...changes } : item
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
                    [scenarioId]: scenarioItems.filter((item) => item.id !== id),
                },
            };
        }),

    // Limpiar todos los ítems de un escenario (útil al eliminar escenario)
    removeAllByScenario: (scenarioId) =>
        set((state) => {
            const { [scenarioId]: _, ...rest } = state.items;
            return { items: rest };
        }),
}));

// ── Selectores auxiliares ──
// Se usan así: const items = useScenarioItems("scenario-1")

// Permiten obtener solo los ítems de un escenario, o solo ingresos/gastos, etc.
export const useScenarioItems = (scenarioId: string) =>
    useCashflowStore((state) => state.items[scenarioId] ?? []);

// Obtener solo ingresos de un escenario
export const useScenarioIncomes = (scenarioId: string) =>
    useCashflowStore(
        (state) => (state.items[scenarioId] ?? []).filter((i) => i.type === "income")
    );

// Obtener solo gastos de un escenario
export const useScenarioExpenses = (scenarioId: string) =>
    useCashflowStore(
        (state) => (state.items[scenarioId] ?? []).filter((i) => i.type === "expense")
    );