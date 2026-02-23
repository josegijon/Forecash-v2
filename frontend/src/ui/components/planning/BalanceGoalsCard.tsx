import { CurrencyInputField } from "./CurrencyInputField";
import { GoalProgressRing } from "./GoalProgressRing";

interface BalanceGoalsCardProps {
    title: string;
}

export const BalanceGoalsCard = ({ title }: BalanceGoalsCardProps) => {
    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold">{title}</h3>
            </div>

            <div className="space-y-4">
                <CurrencyInputField
                    label="Saldo Inicial Actual"
                    value={5000}
                    currencySymbol="€"
                    // TODO: Implementar onChange para actualizar el estado del saldo inicial
                    onChange={(newValue) => console.log("Nuevo saldo inicial:", newValue)}
                />


                <CurrencyInputField
                    label="Objetivo de Ahorro Mensual"
                    value={800}
                    currencySymbol="€"
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
