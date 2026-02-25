import { CashflowItem } from "@core/index";

interface isActiveMonthProps {
    item: CashflowItem;
    year: number;
    month: number;
}

export const isActiveMonth = ({ item, year, month }: isActiveMonthProps): boolean => {
    const itemStart = new Date(item.startDate);
    const itemEnd = item.endDate ? new Date(item.endDate) : null;
    const targetDate = new Date(year, month, 1);
    const itemMonth = itemStart.getMonth();

    if (itemStart > targetDate) return false;
    if (itemEnd && itemEnd < targetDate) return false;

    switch (item.frequency) {
        case "once":
            return itemStart.getFullYear() === year && itemMonth === month;
        case "monthly":
            return true;
        case "bimonthly":
            return (itemMonth % 2) === (month % 2);
        case "quarterly":
            return (itemMonth % 3) === (month % 3);
        case "semiannual":
            return (itemMonth % 6) === (month % 6);
        case "annual":
            return itemMonth === month;
        default:
            return false;
    }
}