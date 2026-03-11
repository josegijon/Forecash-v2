import { LayoutList, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";

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
        <div className="flex flex-col gap-1.5 sm:rounded-3xl border-0 text-card-foreground bg-transparent shadow-none sm:px-6 overflow-hidden">
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
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5">
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
                            <span
                                className={`transition-colors ${filter === key
                                    ? key === "income"
                                        ? "text-emerald-500"
                                        : key === "expense"
                                            ? "text-rose-500"
                                            : "text-primary"
                                    : ""
                                    }`}
                            >
                                {filterIcons[key] ?? null}
                            </span>
                            {/* Etiqueta visible siempre — era solo xs:block, ahora siempre visible */}
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={13}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
                    />
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

            <div className="
                overflow-x-auto
                [&::-webkit-scrollbar]:h-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-border/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-border/70
            ">
                <table className="w-full caption-bottom text-sm border-separate border-spacing-y-3">
                    {/* Cabecera — solo visible en sm+ */}
                    <thead className="hidden sm:table-header-group">
                        <tr className="text-sm bg-card">
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
                                    <p className="text-xs mt-1">
                                        Intenta con otro filtro o término de búsqueda
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};