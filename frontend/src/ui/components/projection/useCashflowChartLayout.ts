import { useEffect, useState } from "react";

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return width;
};

const calcXAxisInterval = (selectedMonths: number, isMobile: boolean): number => {
    if (!isMobile) {
        if (selectedMonths <= 12) return 0;
        if (selectedMonths <= 24) return 2;
        return 5;
    }
    if (selectedMonths <= 6) return 0;
    if (selectedMonths <= 12) return 1;
    if (selectedMonths <= 24) return 3;
    return 11;
};

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
        xAxisInterval: calcXAxisInterval(selectedMonths, isMobile),
        barSize: calcBarSize(selectedMonths, isMobile),
        isMobile,
    };
};