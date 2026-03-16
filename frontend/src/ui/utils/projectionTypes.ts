export interface MonthData {
    month: string;
    ingresos: number;
    gastos: number;
    cashflow: number;
    balance: number;
    isNegativeBalance: boolean;
    isNegativeCashflow: boolean;
    isPeakExpense: boolean;
}

export interface ProjectionAlert {
    type: "danger" | "warning" | "info";
    message: string;
}