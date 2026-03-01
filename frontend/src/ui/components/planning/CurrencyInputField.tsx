import { useEffect, useRef, useState } from "react";

interface CurrencyInputFieldProps {
    label: string;
    value: number;
    currencySymbol: string;
    onChange: (value: number) => void;
    allowNegative?: boolean;
}

const formatDisplay = (num: number): string =>
    num.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

/**
 * Convierte el texto del usuario a un número válido.
 * Acepta tanto "1.234,56" (es-ES) como "1234.56" (en-US).
 */
const parseInput = (raw: string, allowNegative: boolean): number => {
    let sanitized = raw.trim();

    if (!allowNegative) {
        sanitized = sanitized.replace(/-/g, "");
    }

    // Si el usuario escribe en formato es-ES (1.234,56):
    //   - Quitar puntos de miles
    //   - Reemplazar coma decimal por punto
    if (sanitized.includes(",")) {
        sanitized = sanitized.replace(/\./g, "").replace(",", ".");
    }

    const num = parseFloat(sanitized);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

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
        <div className="bg-slate-50 p-4 rounded-xl transition-all has-focus:ring-2 has-focus:ring-primary/30 has-focus:bg-white">
            <label
                htmlFor={inputId}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block select-none"
            >
                {label}
            </label>

            <div className="flex items-center gap-2">
                <span
                    className="text-slate-400 font-medium text-2xl select-none"
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
                    className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 font-bold text-2xl w-full text-slate-900 placeholder:text-slate-300 caret-primary"
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