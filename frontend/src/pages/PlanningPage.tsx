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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const addItem = useCashflowStore((s) => s.addItem);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const activeMonth = usePlanningStore((s) => s.activeMonth);

    const handleAddItem = (data: CashflowFormData) => {
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

                {/* ── Siempre full width ── */}
                <MonthNavigator />
                <PlanningSummaryStrip />

                {/* ── Mobile: columna única en el orden de consulta
                        Desktop: dos columnas 7/5 ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Columna derecha en desktop — en móvil aparece primero
                        porque está antes en el DOM que CashflowItemList */}
                    <div className="lg:col-span-5 lg:order-2 space-y-6">
                        <MonthlyRatiosCard title="Ratios Mensuales" />
                        <CategoryExpensesCard
                            title="Gastos por categoría"
                            type="expense"
                            year={activeYear}
                            month={activeMonth}
                        />
                        <GoalsProgressCard title="Progreso de objetivos" />
                        <BalanceGoalsCard title="Saldo y metas" />
                    </div>

                    {/* Columna izquierda en desktop — en móvil aparece después */}
                    <div className="lg:col-span-7 lg:order-1">
                        <CashflowItemList
                            onAddItem={() => setIsAddModalOpen(true)}
                        />
                    </div>

                </div>

                <AddCashflowModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddItem}
                />

            </div>
        </div>
    );
};