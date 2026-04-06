import { ArrowDown, ArrowUp } from "lucide-react";
import type { MonthData } from "../../utils/projectionTypes";
import { fmt } from "@/ui/utils/format";
import { getAlertLevel, ALERT_BORDER } from "./rowAlert";
import { Badge } from "@/ui/primitives/Badge";

const CELL_BASE = "px-4 py-3 align-middle text-sm";

interface DesktopRowProps {
    row: MonthData;
    currencySymbol: string;
}

export const DesktopRow = ({ row, currencySymbol }: DesktopRowProps) => {
    const cfPositive = row.cashflow > 0;
    const cfNegative = row.cashflow < 0;
    const balanceNegative = row.balance < 0;
    const alertLevel = getAlertLevel(row);
    const borderClass = alertLevel ? ALERT_BORDER[alertLevel] : "border-l-4 border-l-transparent";

    return (
        <tr className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
            <td className={`${CELL_BASE} text-left font-medium ${borderClass}`}>
                <span className="flex items-center">
                    {row.month}
                    {alertLevel && (
                        <Badge variant={alertLevel} className="ml-2">
                            {alertLevel === "danger" ? "Negativo" : alertLevel === "warning" ? "Pico" : "Déficit"}
                        </Badge>
                    )}
                </span>
            </td>
            <td className={`${CELL_BASE} text-right text-success`}>
                {fmt(row.ingresos)} {currencySymbol}
            </td>
            <td className={`${CELL_BASE} text-right`}>
                {fmt(row.gastos)} {currencySymbol}
            </td>
            <td className={`${CELL_BASE} text-right`}>
                <span className={`inline-flex items-center justify-end gap-1 font-semibold ${cfPositive ? "text-success" : cfNegative ? "text-destructive" : "text-muted-foreground"
                    }`}>
                    {cfPositive && <ArrowUp size={14} />}
                    {cfNegative && <ArrowDown size={14} />}
                    {cfPositive ? "+" : ""}{fmt(row.cashflow)} {currencySymbol}
                </span>
            </td>
            <td className={`${CELL_BASE} text-right font-medium ${balanceNegative ? "text-destructive" : ""}`}>
                {fmt(row.balance)} {currencySymbol}
            </td>
        </tr>
    );
};