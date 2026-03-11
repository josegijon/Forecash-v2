import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

import { usePlanningStore } from "@/store";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const MonthNavigator = () => {
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const goBack = usePlanningStore((s) => s.goBack);
    const goForward = usePlanningStore((s) => s.goForward);
    const goToToday = usePlanningStore((s) => s.goToToday);

    const now = new Date();
    const isCurrentMonth = activeMonth === now.getMonth() && activeYear === now.getFullYear();

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-card rounded-xl border border-border shadow-sm">
                <button
                    onClick={goBack}
                    className="p-2 hover:bg-muted rounded-l-xl transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 min-w-40 justify-center">
                    <Calendar size={14} className="text-primary" />
                    <span className="font-medium text-foreground text-sm">
                        {MONTHS[activeMonth]} {activeYear}
                    </span>
                </div>

                <button
                    onClick={goForward}
                    className="p-2 hover:bg-muted rounded-r-xl transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {!isCurrentMonth && (
                <button
                    onClick={goToToday}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                    Hoy
                </button>
            )}
        </div>
    );
};