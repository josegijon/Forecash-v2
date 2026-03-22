import { SummaryCard } from "../kpi/SummaryCard";
import { fmt } from "@/ui/utils/format";
import { useCurrencySymbol } from "@/store";

interface SimulationSummaryCardsProps {
    actualBalance: number;
    comparedBalance: number;
    scenarioName: string;
    selectedMonths: number;
}

function getDiffDescription(diff: number, actualBalance: number): string {
    if (diff === 0) return "Sin diferencia entre escenarios";

    const ratio = actualBalance !== 0 ? Math.abs(diff / actualBalance) : Infinity;

    if (ratio < 0.02) return "Sin impacto significativo";

    return diff > 0
        ? "Más favorable · Escenario recomendado"
        : "Menos favorable · Revisa si vale la pena";
}

export const SimulationSummaryCards = ({
    actualBalance,
    comparedBalance,
    scenarioName,
    selectedMonths,
}: SimulationSummaryCardsProps) => {
    const diff = comparedBalance - actualBalance;
    const isPositive = diff >= 0;
    const currencySymbol = useCurrencySymbol();

    const diffPercent = actualBalance !== 0
        ? `${isPositive ? "+" : ""}${((diff / actualBalance) * 100).toFixed(1)}%`
        : isPositive ? "Positivo" : "Negativo";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-center gap-4">
            <SummaryCard
                label="Escenario Actual"
                value={`${fmt(actualBalance)} ${currencySymbol}`}
                description="Tu situación de referencia"
                isBaseline
            />

            <SummaryCard
                label={scenarioName}
                value={`${fmt(comparedBalance)} ${currencySymbol}`}
                description={`Saldo proyectado a ${selectedMonths} meses`}
            />

            <SummaryCard
                label="Diferencia"
                value={`${isPositive ? "+" : ""}${fmt(diff)} ${currencySymbol}`}
                description={getDiffDescription(diff, actualBalance)}
                trend={{
                    value: diffPercent,
                    positive: isPositive,
                }}
                isResult
            />
        </div>
    );
};