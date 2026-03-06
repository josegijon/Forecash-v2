import { useState } from "react";
import { Coins, ChevronDown, Check } from "lucide-react";
import { currencySymbols } from "@/store";
import type { Currency } from "@/store";

const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "Dólar estadounidense" },
    { code: "GBP", symbol: "£", name: "Libra esterlina" },
];

interface Props {
    value: Currency;
    onChange: (code: Currency) => void;
}

export const CurrencySelector = ({ value, onChange }: Props) => {
    const [open, setOpen] = useState(false);

    const current = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];

    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
                <Coins size={20} className="text-amber-500" />
                <h3 className="font-bold text-slate-900">Moneda</h3>
            </div>

            <p className="text-sm text-slate-500 mb-4">
                Selecciona la moneda que se usará en todas las cantidades de la aplicación.
            </p>

            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-lg font-bold text-amber-600">
                            {currencySymbols[current.code]}
                        </span>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-slate-800">{current.code}</p>
                            <p className="text-xs text-slate-500">{current.name}</p>
                        </div>
                    </div>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <div className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-lg max-h-56 overflow-y-auto">
                        {CURRENCIES.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => { onChange(c.code); setOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl ${value === c.code ? "bg-primary/5" : ""}`}
                            >
                                <span className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                    {c.symbol}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{c.code}</p>
                                    <p className="text-xs text-slate-500">{c.name}</p>
                                </div>
                                {value === c.code && <Check size={16} className="ml-auto text-primary" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};