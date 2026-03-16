import { useState } from "react";
import { ChevronDown, Check, Coins } from "lucide-react";
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
        <div className="flex flex-col gap-6 p-6 rounded-3xl border-0 bg-card text-card-foreground shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10">
                    <Coins size={15} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Moneda
                </h3>
            </div>

            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex h-12 items-center justify-between w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors focus:outline-none"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                            {currencySymbols[current.code]}
                        </span>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">{current.code}</p>
                            <p className="text-xs text-muted-foreground">{current.name}</p>
                        </div>
                    </div>
                    <ChevronDown size={18} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-full z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                            {CURRENCIES.map((c) => (
                                <button
                                    key={c.code}
                                    onClick={() => { onChange(c.code); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors cursor-pointer ${value === c.code ? "bg-primary/5" : ""}`}
                                >
                                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                                        {c.symbol}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{c.code}</p>
                                        <p className="text-xs text-muted-foreground">{c.name}</p>
                                    </div>
                                    {value === c.code && <Check size={16} className="ml-auto text-primary" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};