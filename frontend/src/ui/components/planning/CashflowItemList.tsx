import { PlusCircle, Search } from "lucide-react";

import { CashflowItem } from "./CashflowItem";
import { useCashflowItemListModel } from "./useCashflowItemListModel";

interface CashflowItemListProps {
    onAddItem?: () => void;
}

export const CashflowItemList = ({ onAddItem }: CashflowItemListProps) => {
    const {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredItems,
        summary,
        currencySymbol,
        filterTabs,
        getCategoryName,
        onDeleteItem,
    } = useCashflowItemListModel();

    return (
        <div className="flex flex-col gap-5 col-span-12 lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <h3 className="font-bold text-lg text-slate-900">Flujo de Efectivo</h3>
                <button
                    onClick={onAddItem}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-linear-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 px-4 py-2 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
                >
                    <PlusCircle size={16} />
                    <span className="hidden sm:inline">NUEVO ÍTEM</span>
                </button>
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                    {filterTabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filter === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2.5 max-h-105 overflow-y-auto scrollbar-hide">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <CashflowItem
                            key={item.id}
                            type={item.type}
                            name={item.name}
                            category={getCategoryName(item.categoryId)}
                            frequency={item.frequency}
                            currencySymbol={currencySymbol}
                            amount={item.amount}
                            onDelete={() => onDeleteItem(item.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <p className="text-sm font-medium">No se encontraron ítems</p>
                        <p className="text-xs mt-1">Intenta con otro filtro o término de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Summary footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ingresos</span>
                        <span className="text-sm font-bold text-emerald-600">
                            {currencySymbol}
                            {summary.totalIncome.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gastos</span>
                        <span className="text-sm font-bold text-rose-600">
                            {currencySymbol}
                            {summary.totalExpense.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance</span>
                    <span className={`text-sm font-extrabold ${summary.netBalance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {currencySymbol}
                        {summary.netBalance.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};