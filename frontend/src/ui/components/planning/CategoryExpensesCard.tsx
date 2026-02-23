import { CategoryDonutChart } from "./CategoryDonutChart";
import { CategoryLegend } from "./CategoryLegend";

interface CategoryExpensesCardProps {
    title: string;
}

export const CategoryExpensesCard = ({ title }: CategoryExpensesCardProps) => {
    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold">{title}</h3>
                </div>
            </div>

            <CategoryDonutChart />
            <CategoryLegend />
        </div>
    )
}
