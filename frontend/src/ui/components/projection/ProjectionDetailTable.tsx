import {
    AlertTriangle, ArrowDownRight, ArrowUpRight,
    ChevronDown, ShieldAlert, TrendingUp,
} from "lucide-react";
import type { MonthData } from "./projectionTypes";
import { fmt } from "../simulation/types";
import { useCurrencySymbol } from "@/store";

interface ProjectionDetailTableProps {
    data: MonthData[];
}

const COLS = ["Mes", "Ingresos", "Gastos", "Cashflow", "Balance", "Estado"] as const;

const colAlign = (i: number) =>
    i === 0 ? "text-left" : i === COLS.length - 1 ? "text-center" : "text-right";

const CELL_BASE = "px-4 py-3 align-middle text-sm";

const BADGE_BASE = "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full";

const StatusBadge = ({ row }: { row: MonthData }) => {
    if (row.isNegativeBalance) {
        return (
            <span className={`${BADGE_BASE} bg-badge-danger-bg text-badge-danger-fg`}>
                <ShieldAlert size={11} />
                Negativo
            </span>
        );
    }
    if (row.isPeakExpense) {
        return (
            <span className={`${BADGE_BASE} bg-badge-warning-bg text-badge-warning-fg`}>
                <AlertTriangle size={11} />
                Pico
            </span>
        );
    }
    if (row.isNegativeCashflow) {
        return (
            <span className={`${BADGE_BASE} bg-badge-neutral-bg text-badge-neutral-fg`}>
                <ChevronDown size={11} />
                Déficit
            </span>
        );
    }
    return (
        <span className={`${BADGE_BASE} bg-success/15 text-success`}>
            <TrendingUp size={11} />
            OK
        </span>
    );
};

interface RowProps {
    row: MonthData;
    currencySymbol: string;
}

const TableRow = ({ row, currencySymbol }: RowProps) => {
    const cfPositive = row.cashflow >= 0;
    const balanceNegative = row.balance < 0;

    return (
        <>
            {/* ── Desktop: fila de tabla ── */}
            <tr className="hidden sm:table-row border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                <td className={`${CELL_BASE} text-left font-medium`}>{row.month}</td>
                <td className={`${CELL_BASE} text-right text-success`}>
                    {fmt(row.ingresos)} {currencySymbol}
                </td>
                <td className={`${CELL_BASE} text-right`}>
                    {fmt(row.gastos)} {currencySymbol}
                </td>
                <td className={`${CELL_BASE} text-right`}>
                    <span className={`inline-flex items-center justify-end gap-1 font-semibold ${cfPositive ? "text-success" : "text-destructive"}`}>
                        {cfPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {cfPositive ? "+" : ""}{fmt(row.cashflow)} {currencySymbol}
                    </span>
                </td>
                <td className={`${CELL_BASE} text-right font-medium ${balanceNegative ? "text-destructive" : ""}`}>
                    {fmt(row.balance)} {currencySymbol}
                </td>
                <td className={`${CELL_BASE} text-center`}>
                    <StatusBadge row={row} />
                </td>
            </tr>

            {/* ── Mobile: card apilada ── */}
            <tr className="sm:hidden">
                <td className="pb-2" colSpan={COLS.length}>
                    <div className="bg-card rounded-2xl px-4 py-3 hover:bg-muted/50 transition-colors space-y-2">

                        {/* Mes + badge */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{row.month}</span>
                            <StatusBadge row={row} />
                        </div>

                        {/* Ingresos / Gastos */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Ingresos</span>
                            <span className="font-medium text-success">
                                {fmt(row.ingresos)} {currencySymbol}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Gastos</span>
                            <span className="font-medium text-foreground">
                                {fmt(row.gastos)} {currencySymbol}
                            </span>
                        </div>

                        <div className="border-t border-border/60" />

                        {/* Cashflow / Balance */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Cashflow</span>
                            <span className={`inline-flex items-center gap-0.5 font-semibold ${cfPositive ? "text-success" : "text-destructive"}`}>
                                {cfPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
        </>
    );
};

export const ProjectionDetailTable = ({ data }: ProjectionDetailTableProps) => {
    const currencySymbol = useCurrencySymbol();

    if (data.length === 0) {
        return (
            <div className="rounded-3xl bg-card text-card-foreground shadow-sm p-6 text-center text-sm">
                No hay datos de proyección disponibles.
            </div>
        );
    }

    return (
        <div className="rounded-3xl bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="flex flex-col space-y-1 p-4 sm:p-6 pb-0">
                <h3 className="font-medium tracking-tight text-base sm:text-lg">
                    Detalles mensuales
                </h3>
            </div>

            <div className="p-0 sm:p-6 pt-4">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                        <table className="w-full caption-bottom text-sm">

                            {/* Cabecera — solo visible en desktop */}
                            <thead className="hidden sm:table-header-group">
                                <tr className="border-b border-border">
                                    {COLS.map((col, i) => (
                                        <th
                                            key={col}
                                            className={`h-12 px-4 align-middle font-medium text-muted-foreground text-sm ${colAlign(i)}`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((row) => (
                                    <TableRow
                                        key={row.month}
                                        row={row}
                                        currencySymbol={currencySymbol}
                                    />
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};