import { CategoryBreakdownBar } from "./CategoryBreakdownBar";
import { CategoryLegend } from "./CategoryLegend";
import { useCategoryChartData } from "./useCategoryChartData";

interface CategoryExpensesCardProps {
    title: string;
    type: "expense" | "income";
    year: number;
    month: number;
    onAddItem: () => void;
}

export const CategoryExpensesCard = ({ title, type, year, month, onAddItem }: CategoryExpensesCardProps) => {
    const data = useCategoryChartData(type, year, month);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    {title}
                </h3>
            </div>
            <div className="flex flex-col gap-3">
                <CategoryBreakdownBar data={data} onAddItem={onAddItem} />
                <CategoryLegend data={data} />
            </div>
        </div>
    );
};