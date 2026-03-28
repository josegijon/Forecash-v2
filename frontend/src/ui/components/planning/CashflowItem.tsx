import { useState } from "react";
import { Trash2 } from "lucide-react";
import { fmt } from "@/ui/utils/format";
import { ConfirmDeleteItemModal } from "../modals/ConfirmDeleteCashflowItemModal";

interface CashflowItemProps {
    type: "income" | "expense";
    name: string;
    category: string;
    frequency: string;
    amount: number;
    currencySymbol: string;
    onDelete?: () => void;
}

export const CashflowItem = ({
    type,
    name,
    category,
    frequency,
    amount,
    currencySymbol,
    onDelete,
}: CashflowItemProps) => {
    const isIncome = type === "income";
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            {/* ── Desktop: fila de tabla (sm+) ── */}
            <tr className="group bg-card transition-colors hover:bg-muted/50 hidden xl:table-row">
                <td className={`p-4 rounded-l-xl border-l-3 ${isIncome ? "border-success" : "border-chart-line"
                    }`}>
                    <div className="flex items-center gap-3 font-medium text-md">
                        <span className="truncate min-w-0">{name}</span>
                    </div>
                </td>
                <td headers="col-cat" className="p-4 text-sm text-muted-foreground">{category}</td>
                <td headers="col-freq" className="p-4 text-sm text-muted-foreground whitespace-nowrap">{frequency}</td>
                <td headers="col-amount" className="p-4">
                    <span
                        className={`font-bold whitespace-nowrap ${isIncome ? "text-success" : "text-chart-line"
                            }`}
                    >
                        {currencySymbol}{fmt(amount)}
                    </span>
                </td>
                <td headers="col-action" className="p-4 rounded-r-xl text-left">
                    <button
                        onClick={() => setConfirmOpen(true)}
                        aria-label={`Eliminar ${name}`}
                        className="text-slate-300 hover:text-destructive transition-all cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>

            {/* ── Mobile: card apilada (< sm) ── */}
            <tr className="xl:hidden">
                <td className="pb-2">
                    <div className={`flex items-center justify-between gap-2 bg-card rounded-2xl px-4 py-3 hover:bg-muted/50 transition-colors border-l-3 ${isIncome ? "border-success" : "border-chart-line"
                        }`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {category} · {frequency}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-bold whitespace-nowrap ${isIncome ? "text-success" : "text-chart-line"}`}>
                                {currencySymbol}{fmt(amount)}
                            </span>
                            <div className="w-px h-4 bg-border/60 shrink-0" />
                            <button
                                onClick={() => setConfirmOpen(true)}
                                onBlur={() => setConfirmDelete(false)}
                                aria-label={confirmDelete ? `Confirmar eliminación de ${name}` : `Eliminar ${name}`}
                                className={`transition-all cursor-pointer p-1 rounded ${confirmDelete
                                    ? "text-destructive scale-110"
                                    : "text-muted-foreground/40 hover:text-destructive"
                                    }`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>

            {confirmOpen && (
                <ConfirmDeleteItemModal
                    itemName={name}
                    onConfirm={() => { onDelete?.(); setConfirmOpen(false); }}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </>
    );
};