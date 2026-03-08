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
    theme: Theme;

    setCurrency: (currency: Currency) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // ── Estado ──
            currency: "EUR",
            theme: "dark",

            // ── Acciones ──
            setCurrency: (currency) =>
                set({ currency }),

            setTheme: (theme) =>
                set({ theme }),

            toggleTheme: () =>
                set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
        }),
        {
            name: "settings-storage",

            partialize: (state) => ({
                currency: state.currency,
                theme: state.theme,
            }),

            version: 1,
        }
    )
);

// ── Selector auxiliar ──
export const useCurrencySymbol = () =>
    useSettingsStore((state) => currencySymbols[state.currency]);