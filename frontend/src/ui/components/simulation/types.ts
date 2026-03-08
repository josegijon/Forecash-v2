export interface DataPoint {
    month: string;
    actual: number;
    comparado: number;
    diferencia: number;
}

export const fmt = (n: number) =>
    n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });