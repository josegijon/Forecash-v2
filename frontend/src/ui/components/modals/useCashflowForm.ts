import { useState, useEffect, useRef } from "react";

import { useCurrencySymbol, useCategoryStore } from "@/store";
import type { Frequency } from "@core";

type CashflowType = "income" | "expense";

export interface CashflowFormData {
    type: CashflowType;
    concept: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startsInMonths: number;
    endsInMonths?: number;
}

export interface CashflowEditData extends CashflowFormData {
    id: string;
}

export interface FormErrors {
    concept?: string;
    amount?: string;
    category?: string;
}

interface UseCashflowFormProps {
    initialData?: CashflowEditData;
    onSave: (data: CashflowFormData) => void;
    onUpdate?: (data: CashflowEditData) => void;
    onClose: () => void;
}

export const useCashflowForm = ({
    initialData,
    onSave,
    onUpdate,
    onClose,
}: UseCashflowFormProps) => {
    const isEditMode = !!initialData;

    const [type, setType] = useState<CashflowType>(initialData?.type ?? "income");
    const [concept, setConcept] = useState(initialData?.concept ?? "");
    const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
    const [frequency, setFrequency] = useState<Frequency>(initialData?.frequency ?? "monthly");
    const [startsInMonths, setStartsInMonths] = useState(initialData?.startsInMonths ?? 0);
    const [hasEndDate, setHasEndDate] = useState(initialData?.endsInMonths !== undefined);
    const [endsInMonths, setEndsInMonths] = useState(initialData?.endsInMonths ?? 12);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});
    const originalFrequency = useRef<Frequency | null>(null);

    const currencySymbol = useCurrencySymbol();
    const categories = useCategoryStore((s) => s.categories);
    const filteredCategories = categories.filter((c) => c.type === type);

    const [categoryId, setCategoryId] = useState<string>(
        initialData?.categoryId ?? filteredCategories[0]?.id ?? "",
    );

    const effectiveCategoryId = filteredCategories.some((c) => c.id === categoryId)
        ? categoryId
        : (filteredCategories[0]?.id ?? "");

    // Sincronizar estado cuando initialData cambia (distintos items)
    useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setConcept(initialData.concept);
            setAmount(initialData.amount.toString());
            setFrequency(initialData.frequency);
            setHasEndDate(initialData.endsInMonths !== undefined);
            setEndsInMonths(initialData.endsInMonths ?? 12);
            setCategoryId(initialData.categoryId);
            setErrors({});
            setTouched({});
            originalFrequency.current = initialData.frequency;
        }
    }, [initialData?.id]);

    const validateField = (field: keyof FormErrors): string | undefined => {
        if (field === "concept") {
            return !concept.trim() ? "El concepto es obligatorio." : undefined;
        }
        if (field === "amount") {
            const parsed = parseFloat(amount);
            if (!amount) return "La cantidad es obligatoria.";
            if (isNaN(parsed)) return "Introduce un número válido.";
            if (parsed <= 0) return "La cantidad debe ser mayor que cero.";
            return undefined;
        }
        if (field === "category") {
            return !effectiveCategoryId ? "Selecciona una categoría." : undefined;
        }
    };

    const handleBlur = (field: keyof FormErrors) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = validateField(field);
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const clearError = (field: keyof FormErrors) => {
        if (touched[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleTypeChange = (newType: CashflowType) => {
        if (isEditMode) return;
        setType(newType);
        const firstOfNewType = categories.find((c) => c.type === newType)?.id ?? "";
        setCategoryId(firstOfNewType);
        setErrors((prev) => ({ ...prev, category: undefined }));
    };

    const handleFrequencyChange = (newFreq: Frequency) => {
        setFrequency(newFreq);
        if (newFreq === "once") setHasEndDate(false);
    };

    const handleCategorySelect = (id: string) => {
        setCategoryId(id);
        clearError("category");
    };

    const resetForm = () => {
        setType("income");
        setConcept("");
        setAmount("");
        setCategoryId(categories.find((c) => c.type === "income")?.id ?? "");
        setFrequency("monthly");
        setHasEndDate(false);
        setEndsInMonths(12);
        setErrors({});
        setTouched({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const parsed = parseFloat(amount);
    const isFormReady = concept.trim() !== "" && !isNaN(parsed) && parsed > 0;

    const handleSave = () => {
        if (!isFormReady) return;

        const formData: CashflowFormData = {
            type,
            concept: concept.trim(),
            amount: parsed,
            categoryId: effectiveCategoryId,
            frequency,
            startsInMonths,
            ...(hasEndDate && { endsInMonths }),
        };

        if (isEditMode && initialData && onUpdate) {
            onUpdate({ ...formData, id: initialData.id });
        } else {
            onSave(formData);
        }

        handleClose();
    };

    return {
        // State
        isEditMode,
        type,
        concept,
        setConcept,
        amount,
        setAmount,
        frequency,
        startsInMonths,
        setStartsInMonths,
        hasEndDate,
        setHasEndDate,
        endsInMonths,
        setEndsInMonths,
        errors,
        currencySymbol,
        filteredCategories,
        effectiveCategoryId,
        originalFrequency,
        isFormReady,
        // Handlers
        handleTypeChange,
        handleFrequencyChange,
        handleCategorySelect,
        handleBlur,
        clearError,
        handleClose,
        handleSave,
    };
};