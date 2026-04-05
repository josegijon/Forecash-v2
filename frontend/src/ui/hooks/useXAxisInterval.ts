import { useWindowWidth } from "../components/projection/useWindowWidth";

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

export const useXAxisInterval = (selectedMonths: number): number => {
    const width = useWindowWidth();
    return calcXAxisInterval(selectedMonths, width < 640);
};