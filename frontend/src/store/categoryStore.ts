import { create } from "zustand";

export interface Category {
    id: string;
    name: string;
    type: "income" | "expense";
}

interface CategoryState {
    categories: Category[];
    addCategory: (name: string, type: "income" | "expense") => void;
    removeCategory: (id: string) => void;
    renameCategory: (id: string, newName: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    // ── Estado ──
    categories: [
        { id: "cat-1", name: "Salario", type: "income" },
        { id: "cat-2", name: "Regalo", type: "income" },
        { id: "cat-3", name: "Alquiler", type: "expense" },
        { id: "cat-4", name: "Comida", type: "expense" },
        { id: "cat-5", name: "Transporte", type: "expense" },
        { id: "cat-6", name: "Deuda", type: "expense" },
        { id: "cat-7", name: "Suscripciones", type: "expense" },
    ],

    // ── Acciones ──
    addCategory: (name, type) =>
        set((state) => {
            // Evitar duplicados (mismo nombre y tipo)
            const exists = state.categories.some(
                (c) => c.name.toLowerCase() === name.toLowerCase() && c.type === type
            );
            if (exists) return state;

            return {
                categories: [
                    ...state.categories,
                    { id: `cat-${Date.now()}`, name, type },
                ],
            };
        }),

    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        })),

    renameCategory: (id, newName) =>
        set((state) => ({
            categories: state.categories.map((c) =>
                c.id === id ? { ...c, name: newName } : c
            ),
        })),
}));