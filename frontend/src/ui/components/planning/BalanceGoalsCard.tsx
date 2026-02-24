import { CurrencyInputField } from "./CurrencyInputField";
import { GoalProgressRing } from "./GoalProgressRing";
import { useCurrencySymbol } from "@/store"

interface BalanceGoalsCardProps {
    title: string;
}

export const BalanceGoalsCard = ({ title }: BalanceGoalsCardProps) => {
    const currencySymbol = useCurrencySymbol();

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <span className="text-amber-500 text-sm">🎯</span>
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            <div className="space-y-4">
                <CurrencyInputField
                    label="Saldo Inicial Actual"
                    value={5000}
                    currencySymbol={currencySymbol}
                    // TODO: Implementar onChange para actualizar el estado del saldo inicial
                    onChange={(newValue) => console.log("Nuevo saldo inicial:", newValue)}
                />


                <CurrencyInputField
                    label="Objetivo de Ahorro Mensual"
                    value={800}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => console.log("Nuevo objetivo de ahorro:", newValue)}
                />

                {/* Progreso Meta */}
                <GoalProgressRing
                    progress={60} // TODO: Calcular el progreso real basado en el saldo inicial y el objetivo de ahorro
                    savedAmount={3000} // TODO: Calcular la cantidad ahorrada real
                    goalAmount={5000} // TODO: Calcular la cantidad objetivo real basada en el saldo inicial y el objetivo de ahorro mensual
                />
            </div>
        </div>
    )
}
