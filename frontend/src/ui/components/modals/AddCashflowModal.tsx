import { useState } from "react";
import { X, Save, Tag } from "lucide-react";

import { EndDateSection } from "./EndDateSection";
import { TypeToggle } from "./TypeToggle";
import { FrequencySelector } from "./FrequencySelector";
import { StartInput } from "./StartSlider";
import { CategorySelect } from "./CategorySelect";
import { useCashflowForm } from "../../hooks/useCashflowForm";
import { Button } from "@/ui/primitives/Button";


interface AddCashflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: import("../../hooks/useCashflowForm").CashflowFormData) => void;
    onUpdate?: (data: import("../../hooks/useCashflowForm").CashflowEditData) => void;
    initialData?: import("../../hooks/useCashflowForm").CashflowEditData;
}

export const AddCashflowModal = ({
    isOpen,
    onClose,
    onSave,
    onUpdate,
    initialData,
}: AddCashflowModalProps) => {
    const [categoryOpen, setCategoryOpen] = useState(false);

    const {
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
        handleTypeChange,
        handleFrequencyChange,
        handleCategorySelect,
        handleBlur,
        clearError,
        handleClose,
        handleSave,
    } = useCashflowForm({ initialData, onSave, onUpdate, onClose });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-card text-card-foreground rounded-3xl shadow-xl border border-border w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[calc(100dvh-2rem)]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
                    <h2 className="text-lg font-medium leading-none tracking-tight">
                        {isEditMode ? "Editar ítem" : "Nuevo ítem"}
                    </h2>
                    <Button
                        intent="ghost"
                        size="icon"
                        onClick={handleClose}
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </Button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-5 overflow-y-auto">

                    <TypeToggle type={type} onChange={handleTypeChange} />

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
                    <CategorySelect
                        categories={filteredCategories}
                        selectedId={effectiveCategoryId}
                        error={errors.category}
                        onSelect={handleCategorySelect}
                        onBlur={() => handleBlur("category")}
                        open={categoryOpen}
                        onOpenChange={setCategoryOpen}
                    />

                    <div className="flex flex-col gap-2">
                        <FrequencySelector value={frequency} onChange={handleFrequencyChange} />
                        {isEditMode && originalFrequency.current && frequency !== originalFrequency.current && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                                <span>⚠</span>
                                Cambiar la frecuencia afectará a la proyección completa de este ítem.
                            </p>
                        )}
                    </div>

                    {!isEditMode && (
                        <>
                            <StartInput value={startsInMonths} onChange={setStartsInMonths} />
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
                    <Button
                        intent="secondary"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormReady}
                    >
                        <Save size={16} />
                        {isEditMode ? "Guardar cambios" : "Guardar"}
                    </Button>
                </div>

            </div>
        </div>
    );
};