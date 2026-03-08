import { useCallback, useMemo, useState } from "react";

import { projectBalanceSeries, type BalanceSeriesPoint } from "@core";

import { SimulationHeader } from "@/ui/components/simulation/SimulationHeader";
import { SimulationMilestonesTable } from "@/ui/components/simulation/SimulationMilestonesTable";
import { SimulationChart } from "@/ui/components/simulation/SimulationChart";
import { SimulationSummaryCards } from "@/ui/components/simulation/SimulationSummaryCards";
import { useActiveScenario, useCashflowStore, useScenarioItems, useScenarioStore } from "@/store";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const toChartLabel = (point: BalanceSeriesPoint) =>
    `${MONTH_NAMES[point.month]} ${String(point.year).slice(-2)}`;

export const SimulationPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);
    const [selectedScenario, setSelectedScenario] = useState<string>("");

    const scenarios = useScenarioStore((s) => s.scenarios);
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const duplicateScenario = useScenarioStore((s) => s.duplicateScenario);
    const duplicateScenarioItems = useCashflowStore((s) => s.duplicateScenarioItems);
    const activeScenario = useActiveScenario();
    const initialBalance = activeScenario?.initialBalance ?? 0;

    const comparedScenarioId =
        selectedScenario ||
        scenarios.find((s) => s.id !== activeScenarioId)?.id ||
        activeScenarioId;

    const scenarioName =
        scenarios.find((s) => s.id === comparedScenarioId)?.name ?? "Escenario";

    const handleCopyScenario = useCallback(() => {
        const newScenarioId = duplicateScenario(activeScenarioId);
        if (newScenarioId) {
            duplicateScenarioItems(activeScenarioId, newScenarioId);
        }
    }, [activeScenarioId, duplicateScenario, duplicateScenarioItems]);

    const actualItems = useScenarioItems(activeScenarioId);
    const comparedItems = useScenarioItems(comparedScenarioId);

    const chartData = useMemo(() => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();

        const base = { items: actualItems, initialBalance, referenceYear: refYear, referenceMonth: refMonth, horizonMonths: selectedMonths };
        const actualSeries = projectBalanceSeries(base);
        const comparedSeries = projectBalanceSeries({ ...base, items: comparedItems });

        return actualSeries.map((point, i) => ({
            month: toChartLabel(point),
            actual: point.balance,
            comparado: comparedSeries[i].balance,
            diferencia: comparedSeries[i].balance - point.balance,
        }));
    }, [actualItems, comparedItems, selectedMonths, initialBalance]);

    const lastPoint = chartData[chartData.length - 1];

    return (
        <div className="flex-1 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
                <SimulationHeader
                    selectedScenario={comparedScenarioId}
                    selectedMonths={selectedMonths}
                    onScenarioChange={setSelectedScenario}
                    onMonthsChange={setSelectedMonths}
                    onCopyScenario={handleCopyScenario}
                />
                <SimulationSummaryCards
                    actualBalance={lastPoint.actual}
                    comparedBalance={lastPoint.comparado}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />
                <SimulationChart
                    data={chartData}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />
                <SimulationMilestonesTable
                    data={chartData}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />
            </div>
        </div>
    );
};