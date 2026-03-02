
// Convierte el texto del usuario a un número válido.
export const formatDisplay = (num: number): string =>
    num.toLocaleString(
        "es-ES",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );

// Convierte el texto del usuario a un número válido.
export const parseInput = (raw: string, allowNegative: boolean): number => {
    let sanitized = raw.trim();

    if (!allowNegative) {
        sanitized = sanitized.replace(/-/g, "");
    }

    // Si el usuario escribe en formato es-ES (1.234,56):
    //   - Quitar puntos de miles
    //   - Reemplazar coma decimal por punto
    if (sanitized.includes(",")) {
        sanitized = sanitized.replace(/\./g, "").replace(",", ".");
    }

    const num = parseFloat(sanitized);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};