import { ArrowDown, ArrowUp } from "lucide-react";
import type { MonthData } from "../../utils/projectionTypes";
import { fmt } from "@/ui/utils/format";
import { getAlertLevel, ALERT_BORDER } from "./rowAlert";
import { InlineBadge } from "./StatusBadge";

interface MobileCardProps {
    row: MonthData;
    currencySymbol: string;
    colSpan: number;
}

export const MobileCard = ({ row, currencySymbol, colSpan }: MobileCardProps) => {
    const cfPositive = row.cashflow > 0;
    const cfNegative = row.cashflow < 0;
    const balanceNegative = row.balance < 0;
    const alertLevel = getAlertLevel(row);
    const borderClass = alertLevel ? ALERT_BORDER[alertLevel] : "border-l-4 border-l-transparent";

    return (
        <tr>
            <td className="pb-2" colSpan={colSpan}>
                <div className={`bg-card rounded-2xl px-4 py-3 hover:bg-muted/50 transition-colors space-y-2 ${borderClass} rounded-l-none`}>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm font-semibold">
                            {row.month}
                            {alertLevel && <InlineBadge level={alertLevel} />}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ingresos</span>
                        <span className="font-medium text-success">{fmt(row.ingresos)} {currencySymbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Gastos</span>
                        <span className="font-medium text-foreground">{fmt(row.gastos)} {currencySymbol}</span>
                    </div>
                    <div className="border-t border-border/60" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Cashflow</span>
                        <span className={`inline-flex items-center gap-0.5 font-semibold ${cfPositive ? "text-success" : cfNegative ? "text-destructive" : "text-muted-foreground"
                            }`}>
                            {cfPositive && <ArrowUp size={12} />}
                            {cfNegative && <ArrowDown size={12} />}
                            {cfPositive ? "+" : ""}{fmt(row.cashflow)} {currencySymbol}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Balance</span>
                        <span className={`font-semibold ${balanceNegative ? "text-destructive" : "text-foreground"}`}>
                            {fmt(row.balance)} {currencySymbol}
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    );
};