import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const DEFAULT_CATEGORIES: Category[] = [
    { id: "cat-1", name: "Salario", type: "income" },
    { id: "cat-2", name: "Regalo", type: "income" },
    { id: "cat-3", name: "Alquiler", type: "expense" },
    { id: "cat-4", name: "Comida", type: "expense" },
    { id: "cat-5", name: "Transporte", type: "expense" },
    { id: "cat-6", name: "Deuda", type: "expense" },
    { id: "cat-7", name: "Suscripciones", type: "expense" },
];

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            // ── Estado ──
            categories: DEFAULT_CATEGORIES,

            // ── Acciones ──
            addCategory: (name, type) =>
                set((state) => {
                    const trimmed = name.trim();

                    if (!trimmed) return state;

                    const exists = state.categories.some(
                        (c) =>
                            c.name.toLowerCase() === trimmed.toLowerCase() &&
                            c.type === type
                    );

                    if (exists) return state;

                    return {
                        categories: [
                            ...state.categories,
                            {
                                id: crypto.randomUUID(),
                                name: trimmed,
                                type,
                            },
                        ],
                    };
                }),

            removeCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter(
                        (c) => c.id !== id
                    ),
                })),

            renameCategory: (id, newName) =>
                set((state) => {
                    const trimmed = newName.trim();
                    if (!trimmed) return state;

                    return {
                        categories: state.categories.map((c) =>
                            c.id === id ? { ...c, name: trimmed } : c
                        ),
                    };
                }),
        }),
        {
            name: "category-storage",

            partialize: (state) => ({
                categories: state.categories,
            }),

            version: 1,
        }
    )
);

export const useIncomeCategories = () =>
    useCategoryStore((state) =>
        state.categories.filter((c) => c.type === "income")
    );

export const useExpenseCategories = () =>
    useCategoryStore((state) =>
        state.categories.filter((c) => c.type === "expense")
    );