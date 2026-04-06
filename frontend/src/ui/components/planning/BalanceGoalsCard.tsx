import { useCallback, useEffect, useRef, useState } from "react";

import { useActiveScenario, useCurrencySymbol, useScenarioStore } from "@/store";
import { CurrencyInputField } from "./CurrencyInputField";
import { CushionCalculatorModal } from "../modals/CushionCalculatorModal";
import { Badge } from "@/ui/primitives/Badge";

const SAVED_TIMEOUT_MS = 1500;

export const BalanceGoalsCard = () => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const currencySymbol = useCurrencySymbol();

    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;
    const cushionBalance = activeScenario?.cushionBalance ?? 0;
    const capitalGoal = activeScenario?.capitalGoal ?? 0;

    const setInitialBalance = useScenarioStore((s) => s.setInitialBalance);
    const setSavingsGoal = useScenarioStore((s) => s.setSavingsGoal);
    const setCushionBalance = useScenarioStore((s) => s.setCushionBalance);
    const setCapitalGoal = useScenarioStore((s) => s.setCapitalGoal);

    const [showCalculator, setShowCalculator] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const triggerSaved = useCallback(() => {
        setShowSaved(true);
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setShowSaved(false), SAVED_TIMEOUT_MS);
    }, []);

    useEffect(() => {
        return () => {
            if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col gap-5 rounded-3xl border-0 bg-transparent p-0 text-card-foreground shadow-none">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Configura tu plan
                </h3>
                <span
                    className={`text-xs text-muted-foreground transition-opacity duration-300 ${showSaved ? "opacity-100" : "opacity-0"}`}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    ✓ Guardado
                </span>
            </div>

            {/* Sección base */}
            <div className="flex flex-col gap-4">
                <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-foreground">Base del plan</h4>
                    <p className="text-xs text-muted-foreground">
                        Rellénalos primero para obtener una lectura fiable.
                    </p>
                </div>

                <CurrencyInputField
                    label="Saldo en cuenta hoy"
                    sublabel="Puede ser negativo si tienes deudas."
                    value={initialBalance}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => {
                        setInitialBalance(activeScenarioId, newValue);
                        triggerSaved();
                    }}
                    allowNegative
                />

                <CurrencyInputField
                    label="Objetivo de ahorro mensual"
                    value={savingsGoal}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => {
                        setSavingsGoal(activeScenarioId, newValue);
                        triggerSaved();
                    }}
                />
            </div>

            {/* Divider */}
            <hr className="border-border/50" />

            {/* Sección opcional */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                        Protección y crecimiento
                    </h4>
                    <Badge>Opcional</Badge>
                </div>

                <div className="flex flex-col gap-2">
                    <CurrencyInputField
                        label="Colchón mínimo"
                        value={cushionBalance}
                        currencySymbol={currencySymbol}
                        onChange={(newValue) => {
                            setCushionBalance(activeScenarioId, newValue);
                            triggerSaved();
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowCalculator(true)}
                        className="w-fit rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background 
                         bg-primary/10 hover:bg-primary/15 cursor-pointer"
                    >
                        ¿Cuánto debería ser mi colchón?
                    </button>
                </div>

                <CurrencyInputField
                    label="Objetivo de capital"
                    value={capitalGoal}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => {
                        setCapitalGoal(activeScenarioId, newValue);
                        triggerSaved();
                    }}
                />
            </div>

            {showCalculator && (
                <CushionCalculatorModal
                    onClose={() => setShowCalculator(false)}
                    onApply={(value) => {
                        setCushionBalance(activeScenarioId, value);
                        triggerSaved();
                    }}
                />
            )}
        </div>
    );
};