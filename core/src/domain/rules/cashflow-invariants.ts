import { CashflowItem } from "@core/index";
import { RANGED_FREQUENCIES } from "@core/index";

export type InvariantViolation =
    | "AMOUNT_MUST_BE_POSITIVE"
    | "END_DATE_BEFORE_START_DATE"
    | "ONCE_CANNOT_HAVE_END_DATE"
    | "EMPTY_CATEGORY_ID"
    | "EMPTY_NAME";

/**
* Valida las invariantes de un CashflowItem.
* Devuelve un array de violaciones (vacío = válido).
* Función pura y testeable.
*/
export const validateCashflowItem = (
    item: Omit<CashflowItem, "id">
): InvariantViolation[] => {
    const violations: InvariantViolation[] = [];

    if (item.amount <= 0) {
        violations.push("AMOUNT_MUST_BE_POSITIVE");
    }

    if (!item.name.trim()) {
        violations.push("EMPTY_NAME");
    }

    if (!item.categoryId.trim()) {
        violations.push("EMPTY_CATEGORY_ID");
    }

    if (item.frequency === "once" && item.endDate !== undefined) {
        violations.push("ONCE_CANNOT_HAVE_END_DATE");
    }

    if (
        item.endDate !== undefined &&
        RANGED_FREQUENCIES.has(item.frequency) &&
        item.endDate < item.startDate
    ) {
        violations.push("END_DATE_BEFORE_START_DATE");
    }

    return violations;
};

/**
 * Lanza si hay violaciones. Útil en casos de uso donde se quiere fail-fast.
 */
export const assertCashflowItemValid = (item: Omit<CashflowItem, "id">): void => {
    const violations = validateCashflowItem(item);
    if (violations.length > 0) {
        throw new Error(
            `CashflowItem inválido: [${violations.join(", ")}]`
        );
    }
};