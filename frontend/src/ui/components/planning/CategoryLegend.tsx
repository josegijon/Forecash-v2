import { useCurrencySymbol } from "@/store";
import type { CategoryChartData } from "./buildCategoryChartData";
import { fmt } from "../simulation/types";

interface CategoryLegendProps {
    data: CategoryChartData[];
}

export const CategoryLegend = ({ data }: CategoryLegendProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0);
    const currencySymbol = useCurrencySymbol();

    if (data.length === 0) return null;

    return (
        <div className="flex flex-col mt-4">
            {data.map((cat, i) => {
                const percent = total > 0 ? ((cat.value / total) * 100).toFixed(2) : "0";
                const isLast = i === data.length - 1;

                return (
                    <div
                        key={cat.name}
                        className={`flex items-center justify-between py-3 ${!isLast ? "border-b border-border" : ""}`}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.fill }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {cat.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {currencySymbol}{fmt(cat.value)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {percent}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};