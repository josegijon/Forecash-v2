import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
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
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const current = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (open) {
            const initialIndex = CURRENCIES.findIndex((c) => c.code === value);
            setFocusedIndex(initialIndex >= 0 ? initialIndex : 0);
            requestAnimationFrame(() => listRef.current?.focus());
        } else {
            setFocusedIndex(-1);
        }
    }, [open]);

    useEffect(() => {
        if (!open || focusedIndex < 0 || !listRef.current) return;
        const item = listRef.current.children[focusedIndex] as HTMLElement | undefined;
        item?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex, open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((i) => Math.min(i + 1, CURRENCIES.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (focusedIndex >= 0) {
                    onChange(CURRENCIES[focusedIndex].code);
                    setOpen(false);
                }
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                break;
            case "Tab":
                setOpen(false);
                break;
        }
    };

    return (
        <div className="flex flex-col gap-5 p-6 rounded-3xl bg-card text-card-foreground shadow-sm border border-border/40">

            {/* Header */}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Moneda
            </p>

            <div ref={containerRef} className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls="currency-listbox"
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl border border-border bg-background hover:border-primary/40 hover:bg-muted/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary leading-none w-7 text-center tabular-nums">
                            {currencySymbols[current.code]}
                        </span>
                        <span className="h-6 w-px bg-border" aria-hidden="true" />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-foreground leading-tight">
                                {current.code}
                            </p>
                            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                                {current.name}
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-muted-foreground transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Dropdown */}
                {open && (
                    <ul
                        ref={listRef}
                        id="currency-listbox"
                        role="listbox"
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        aria-activedescendant={
                            focusedIndex >= 0
                                ? `currency-option-${CURRENCIES[focusedIndex]?.code}`
                                : undefined
                        }
                        className="absolute top-full left-0 mt-2 w-full z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden focus:outline-none"
                    >
                        {CURRENCIES.map((c, index) => {
                            const isSelected = c.code === value;
                            const isFocused = index === focusedIndex;
                            return (
                                <li
                                    key={c.code}
                                    id={`currency-option-${c.code}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => { onChange(c.code); setOpen(false); }}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors duration-150 ${isFocused ? "bg-muted/60" : ""
                                        } ${isSelected && !isFocused ? "bg-primary/5" : ""}`}
                                >
                                    <span className={`text-xl font-bold leading-none w-7 text-center tabular-nums ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                                        {c.symbol}
                                    </span>
                                    <span className="h-5 w-px bg-border shrink-0" aria-hidden="true" />
                                    <div className="flex-1 text-left">
                                        <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                                            {c.code}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                                            {c.name}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <Check size={14} className="text-primary shrink-0" />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};