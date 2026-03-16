import { SummaryCard } from "../kpi/SummaryCard";
import { fmt } from "@/ui/utils/format";
import { useCurrencySymbol } from "@/store";

interface SimulationSummaryCardsProps {
    actualBalance: number;
    comparedBalance: number;
    scenarioName: string;
    selectedMonths: number;
}

export const SimulationSummaryCards = ({ actualBalance, comparedBalance, scenarioName, selectedMonths }: SimulationSummaryCardsProps) => {
    const diff = comparedBalance - actualBalance;
    const isPositive = diff >= 0;
    const currencySymbol = useCurrencySymbol();

    const diffPercent = actualBalance !== 0
        ? ((diff / actualBalance) * 100).toFixed(1)
        : null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-center gap-4 lg:max-w-[80%] mx-auto">
            <SummaryCard
                label="Escenario Actual"
                value={`${fmt(actualBalance)} ${currencySymbol}`}
                description={`Saldo proyectado a ${selectedMonths} meses`}
            />

            <SummaryCard
                label={scenarioName}
                value={`${fmt(comparedBalance)} ${currencySymbol}`}
                description={`Saldo proyectado a ${selectedMonths} meses`}
            />

            <SummaryCard
                label="Diferencia"
                value={`${isPositive ? "+" : ""}${fmt(diff)} ${currencySymbol}`}
                description={`El ${scenarioName.toLowerCase()} ${isPositive ? "supera" : "queda por debajo de"} tu escenario actual`}
                trend={diffPercent !== null ? {
                    value: `${diffPercent}%`,
                    positive: isPositive,
                    bgColor: isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                } : undefined}
            />
        </div>
    );
};