import type { BarProps } from "recharts";
import type { MonthData } from "../../utils/projectionTypes";

const COLOR_EXPENSE_NORMAL = "hsl(var(--chart-line))";
const COLOR_EXPENSE_PEAK = "#b91c1c";

export const ExpenseBar = (props: BarProps) => {
    const { x, y, width, height, payload } = props as BarProps & { payload: MonthData };
    if (!height || Number(height) <= 0) return null;

    const fill = payload?.isPeakExpense ? COLOR_EXPENSE_PEAK : COLOR_EXPENSE_NORMAL;
    const nx = Number(x), ny = Number(y), nw = Number(width), nh = Number(height), r = 4;

    return (
        <path
            d={`M${nx},${ny + nh} L${nx},${ny + r} Q${nx},${ny} ${nx + r},${ny} L${nx + nw - r},${ny} Q${nx + nw},${ny} ${nx + nw},${ny + r} L${nx + nw},${ny + nh} Z`}
            fill={fill}
        />
    );
};

export { COLOR_EXPENSE_NORMAL, COLOR_EXPENSE_PEAK };