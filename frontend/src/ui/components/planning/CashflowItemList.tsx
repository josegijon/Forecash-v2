import { PlusCircle } from "lucide-react"
import { CashflowItem } from "./CashflowItem"

interface CashflowItemListProps {
    onAddItem?: () => void;
}

export const CashflowItemList = ({ onAddItem }: CashflowItemListProps) => {
    return (
        <div className="flex flex-col gap-6 col-span-12 lg:col-span-7 bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2.5 justify-between">
                <h3 className="font-bold text-lg">Entradas de Efectivo y Gastos</h3>
                <button
                    onClick={onAddItem}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all cursor-pointer"
                >
                    <PlusCircle size={18} />
                    <span className="hidden sm:inline">
                        NUEVO ÍTEM
                    </span>
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {/* {items.length > 0 */}
                {/* ? items.map((item) => ( */}
                <CashflowItem
                    key={1}
                    type="income"
                    name="Salario"
                    category="Trabajo"
                    frequency="Mensual"
                    amount={2500.00}
                // onDelete={() => onDeleteItem?.(item.id)}
                />
                <CashflowItem
                    key={2}
                    type="expense"
                    name="Alquiler"
                    category="Hogar"
                    frequency="Mensual"
                    amount={500.00}
                // onDelete={() => onDeleteItem?.(item.id)}
                />
                {/* )) :
                <p className="text-sm text-slate-500">No hay ítems de efectivo registrados. ¡Agrega uno para empezar a planificar tu futuro financiero!</p>
                } */}
            </div>
        </div>
    )
}
