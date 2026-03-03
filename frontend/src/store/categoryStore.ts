import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

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
    resetCategories: () => void;
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

            resetCategories: () =>
                set({ categories: DEFAULT_CATEGORIES }),
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

export const useIncomeCategories = () => {
    const categories = useCategoryStore((state) => state.categories);
    return categories.filter((c) => c.type === "income");
};

export const useExpenseCategories = () => {
    const categories = useCategoryStore((state) => state.categories);
    return categories.filter((c) => c.type === "expense");
};