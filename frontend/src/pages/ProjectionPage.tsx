import { useState } from "react";

import { BalanceAreaChart } from "@/ui/components/projection/BalanceAreaChart";
import { CashflowBarChart } from "@/ui/components/projection/CashflowBarChart";
import { ProjectionAlerts } from "@/ui/components/projection/ProjectionAlerts";
import { ProjectionDetailTable } from "@/ui/components/projection/ProjectionDetailTable";
import { ProjectionHeader } from "@/ui/components/projection/ProjectionHeader";
import { ProjectionSummaryCards } from "@/ui/components/projection/ProjectionSummaryCards";
import { useProjectionData } from "@/ui/components/projection/useProjectionData";

export const ProjectionPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);

    const {
        data,
        firstPoint,
        lastPoint,
        balanceDiff,
        isPositive,
        negativeMonths,
        alerts,
        minBalance,
    } = useProjectionData(selectedMonths);

    const worstMonth = data.find((d) => d.balance === minBalance);

    return (
        <div className="flex-1 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">

                <ProjectionHeader
                    selectedMonths={selectedMonths}
                    onMonthsChange={setSelectedMonths}
                />

                <ProjectionAlerts alerts={alerts} />

                <ProjectionSummaryCards
                    currentBalance={firstPoint.balance}
                    finalBalance={lastPoint.balance}
                    balanceDiff={balanceDiff}
                    isPositive={isPositive}
                    negativeMonths={negativeMonths}
                    selectedMonths={selectedMonths}
                    minBalance={minBalance}
                    worstMonth={worstMonth}
                />

                <CashflowBarChart data={data} selectedMonths={selectedMonths} />

                <BalanceAreaChart data={data} selectedMonths={selectedMonths} />

                <ProjectionDetailTable data={data} />

            </div>
        </div>
    );
};