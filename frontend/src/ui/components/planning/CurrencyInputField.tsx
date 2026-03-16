import { useEffect, useRef, useState } from "react";

import { formatDisplay, parseInput } from "@/ui/utils/currencyInputFormat";

interface CurrencyInputFieldProps {
    label: string;
    value: number;
    currencySymbol: string;
    onChange: (value: number) => void;
    allowNegative?: boolean;
}

export const CurrencyInputField = ({
    label,
    value,
    currencySymbol,
    onChange,
    allowNegative = false,
}: CurrencyInputFieldProps) => {
    const [displayValue, setDisplayValue] = useState(formatDisplay(value));
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useRef(`currency-${label.replace(/\s+/g, "-").toLowerCase()}`).current;

    // Sincronizar si el valor externo cambia mientras NO estamos editando
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatDisplay(value));
        }
    }, [value, isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
        // Mostrar el número "limpio" para facilitar edición
        const clean = value === 0 ? "" : value.toString().replace(".", ",");
        setDisplayValue(clean);

        // Seleccionar todo el texto tras un tick
        requestAnimationFrame(() => inputRef.current?.select());
    };

    const handleBlur = () => {
        setIsFocused(false);
        const parsed = parseInput(displayValue, allowNegative);
        const clamped = !allowNegative && parsed < 0 ? 0 : parsed;
        onChange(clamped);
        setDisplayValue(formatDisplay(clamped));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Permitir solo dígitos, coma, punto, y opcionalmente el signo negativo
        const regex = allowNegative ? /^-?[\d.,]*$/ : /^[\d.,]*$/;
        if (raw === "" || regex.test(raw)) {
            setDisplayValue(raw);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            inputRef.current?.blur();
        }
    };

    return (
        <div className="bg-card/40 p-4 rounded-xl border border-border/60 transition-all has-focus:ring-2 has-focus:ring-primary/20 has-focus:bg-card has-focus:border-primary/40">
            <label
                htmlFor={inputId}
                className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block select-none"
            >
                {label}
            </label>

            <div className="flex items-center gap-2">
                <span
                    className="text-muted-foreground font-medium text-2xl select-none"
                    aria-hidden="true"
                >
                    {currencySymbol}
                </span>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    inputMode="decimal"
                    aria-label={`${label} en ${currencySymbol}`}
                    className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 font-bold text-2xl w-full text-foreground placeholder:text-muted-foreground/40 caret-primary"
                    placeholder="0,00"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};