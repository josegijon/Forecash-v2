import { useState } from "react"
import { AddCashflowModal } from "@/ui/components/modals/AddCashflowModal"
import type { CashflowFormData } from "@/ui/components/modals/AddCashflowModal"
import { BalanceGoalsCard } from "@/ui/components/planning/BalanceGoalsCard"
import { CashflowItemList } from "@/ui/components/planning/CashflowItemList"
import { CategoryExpensesCard } from "@/ui/components/planning/CategoryExpensesCard"
import { MonthlyRatiosCard } from "@/ui/components/planning/MonthlyRatiosCard"
import { PlanningSummaryStrip } from "@/ui/components/planning/PlanningSummaryStrip"
import { MonthNavigator } from "@/ui/components/planning/MonthNavigator"
import { useCashflowStore, useScenarioStore } from "@/store"

export const PlanningPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const addItem = useCashflowStore((s) => s.addItem);

    const handleSubmitNewItem = (data: CashflowFormData) => {
        // Convertir "startsInMonths" en fecha ISO
        const start = new Date();
        start.setMonth(start.getMonth() + data.startsInMonths);

        // Convertir "endsInMonths" en fecha ISO, si se proporcionó
        let endDate: string | undefined = undefined;

        if (data.endsInMonths !== undefined) {
            const end = new Date();
            end.setMonth(end.getMonth() + data.endsInMonths);
            endDate = end.toISOString().slice(0, 10);
        }

        addItem({
            scenarioId: activeScenarioId,
            type: data.type,
            name: data.concept,
            amount: data.amount,
            categoryId: data.category, // TODO: mapear al id real cuando conectemos el modal con categoryStore
            frequency: data.frequency,
            startDate: start.toISOString().slice(0, 10),
            endDate,
        })
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
                        {/* Gastos por categoría */}
                        <CategoryExpensesCard title="Gastos por categoría" />
                    </div>
                </div>
            </div>
        </div >
    )
}
