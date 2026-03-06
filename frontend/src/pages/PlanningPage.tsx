import { useState } from "react"

import { createPlannedCashflowItem } from "@core"

import { useCashflowStore, usePlanningStore, useScenarioStore } from "@/store"
import { AddCashflowModal } from "@/ui/components/modals/AddCashflowModal"
import type { CashflowFormData } from "@/ui/components/modals/AddCashflowModal"
import { BalanceGoalsCard } from "@/ui/components/planning/BalanceGoalsCard"
import { CashflowItemList } from "@/ui/components/planning/CashflowItemList"
import { CategoryExpensesCard } from "@/ui/components/planning/CategoryExpensesCard"
import { MonthlyRatiosCard } from "@/ui/components/planning/MonthlyRatiosCard"
import { PlanningSummaryStrip } from "@/ui/components/planning/PlanningSummaryStrip"
import { MonthNavigator } from "@/ui/components/planning/MonthNavigator"
import { GoalsProgressCard } from "@/ui/components/planning/GoalsProgressCard"

export const PlanningPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const addItem = useCashflowStore((s) => s.addItem);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const activeMonth = usePlanningStore((s) => s.activeMonth);

    const handleSubmitNewItem = (data: CashflowFormData) => {
        const newItem = createPlannedCashflowItem({
            scenarioId: activeScenarioId,
            type: data.type,
            name: data.concept,
            amount: data.amount,
            categoryId: data.categoryId,
            frequency: data.frequency,
            startsInMonths: data.startsInMonths,
            endsInMonths: data.endsInMonths
        });

        addItem(newItem);
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Month Navigator */}
                <div className="flex items-center justify-between">
                    <MonthNavigator />
                </div>

                {/* KPI Summary Strip */}
                <PlanningSummaryStrip />

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">

                    <CashflowItemList
                        onAddItem={() => setShowAddModal(true)}
                    />

                    <AddCashflowModal
                        isOpen={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onSave={handleSubmitNewItem}
                    />

                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        {/* Ratios mensuales */}
                        <MonthlyRatiosCard title="Ratios Mensuales" />
                        {/* Saldo y metas */}
                        <BalanceGoalsCard title="Saldo y metas" />
                        {/* Progreso de objetivos */}
                        <GoalsProgressCard title="Progreso de objetivos" />
                        {/* Gastos por categoría */}
                        <CategoryExpensesCard
                            title="Gastos por categoría"
                            type="expense"
                            year={activeYear}
                            month={activeMonth}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}
