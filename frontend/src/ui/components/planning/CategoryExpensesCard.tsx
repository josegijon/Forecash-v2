import { CategoryDonutChart } from "./CategoryDonutChart";
import { CategoryLegend } from "./CategoryLegend";

interface CategoryExpensesCardProps {
    title: string;
}

export const CategoryExpensesCard = ({ title }: CategoryExpensesCardProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                        <span className="text-rose-500 text-sm">📊</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                </div>
            </div>

            <CategoryDonutChart />
            <CategoryLegend />
        </div>
    )
}
