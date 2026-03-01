import { useCurrencySymbol } from "@/store"
import { type CategoryChartData } from "./CategoryDonutChart"

interface CategoryLegendProps {
    data: CategoryChartData[]
}

export const CategoryLegend = ({ data }: CategoryLegendProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0)
    const currencySymbol = useCurrencySymbol()

    if (data.length === 0) return null

    return (
        <div className="flex flex-col gap-3 mt-4">
            {data.map((cat) => {
                const percent = total > 0 ? ((cat.value / total) * 100).toFixed(1) : "0"
                return (
                    <div key={cat.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.fill }}
                            />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                {cat.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-800">
                                {currencySymbol}{cat.value.toLocaleString("es-ES")}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 min-w-10 text-right">
                                {percent}%
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}