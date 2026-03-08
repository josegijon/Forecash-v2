import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SettingsPersistedSchema } from "@/schemas/store.schemas";
import { createValidatedMerge } from "./persist-validation";

export type Currency = "EUR" | "USD" | "GBP";

export const currencySymbols: Record<Currency, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
};

const VALID_CURRENCIES = new Set<string>(["EUR", "USD", "GBP"]);
const VALID_THEMES = new Set<string>(["light", "dark"]);

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
            currency: "EUR",
            theme: "dark",

            setCurrency: (currency) => {
                if (!VALID_CURRENCIES.has(currency)) return;
                set({ currency });
            },

            setTheme: (theme) => {
                if (!VALID_THEMES.has(theme)) return;
                set({ theme });
            },

            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "dark" ? "light" : "dark",
                })),
        }),
        {
            name: "settings-storage",
            partialize: (state) => ({
                currency: state.currency,
                theme: state.theme,
            }),
            version: 1,
            merge: createValidatedMerge<SettingsState>(
                SettingsPersistedSchema,
                "settingsStore",
            ),
        },
    ),
);

export const useCurrencySymbol = () =>
    useSettingsStore((state) => currencySymbols[state.currency]);