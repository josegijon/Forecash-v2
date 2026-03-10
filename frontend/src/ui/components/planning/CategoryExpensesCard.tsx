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
        <div className="rounded-3xl border-0 text-card-foreground bg-transparent shadow-none p-0">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    {title}
                </h3>
            </div>

            <CategoryDonutChart data={data} />
            <CategoryLegend data={data} />
        </div>
    );
};