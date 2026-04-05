import { useState } from "react";

import { createPlannedCashflowItem } from "@core";

import { useCashflowStore, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";
import { AddCashflowModal } from "@/ui/components/modals/AddCashflowModal";
import { BalanceGoalsCard } from "@/ui/components/planning/BalanceGoalsCard";
import { CashflowItemList } from "@/ui/components/planning/CashflowItemList";
import { CategoryExpensesCard } from "@/ui/components/planning/CategoryExpensesCard";
import { MonthlyRatiosCard } from "@/ui/components/planning/MonthlyRatiosCard";
import { PlanningSummaryStrip } from "@/ui/components/planning/PlanningSummaryStrip";
import { MonthNavigator } from "@/ui/components/planning/MonthNavigator";
import { GoalsProgressCard } from "@/ui/components/planning/GoalsProgressCard";
import { EmptyPlanningBanner } from "@/ui/components/planning/EmptyPlanningBanner";
import type { CashflowFormData } from "@/ui/hooks/useCashflowForm";

export const PlanningPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const addItem = useCashflowStore((s) => s.addItem);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const activeMonth = usePlanningStore((s) => s.activeMonth);

    const items = useScenarioItems(activeScenarioId);
    const isEmpty = items.length === 0;

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
        <>
            <MonthNavigator />
            <PlanningSummaryStrip />

            {isEmpty && (
                <EmptyPlanningBanner onAddItem={() => setIsAddModalOpen(true)} />
            )}

            {!isEmpty && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
                    {/* ── Mobile: columna única en el orden de consulta
                        Desktop: dos columnas 7/5 ── */}

                    {/* Columna derecha en desktop — en móvil aparece primero
                        porque está antes en el DOM que CashflowItemList */}
                    <div className="md:col-span-5 md:order-2 flex flex-col gap-6">
                        <MonthlyRatiosCard title="Ratios Mensuales" />
                        <CategoryExpensesCard
                            title="Gastos por categoría"
                            type="expense"
                            year={activeYear}
                            month={activeMonth}
                            onAddItem={() => setIsAddModalOpen(true)}
                        />
                        <GoalsProgressCard title="Progreso de objetivos" />
                        <BalanceGoalsCard />
                    </div>

                    {/* Columna izquierda en desktop — en móvil aparece después */}
                    <div className="md:col-span-7 md:order-1  gap-6">
                        <CashflowItemList
                            onAddItem={() => setIsAddModalOpen(true)}
                        />
                    </div>
                </div>
            )}

            <AddCashflowModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddItem}
            />
        </>
    );
};