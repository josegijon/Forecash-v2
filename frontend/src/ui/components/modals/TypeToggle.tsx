import { PlusCircle, MinusCircle } from "lucide-react";

type CashflowType = "income" | "expense";

interface TypeToggleProps {
    type: CashflowType;
    onChange: (type: CashflowType) => void;
}

export const TypeToggle = ({ type, onChange }: TypeToggleProps) => (
    <div className="grid grid-cols-2 gap-3">
        {(["income", "expense"] as CashflowType[]).map((t) => {
            const isActive = type === t;
            const isIncome = t === "income";

            return (
                <button
                    key={t}
                    type="button"
                    onClick={() => onChange(t)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${isActive
                            ? isIncome
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-500/20"
                                : "bg-rose-50 text-rose-600 border-rose-200 ring-2 ring-rose-500/20"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                >
                    {isIncome ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
                    {isIncome ? "Ingreso" : "Gasto"}
                </button>
            );
        })}
    </div>
);