// Colores en hex para uso en atributos SVG nativos (fill, stroke, stopColor).
// hsl(var(--x)) no se resuelve en SVG en Safari — usar hex resueltos.

export const COLOR_POSITIVE = "#15803d"; // hsl(142 76.1% 36.1%) — --primary
export const COLOR_NEGATIVE = "#f43f5e"; // hsl(354 100% 65%)    — --chart-line
export const COLOR_CUSHION = "#f59e0b"; // amber-500
export const COLOR_CUSHION_LOST = "#f97316"; // orange-500
export const COLOR_CARD_STROKE = "hsl(var(--card))"; // solo para stroke en elementos no-SVG puros