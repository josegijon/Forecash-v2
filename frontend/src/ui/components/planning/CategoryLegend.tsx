import { useCurrencySymbol } from "@/store";
import type { CategoryChartData } from "@/ui/utils/buildCategoryChartData";
import { fmt } from "@/ui/utils/format";

interface CategoryLegendProps {
    data: CategoryChartData[];
}

export const CategoryLegend = ({ data }: CategoryLegendProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0);
    const currencySymbol = useCurrencySymbol();

    if (data.length === 0) return null;

    const sorted = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="flex flex-col">
            {sorted.map((cat, i) => {
                const percent = total > 0 ? ((cat.value / total) * 100).toFixed(1) : "0";
                const isTop = i === 0;
                const isLast = i === sorted.length - 1;

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
                            <span className={`text-sm ${isTop ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                                {cat.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`text-sm ${isTop ? "font-semibold" : "font-medium"}`}>
                                {currencySymbol}{fmt(cat.value)}
                            </span>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                                {percent}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};