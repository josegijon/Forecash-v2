import { useState } from "react";
import { X, Save, Tag } from "lucide-react";

import { useCurrencySymbol, useCategoryStore } from "@/store";
import type { Frequency } from "@core";

import { EndDateSection } from "./EndDateSection";
import { TypeToggle } from "./TypeToggle";
import { FrequencySelector } from "./FrequencySelector";
import { StartSlider } from "./StartSlider";

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

interface AddCashflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CashflowFormData) => void;
}

export const AddCashflowModal = ({ isOpen, onClose, onSave }: AddCashflowModalProps) => {
    const [type, setType] = useState<CashflowType>("income");
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("monthly");
    const [startsInMonths, setStartsInMonths] = useState(0);
    const [hasEndDate, setHasEndDate] = useState(false);
    const [endsInMonths, setEndsInMonths] = useState(12);

    const currencySymbol = useCurrencySymbol();
    const categories = useCategoryStore((s) => s.categories);
    const filteredCategories = categories.filter((c) => c.type === type);
    const [categoryId, setCategoryId] = useState<string>(filteredCategories[0]?.id);

    const handleTypeChange = (newType: CashflowType) => {
        setType(newType);
        setCategoryId(categories.find((c) => c.type === newType)?.id ?? "");
    };

    const resetForm = () => {
        setType("income");
        setConcept("");
        setAmount("");
        setCategoryId(categories.find((c) => c.type === "income")?.id ?? "");
        setFrequency("monthly");
        setStartsInMonths(0);
        setHasEndDate(false);
        setEndsInMonths(12);
    };

    const handleClose = () => { resetForm(); onClose(); };

    const handleSave = () => {
        if (!concept.trim() || !amount) return;

        onSave({
            type,
            concept: concept.trim(),
            amount: parseFloat(amount),
            categoryId,
            frequency,
            startsInMonths,
            ...(hasEndDate && { endsInMonths }),
        });

        handleClose();
    };

    const handleStartsChange = (val: number) => {
        setStartsInMonths(val);
        if (hasEndDate && endsInMonths <= val) setEndsInMonths(val + 1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-card text-card-foreground rounded-3xl shadow-xl border border-border w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-medium leading-none tracking-tight">Nuevo Ítem</h2>
                    <button
                        onClick={handleClose}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-xl hover:bg-muted"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-5">

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
                                onChange={(e) => setConcept(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-muted/40 rounded-xl border border-border/60 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>
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
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-muted/40 rounded-xl border border-border/60 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                            Categoría
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-muted/40 rounded-xl border border-border/60 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer appearance-none"
                        >
                            {filteredCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FrequencySelector
                        value={frequency}
                        onChange={setFrequency}
                    />

                    <StartSlider
                        value={startsInMonths}
                        onChange={handleStartsChange}
                    />

                    {frequency !== "once" && (
                        <EndDateSection
                            hasEndDate={hasEndDate}
                            endsInMonths={endsInMonths}
                            startsInMonths={startsInMonths}
                            onToggle={setHasEndDate}
                            onChange={setEndsInMonths}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!concept.trim() || !amount}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
};