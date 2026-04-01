import { useEffect, useState } from "react";
import { useCurrencySymbol } from "@/store";
import { fmt } from "@/ui/utils/format";
import type { CategoryChartData } from "@/ui/utils/buildCategoryChartData";

interface CategoryBreakdownBarProps {
    data: CategoryChartData[];
    onAddItem: () => void;
}

export const CategoryBreakdownBar = ({ data, onAddItem }: CategoryBreakdownBarProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0);
    const currencySymbol = useCurrencySymbol();
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(false);
        const timeout = setTimeout(() => setAnimated(true), 30);
        return () => clearTimeout(timeout);
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="text-sm text-muted-foreground">
                    Sin gastos registrados este mes
                </span>
                <button
                    type="button"
                    onClick={onAddItem}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-colors cursor-pointer"
                >
                    Añadir gastos
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            {/* Total */}
            <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">
                    Total
                </span>
                <span className="text-sm font-medium text-foreground">
                    {currencySymbol}{fmt(total)}
                </span>
            </div>

            {/* Segmented bar */}
            <div className="h-2 w-full flex rounded-full overflow-hidden">
                {data.map((cat, i) => {
                    const pct = total > 0 ? (cat.value / total) * 100 : 0;
                    return (
                        <div
                            key={cat.name}
                            className="h-full transition-all duration-700 ease-out"
                            style={{
                                width: animated ? `${pct}%` : "0%",
                                backgroundColor: cat.fill,
                                transitionDelay: `${i * 60}ms`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};