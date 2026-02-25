import { CashflowItem } from "@core/index";

interface isActiveMonthProps {
    item: CashflowItem;
    year: number;
    month: number;
}

export const isActiveMonth = ({ item, year, month }: isActiveMonthProps): boolean => {
    const itemStart = new Date(item.startDate);
    const itemEnd = item.endDate ? new Date(item.endDate) : null;

    const itemStartYear = itemStart.getFullYear();
    const itemStartMonth = itemStart.getMonth();

    if (itemStartYear > year || (itemStartYear === year && itemStartMonth > month)) return false;

    if (itemEnd) {
        const itemEndYear = itemEnd.getFullYear();
        const itemEndMonth = itemEnd.getMonth();
        if (itemEndYear < year || (itemEndYear === year && itemEndMonth < month)) return false;
    }

    switch (item.frequency) {
        case "once":
            return itemStartYear === year && itemStartMonth === month;
        case "monthly":
            return true;
        case "bimonthly":
            return (itemStartMonth % 2) === (month % 2);
        case "quarterly":
            return (itemStartMonth % 3) === (month % 3);
        case "semiannual":
            return (itemStartMonth % 6) === (month % 6);
        case "annual":
            return itemStartMonth === month;
        default:
            return false;
    }
}