import { LayoutList, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";

import { CashflowItem } from "./CashflowItem";
import { useCashflowItemListModel } from "./useCashflowItemListModel";
import { AddCashflowModal } from "@/ui/components/modals/AddCashflowModal";
import { useCashflowStore, useScenarioStore } from "@/store";
import { useState } from "react";
import type { CashflowEditData } from "../../hooks/useCashflowForm";

interface CashflowItemListProps {
    onAddItem?: () => void;
}

const filterIcons: Record<string, React.ReactNode> = {
    all: <LayoutList size={13} />,
    income: <TrendingUp size={13} />,
    expense: <TrendingDown size={13} />,
};

export const CashflowItemList = ({ onAddItem }: CashflowItemListProps) => {
    const {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredItems,
        currencySymbol,
        filterTabs,
        getCategoryName,
        onDeleteItem,
    } = useCashflowItemListModel();

    const [editingItem, setEditingItem] = useState<CashflowEditData | null>(null);

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const updateItem = useCashflowStore((s) => s.updateItem);

    const handleEditItem = (item: ReturnType<typeof useCashflowItemListModel>["filteredItems"][number]) => {
        setEditingItem({
            id: item.id,
            type: item.type,
            concept: item.name,
            amount: item.amount,
            categoryId: item.categoryId,
            frequency: item.frequency,
            startsInMonths: 0,
            endsInMonths: undefined,
        });
    };

    const handleUpdateItem = (data: CashflowEditData) => {
        updateItem(data.id, activeScenarioId, {
            name: data.concept,
            amount: data.amount,
            categoryId: data.categoryId,
            frequency: data.frequency,
        });
        setEditingItem(null);
    };

    return (
        <>
            <div className="flex flex-col gap-1.5 xl:rounded-3xl border-0 text-card-foreground bg-transparent shadow-none xl:px-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-6">
                    <h3 className="text-lg font-medium leading-none tracking-tight">
                        Flujo de Efectivo
                    </h3>
                    <button
                        onClick={onAddItem}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        Añadir
                    </button>
                </div>

                {/* Filters + Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="flex bg-muted/60 rounded-xl p-1 gap-0.5">
                        {filterTabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                aria-pressed={filter === key}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${filter === key
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <span className={`transition-colors ${filter === key
                                    ? key === "income"
                                        ? "text-emerald-500"
                                        : key === "expense"
                                            ? "text-rose-500"
                                            : "text-primary"
                                    : ""
                                    }`}>
                                    {filterIcons[key] ?? null}
                                </span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1">
                        <Search
                            size={13}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            aria-label="Buscar partidas"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-muted/40 rounded-xl border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className="
                    overflow-x-auto
                    [&::-webkit-scrollbar]:h-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-border/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb:hover]:bg-border/70
                ">
                    <table className="w-full caption-bottom text-sm border-separate border-spacing-y-3">
                        <thead className="hidden xl:table-header-group">
                            <tr className="text-sm bg-card">
                                <th id="col-name" className="h-12 px-4 text-left align-middle font-medium text-muted-foreground rounded-l-xl">Nombre</th>
                                <th id="col-cat" className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                <th id="col-freq" className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Frecuencia</th>
                                <th id="col-amount" className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cantidad</th>
                                <th id="col-action" className="h-12 px-4 align-middle rounded-r-xl">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
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
                                        onEdit={() => handleEditItem(item)}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                        <p className="text-sm font-medium">No se encontraron ítems</p>
                                        <p className="text-xs mt-1">Intenta con otro filtro o término de búsqueda</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de edición — gestionado aquí, no en PlanningPage */}
            <AddCashflowModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSave={() => { }} // no se usa en modo edición
                onUpdate={handleUpdateItem}
                initialData={editingItem ?? undefined}
            />
        </>
    );
};