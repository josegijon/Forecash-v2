import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"

interface CashflowItemProps {
    type: "income" | "expense";
    name: string;
    category: string;
    frequency: string;
    amount: number;
    // onDelete?: () => void;
}

export const CashflowItem = ({ type, name, category, frequency, amount }: CashflowItemProps) => {
    const isIncome = type === 'income';

    return (
        <div className="group flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'}`}
                >
                    {isIncome
                        ? <PlusCircle size={18} />
                        : <MinusCircle size={18} />
                    }
                </div>

                <div>
                    <p className="font-semibold text-slate-800">{name}</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        {category} • {frequency}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-6 w-full md:w-auto">
                <span className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                    ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <button
                    // onClick={onDelete}
                    className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}
