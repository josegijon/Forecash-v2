import { useState } from "react";
import type { MonthData } from "../../utils/projectionTypes";
import { useCurrencySymbol } from "@/store";
import { DesktopRow } from "./DesktopRow";
import { MobileCard } from "./MobileCard";
import { hasAlert } from "./rowAlert";

interface ProjectionDetailTableProps {
    data: MonthData[];
}

const COLS = ["Mes", "Ingresos", "Gastos", "Cashflow", "Balance"] as const;

const colAlign = (i: number) => i === 0 ? "text-left" : "text-right";

const MOBILE_FALLBACK = 6;

export const ProjectionDetailTable = ({ data }: ProjectionDetailTableProps) => {
    const currencySymbol = useCurrencySymbol();
    const [showAll, setShowAll] = useState(false);

    const tableData = data.slice(1);
    const hasActivity = tableData.some((row) => row.ingresos > 0 || row.gastos > 0);

    if (!hasActivity) {
        return (
            <div className="rounded-3xl bg-card border border-border text-card-foreground shadow-sm p-6 text-center text-sm">
                No hay datos de proyección disponibles.
            </div>
        );
    }

    const alertMonths = tableData.filter(hasAlert);
    const hasAlerts = alertMonths.length > 0;
    const needsCollapse = tableData.length > MOBILE_FALLBACK;

    const defaultMobileData = hasAlerts ? alertMonths : tableData.slice(0, MOBILE_FALLBACK);
    const mobileData = showAll ? tableData : defaultMobileData;

    return (
        <div className="rounded-3xl bg-card border border-border text-card-foreground shadow-sm overflow-hidden">
            <div className="flex flex-col space-y-1 p-4 sm:p-6 pb-0">
                <h3 className="font-medium tracking-tight text-base sm:text-lg">
                    Detalles mensuales
                </h3>
                <p className="text-xs text-muted-foreground">
                    Ingresos menos gastos cada mes
                </p>
            </div>

            <div className="p-0 sm:p-6 pt-4">

                {/* ── Desktop ── */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
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
                            {tableData.map((row) => (
                                <DesktopRow key={row.month} row={row} currencySymbol={currencySymbol} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile ── */}
                <div className="sm:hidden">
                    <table className="w-full">
                        <tbody>
                            {mobileData.map((row) => (
                                <MobileCard
                                    key={row.month}
                                    row={row}
                                    currencySymbol={currencySymbol}
                                    colSpan={COLS.length}
                                />
                            ))}
                        </tbody>
                    </table>

                    {needsCollapse && (
                        <div className="pt-2 pb-4 px-4">
                            <button
                                onClick={() => setShowAll((prev) => !prev)}
                                className="w-full py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border/60 rounded-xl transition-colors cursor-pointer"
                            >
                                {showAll
                                    ? "Ver menos"
                                    : `Ver todos los meses (${tableData.length})`
                                }
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};