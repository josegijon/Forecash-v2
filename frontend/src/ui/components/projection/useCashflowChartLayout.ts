import { useXAxisInterval } from "@/ui/hooks/useXAxisInterval";
import { useWindowWidth } from "./useWindowWidth";

const calcBarSize = (selectedMonths: number, isMobile: boolean): number => {
    if (!isMobile) {
        return selectedMonths <= 12 ? 24 : 14;
    }
    if (selectedMonths <= 12) return 16;
    if (selectedMonths <= 24) return 8;
    return 4;
};

export interface CashflowChartLayout {
    xAxisInterval: number;
    barSize: number;
    isMobile: boolean;
}

export const useCashflowChartLayout = (selectedMonths: number): CashflowChartLayout => {
    const width = useWindowWidth();
    const isMobile = width < 640;

    return {
        xAxisInterval: useXAxisInterval(selectedMonths),
        barSize: calcBarSize(selectedMonths, isMobile),
        isMobile,
    };
};