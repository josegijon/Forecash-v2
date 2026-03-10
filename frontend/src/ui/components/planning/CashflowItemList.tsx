import { LayoutList, PlusCircle, Search, TrendingDown, TrendingUp } from "lucide-react";

import { CashflowItem } from "./CashflowItem";
import { useCashflowItemListModel } from "./useCashflowItemListModel";

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

    return (
        <div className="flex flex-col gap-1.5 rounded-3xl border-0 text-card-foreground bg-transparent shadow-none px-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between py-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Flujo de Efectivo
                </h3>
                <button
                    onClick={onAddItem}
                    className="flex items-center gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium shadow-sm"
                >
                    <PlusCircle size={16} />
                    <span>Añadir</span>
                </button>
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">

                {/* Filter tabs */}
                <div className="flex bg-muted/60 rounded-xl p-1 gap-0.5">
                    {filterTabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
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
                            {label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar..."
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

            {/* Items */}
            <table className="w-full caption-bottom text-sm border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-sm bg-card transition-colors">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground rounded-l-3xl">
                            Nombre
                        </th>

                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Categoría
                        </th>

                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Frecuencia
                        </th>

                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Cantidad
                        </th>

                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground rounded-r-3xl">
                            Eliminar
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
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-400">
                                <p className="text-sm font-medium">No se encontraron ítems</p>
                                <p className="text-xs mt-1">Intenta con otro filtro o término de búsqueda</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};