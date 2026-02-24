import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Monedas soportadas ──
export type Currency = "EUR" | "USD" | "GBP";

export const currencySymbols: Record<Currency, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
};

export type Theme = "light" | "dark";

interface SettingsState {
    currency: Currency;
    initialBalance: number;
    savingsGoal: number;
    theme: Theme;

    setCurrency: (currency: Currency) => void;
    setInitialBalance: (balance: number) => void;
    setSavingsGoal: (goal: number) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // ── Estado ──
            currency: "EUR",
            initialBalance: 0,
            savingsGoal: 0,
            theme: "dark",

            // ── Acciones ──
            setCurrency: (currency) =>
                set({ currency }),

            setInitialBalance: (initialBalance) =>
                set({ initialBalance }),

            setSavingsGoal: (savingsGoal) =>
                set({ savingsGoal }),

            setTheme: (theme) =>
                set({ theme }),

            toggleTheme: () =>
                set((state) => ({
                    theme:
                        state.theme === "dark"
                            ? "light"
                            : "dark",
                })),
        }),
        {
            name: "settings-storage",

            partialize: (state) => ({
                currency: state.currency,
                initialBalance: state.initialBalance,
                savingsGoal: state.savingsGoal,
                theme: state.theme,
            }),

            version: 1,
        }
    )
);

// ── Selector auxiliar ──
export const useCurrencySymbol = () =>
    useSettingsStore((state) => currencySymbols[state.currency]);