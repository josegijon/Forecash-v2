import { useState } from "react"
import { AddCashflowModal } from "@/ui/components/modals/AddCashflowModal"
import type { CashflowFormData } from "@/ui/components/modals/AddCashflowModal"
import { BalanceGoalsCard } from "@/ui/components/planning/BalanceGoalsCard"
import { CashflowItemList } from "@/ui/components/planning/CashflowItemList"
import { CategoryExpensesCard } from "@/ui/components/planning/CategoryExpensesCard"
import { MonthlyRatiosCard } from "@/ui/components/planning/MonthlyRatiosCard"

export const PlanningPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleSubmitNewItem = (data: CashflowFormData) => {
        console.log("Nuevo ítem:", data);
        // TODO: Persistir en store
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto">
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
                        <MonthlyRatiosCard
                            title="Ratios Mensuales"
                        />

                        {/* Saldo y metas */}
                        <BalanceGoalsCard
                            title="Saldo y metas"
                        />

                        {/* Gastos por categoría */}
                        <CategoryExpensesCard
                            title="Gastos por categoría"
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}
