import { create } from "zustand";

// Monedas soportadas
export type Currency = "EUR" | "USD" | "GBP";

// Mapa de símbolos para mostrar en la UI
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

export const useSettingsStore = create<SettingsState>((set) => ({
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
            theme: state.theme === "dark" ? "light" : "dark",
        })),
}));

// ── Selector auxiliar ──
// Devuelve el símbolo de la moneda actual (€, $, £)
export const useCurrencySymbol = () =>
    useSettingsStore((state) => currencySymbols[state.currency]);