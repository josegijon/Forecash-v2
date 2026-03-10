import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { fmt } from "../simulation/types";

interface CashflowItemProps {
    type: "income" | "expense";
    name: string;
    category: string;
    frequency: string;
    amount: number;
    currencySymbol: string;
    onDelete?: () => void;
}

export const CashflowItem = ({ type, name, category, frequency, amount, currencySymbol, onDelete }: CashflowItemProps) => {
    const isIncome = type === "income";

    return (
        <>
            {/* ── Desktop: fila de tabla (se oculta en móvil) ── */}
            <tr className="group bg-card transition-colors hover:bg-muted/50 hidden sm:table-row">
                <td className="p-4 rounded-l-3xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isIncome
                            ? "bg-success text-success-foreground"
                            : "bg-chart-line text-chart-fill"}`}
                        >
                            {isIncome ? <PlusCircle size={18} /> : <MinusCircle size={18} />}
                        </div>
                        <span className="truncate max-w-35">{name}</span>
                    </div>
                </td>
                <td className="p-4">{category}</td>
                <td className="p-4">{frequency}</td>
                <td className="p-4">
                    <span className={`font-bold ${isIncome ? "text-success" : "text-chart-line"}`}>
                        {currencySymbol}{fmt(amount)}
                    </span>
                </td>
                <td className="p-4 rounded-r-3xl text-left">
                    <button
                        onClick={onDelete}
                        className="text-slate-300 hover:text-destructive transition-all cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>

            {/* ── Mobile: card apilada (se oculta en desktop) ── */}
            <tr className="sm:hidden">
                <td className="pb-2">
                    <div className="flex items-center justify-between gap-3 bg-card rounded-2xl px-4 py-3 hover:bg-muted/50 transition-colors">
                        {/* Icono + nombre + meta */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isIncome
                                ? "bg-success text-success-foreground"
                                : "bg-chart-line text-chart-fill"}`}
                            >
                                {isIncome ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{name}</p>
                                <p className="text-xs text-muted-foreground truncate">{category} · {frequency}</p>
                            </div>
                        </div>

                        {/* Importe + eliminar */}
                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-bold ${isIncome ? "text-success" : "text-chart-line"}`}>
                                {currencySymbol}{fmt(amount)}
                            </span>
                            <button
                                onClick={onDelete}
                                className="text-slate-300 hover:text-destructive transition-all cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
};