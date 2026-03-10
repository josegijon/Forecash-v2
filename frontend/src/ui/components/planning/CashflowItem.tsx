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
            <tr className="group bg-card transition-colors hover:bg-muted/50">
                <td className="p-4 rounded-l-3xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome
                            ? "bg-success text-success-foreground"
                            : "bg-chart-line text-chart-fill"}`}
                        >
                            {isIncome
                                ? <PlusCircle size={18} />
                                : <MinusCircle size={18} />
                            }
                        </div>
                        <span>
                            {name}
                        </span>
                    </div>
                </td>

                <td className="p-4">
                    {category}
                </td>

                <td className="p-4">
                    {frequency}
                </td>

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
        </>
    );
};