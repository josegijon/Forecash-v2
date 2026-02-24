import { CATEGORY_DATA } from "./CategoryDonutChart"
import { useCurrencySymbol } from "@/store"

export const CategoryLegend = () => {
    const total = CATEGORY_DATA.reduce((sum, cat) => sum + cat.value, 0)

    const currencySymbol = useCurrencySymbol();

    return (
        <div className="flex flex-col gap-3 mt-4">
            {CATEGORY_DATA.map((cat) => {
                const percent = ((cat.value / total) * 100).toFixed(1)
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
