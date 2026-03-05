/**
 * Tipo mínimo de categoría que el caso de uso de importación necesita conocer.
 * Evita acoplamiento con categoryStore del frontend.
 */
export interface Category {
    id: string;
    name: string;
    type: "income" | "expense";
}