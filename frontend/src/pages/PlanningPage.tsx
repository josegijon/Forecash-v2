import { useState } from "react";

import { createPlannedCashflowItem } from "@core";

import { useCashflowStore, usePlanningStore, useScenarioStore } from "@/store";
import { AddCashflowModal, type CashflowFormData } from "@/ui/components/modals/AddCashflowModal";
import { BalanceGoalsCard } from "@/ui/components/planning/BalanceGoalsCard";
import { CashflowItemList } from "@/ui/components/planning/CashflowItemList";
import { CategoryExpensesCard } from "@/ui/components/planning/CategoryExpensesCard";
import { MonthlyRatiosCard } from "@/ui/components/planning/MonthlyRatiosCard";
import { PlanningSummaryStrip } from "@/ui/components/planning/PlanningSummaryStrip";
import { MonthNavigator } from "@/ui/components/planning/MonthNavigator";
import { GoalsProgressCard } from "@/ui/components/planning/GoalsProgressCard";

export const PlanningPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // ← renombrado

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const addItem = useCashflowStore((s) => s.addItem);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const activeMonth = usePlanningStore((s) => s.activeMonth);

    const handleAddItem = (data: CashflowFormData) => {  // ← renombrado
        const newItem = createPlannedCashflowItem({
            scenarioId: activeScenarioId,
            type: data.type,
            name: data.concept,
            amount: data.amount,
            categoryId: data.categoryId,
            frequency: data.frequency,
            startsInMonths: data.startsInMonths,
            endsInMonths: data.endsInMonths,
        });

        addItem(newItem);
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
                <MonthNavigator />

                <PlanningSummaryStrip />

                <div className="grid grid-cols-12 gap-6">

                    <CashflowItemList
                        onAddItem={() => setIsAddModalOpen(true)}
                    />

                    <AddCashflowModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSave={handleAddItem}
                    />

                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        <MonthlyRatiosCard title="Ratios Mensuales" />
                        <BalanceGoalsCard title="Saldo y metas" />
                        <GoalsProgressCard title="Progreso de objetivos" />
                        <CategoryExpensesCard
                            title="Gastos por categoría"
                            type="expense"
                            year={activeYear}
                            month={activeMonth}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};