import { useEffect, useRef, useState } from "react";

import { formatDisplay, parseInput } from "@/ui/utils/currencyInputFormat";

interface CurrencyInputAction {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

interface CurrencyInputFieldProps {
    label: string;
    sublabel?: string;
    value: number;
    currencySymbol: string;
    onChange: (value: number) => void;
    allowNegative?: boolean;
    action?: CurrencyInputAction;
}

export const CurrencyInputField = ({
    label,
    sublabel,
    value,
    currencySymbol,
    onChange,
    allowNegative = false,
    action,
}: CurrencyInputFieldProps) => {
    const [displayValue, setDisplayValue] = useState(formatDisplay(value));
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useRef(`currency-${label.replace(/\s+/g, "-").toLowerCase()}`).current;

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatDisplay(value));
        }
    }, [value, isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
        const clean = value === 0 ? "" : value.toString().replace(".", ",");
        setDisplayValue(clean);
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
        <div className="flex flex-col gap-2 bg-card/40 p-4 rounded-xl border border-border/60 transition-all has-focus:ring-2 has-focus:ring-primary/30 has-focus:bg-card has-focus:border-primary">
            <label
                htmlFor={inputId}
                className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block select-none"
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
                    className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 font-bold text-2xl w-full text-foreground placeholder:text-muted-foreground/40 caret-primary"
                    placeholder="0,00"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                {action && (
                    <button
                        type="button"
                        onClick={action.onClick}
                        aria-label={action.label}
                        className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-colors cursor-pointer"
                    >
                        {action.icon}
                    </button>
                )}
            </div>

            {sublabel && (
                <p className="text-xs text-muted-foreground">
                    {sublabel}
                </p>
            )}
        </div>
    );
};