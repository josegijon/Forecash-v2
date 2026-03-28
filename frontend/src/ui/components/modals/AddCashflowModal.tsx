import { useState, useEffect, useRef } from "react";
import { X, Save, Tag, ChevronDown, Check } from "lucide-react";

import { useCurrencySymbol, useCategoryStore } from "@/store";
import type { Frequency } from "@core";

import { EndDateSection } from "./EndDateSection";
import { TypeToggle } from "./TypeToggle";
import { FrequencySelector } from "./FrequencySelector";
import { StartInput } from "./StartSlider";

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

// Datos iniciales para modo edición — incluye id del item existente
export interface CashflowEditData extends CashflowFormData {
    id: string;
}

interface AddCashflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CashflowFormData) => void;
    onUpdate?: (data: CashflowEditData) => void;
    initialData?: CashflowEditData;
}

interface FormErrors {
    concept?: string;
    amount?: string;
    category?: string;
}

export const AddCashflowModal = ({ isOpen, onClose, onSave, onUpdate, initialData }: AddCashflowModalProps) => {
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

    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const originalFrequency = useRef<Frequency | null>(null);

    const currencySymbol = useCurrencySymbol();
    const categories = useCategoryStore((s) => s.categories);
    const filteredCategories = categories.filter((c) => c.type === type);

    const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId ?? filteredCategories[0]?.id ?? "");
    const effectiveCategoryId = filteredCategories.some((c) => c.id === categoryId)
        ? categoryId
        : (filteredCategories[0]?.id ?? "");

    const selectedCategoryName = filteredCategories.find((c) => c.id === effectiveCategoryId)?.name;

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
            originalFrequency.current = initialData.frequency; // ← añadir esta línea
        }
    }, [initialData?.id]);

    // Cierra el dropdown al hacer clic fuera
    useEffect(() => {
        if (!categoryOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setCategoryOpen(false);
                handleBlur("category");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categoryOpen]);

    const handleTypeChange = (newType: CashflowType) => {
        if (isEditMode) return; // tipo no editable en modo edición
        setType(newType);
        const firstOfNewType = categories.find((c) => c.type === newType)?.id ?? "";
        setCategoryId(firstOfNewType);
        setCategoryOpen(false);
        setErrors((prev) => ({ ...prev, category: undefined }));
    };

    const handleFrequencyChange = (newFreq: Frequency) => {
        setFrequency(newFreq);
        if (newFreq === "once") setHasEndDate(false);
    };

    const handleStartsChange = (value: number) => {
        setStartsInMonths(value);
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
        setCategoryOpen(false);
    };

    const handleClose = () => { resetForm(); onClose(); };

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

    const handleSave = () => {
        const parsed = parseFloat(amount);
        if (!concept.trim() || !amount || isNaN(parsed) || parsed <= 0) return;

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

    const clearError = (field: keyof FormErrors) => {
        if (touched[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleCategorySelect = (id: string) => {
        setCategoryId(id);
        setCategoryOpen(false);
        clearError("category");
    };

    if (!isOpen) return null;

    const parsed = parseFloat(amount);
    const isFormReady = concept.trim() !== "" && !isNaN(parsed) && parsed > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-card text-card-foreground rounded-3xl shadow-xl border border-border w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[calc(100dvh-2rem)]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
                    <h2 className="text-lg font-medium leading-none tracking-tight">
                        {isEditMode ? "Editar ítem" : "Nuevo ítem"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-xl hover:bg-muted"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-5 overflow-y-auto">

                    {/* En modo edición el tipo es de solo lectura */}
                    <TypeToggle
                        type={type}
                        onChange={handleTypeChange}
                    />

                    {/* Concepto */}
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                            Concepto
                        </label>
                        <div className="relative">
                            <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Ej: Salario, Alquiler..."
                                value={concept}
                                onChange={(e) => { setConcept(e.target.value); clearError("concept"); }}
                                onBlur={() => handleBlur("concept")}
                                className={`w-full pl-10 pr-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all ${errors.concept
                                    ? "border-destructive/70 focus:ring-destructive/20"
                                    : "border-border"
                                    }`}
                            />
                        </div>
                        {errors.concept && (
                            <p className="text-xs text-destructive mt-1.5 font-medium">{errors.concept}</p>
                        )}
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                            Cantidad
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                            </span>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); clearError("amount"); }}
                                onBlur={() => handleBlur("amount")}
                                className={`w-full pl-10 pr-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all [&::-webkit-inner-spin-button]:appearance-none ${errors.amount
                                    ? "border-destructive/70 focus:ring-destructive/20"
                                    : "border-border"
                                    }`}
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-xs text-destructive mt-1.5 font-medium">{errors.amount}</p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                            Categoría
                        </label>
                        <div ref={categoryRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setCategoryOpen((prev) => !prev)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer ${errors.category
                                    ? "border-destructive/70 focus:ring-destructive/20"
                                    : "border-border"
                                    }`}
                                aria-haspopup="listbox"
                                aria-expanded={categoryOpen}
                            >
                                <span className={selectedCategoryName ? "text-foreground" : "text-muted-foreground/50"}>
                                    {selectedCategoryName ?? "Selecciona una categoría"}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-muted-foreground transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {categoryOpen && (
                                <ul
                                    role="listbox"
                                    className="absolute z-10 mt-1.5 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1"
                                >
                                    {filteredCategories.length === 0 ? (
                                        <li className="px-4 py-2.5 text-sm text-muted-foreground">
                                            No hay categorías disponibles
                                        </li>
                                    ) : (
                                        filteredCategories.map((cat) => {
                                            const isSelected = cat.id === effectiveCategoryId;
                                            return (
                                                <li
                                                    key={cat.id}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => handleCategorySelect(cat.id)}
                                                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected
                                                        ? "text-primary font-semibold bg-primary/5"
                                                        : "text-foreground font-medium hover:bg-muted"
                                                        }`}
                                                >
                                                    {cat.name}
                                                    {isSelected && <Check size={14} className="text-primary shrink-0" />}
                                                </li>
                                            );
                                        })
                                    )}
                                </ul>
                            )}
                        </div>
                        {errors.category && (
                            <p className="text-xs text-destructive mt-1.5 font-medium">{errors.category}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <FrequencySelector
                            value={frequency}
                            onChange={handleFrequencyChange}
                        />
                        {isEditMode && originalFrequency.current && frequency !== originalFrequency.current && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                                <span>⚠</span>
                                Cambiar la frecuencia afectará a la proyección completa de este ítem.
                            </p>
                        )}
                    </div>

                    {!isEditMode && (
                        <>
                            <StartInput value={startsInMonths} onChange={handleStartsChange} />
                            {frequency !== "once" && (
                                <EndDateSection
                                    hasEndDate={hasEndDate}
                                    endsInMonths={endsInMonths}
                                    startsInMonths={startsInMonths}
                                    onToggle={setHasEndDate}
                                    onChange={setEndsInMonths}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isFormReady}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary rounded-xl shadow-sm transition-all cursor-pointer ${isFormReady
                            ? "hover:bg-primary/90"
                            : "opacity-40"
                            }`}
                    >
                        <Save size={16} />
                        {isEditMode ? "Guardar cambios" : "Guardar"}
                    </button>
                </div>

            </div>
        </div>
    );
};