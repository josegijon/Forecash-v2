import { useEffect, useRef, useState } from "react";
import { useCurrencySymbol } from "@/store";
import type { CategoryChartData } from "./buildCategoryChartData";
import { fmt } from "../simulation/types";

interface CategoryDonutChartProps {
    data: CategoryChartData[];
}

export const CategoryDonutChart = ({ data }: CategoryDonutChartProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0);
    const currencySymbol = useCurrencySymbol();
    const [animated, setAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAnimated(false);
        const timeout = setTimeout(() => setAnimated(true), 30);
        return () => clearTimeout(timeout);
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-14 text-sm text-slate-400">
                No hay datos para este mes
            </div>
        );
    }

    return (
        <div ref={ref} className="w-full">
            {/* Total */}
            <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                    Total
                </span>
                <span className="text-sm font-medium text-foreground">
                    {currencySymbol}{fmt(total)}
                </span>
            </div>

            {/* Segmented bar */}
            <div className="h-2 w-full flex rounded-full overflow-hidden mb-6">
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