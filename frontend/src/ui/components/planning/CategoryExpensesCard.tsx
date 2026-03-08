import { CategoryDonutChart } from "./CategoryDonutChart";
import { CategoryLegend } from "./CategoryLegend";
import { useCategoryChartData } from "./useCategoryChartData";

interface CategoryExpensesCardProps {
    title: string;
    type: "expense" | "income";
    year: number;
    month: number;
}

export const CategoryExpensesCard = ({ title, type, year, month }: CategoryExpensesCardProps) => {
    const data = useCategoryChartData(type, year, month);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                        <span className="text-rose-500 text-sm">📊</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                </div>
            </div>

            <CategoryDonutChart data={data} />
            <CategoryLegend data={data} />
        </div>
    );
};