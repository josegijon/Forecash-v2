
import { useState } from "react";
import { X, PlusCircle, MinusCircle, Tag, CalendarClock, Clock, TimerOff, Save } from "lucide-react";
import { useCategoryStore, useCurrencySymbol, type Frequency } from "@/store";

type CashflowType = "income" | "expense";

interface AddCashflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: CashflowFormData) => void;
}

export interface CashflowFormData {
    type: CashflowType;
    concept: string;
    amount: number;
    category: string;
    frequency: Frequency;
    startsInMonths: number;
    endsInMonths?: number;
}

const CATEGORIES = useCategoryStore.getState().categories.map((c) => c.name); // Obtenemos solo los nombres de las categorías para el select

const categoryList = (CATEGORIES: string[], type: CashflowType) => {
    const filteredCategories = CATEGORIES.filter((cat) => {
        const category = useCategoryStore.getState().categories.find((c) => c.name === cat);
        return category?.type === type;
    });
    return filteredCategories.length > 0 ? filteredCategories : ["Sin categorías disponibles"];
}

const frequencyLabels: Record<Frequency, string> = {
    once: "Una vez",
    daily: "Diaria",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    bimonthly: "Bimestral",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    annual: "Anual",
};

export const AddCashflowModal = ({ isOpen, onClose, onSave }: AddCashflowModalProps) => {
    const [type, setType] = useState<CashflowType>("income");
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [frequency, setFrequency] = useState<Frequency>("monthly");
    const [startsInMonths, setStartsInMonths] = useState(0);
    const [hasEndDate, setHasEndDate] = useState(false);
    const [endsInMonths, setEndsInMonths] = useState(12);

    const currencySymbol = useCurrencySymbol();

    const isIncome = type === "income";

    const resetForm = () => {
        setType("income");
        setConcept("");
        setAmount("");
        setCategory(CATEGORIES[0]);
        setFrequency("monthly");
        setStartsInMonths(0);
        setHasEndDate(false);
        setEndsInMonths(12);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = () => {
        if (!concept.trim() || !amount) return;

        onSave?.({
            type,
            concept: concept.trim(),
            amount: parseFloat(amount),
            category,
            frequency,
            startsInMonths,
            ...(hasEndDate && { endsInMonths }),
        });

        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-bold text-slate-900">Nuevo Ítem</h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-5">
                    {/* Tipo: Ingreso / Gasto */}
                    <div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType("income")}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${isIncome
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-500/20"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                    }`}
                            >
                                <PlusCircle size={16} />
                                Ingreso
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("expense")}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${!isIncome
                                    ? "bg-rose-50 text-rose-600 border-rose-200 ring-2 ring-rose-500/20"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                    }`}
                            >
                                <MinusCircle size={16} />
                                Gasto
                            </button>
                        </div>
                    </div>

                    {/* Concepto */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            Concepto
                        </label>
                        <div className="relative">
                            <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Ej: Salario, Alquiler..."
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            Cantidad
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {currencySymbol}
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            Categoría
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer appearance-none"
                        >
                            {categoryList(CATEGORIES, type).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Frecuencia */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            <CalendarClock size={12} className="inline mr-1 -mt-0.5" />
                            Frecuencia
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(frequencyLabels).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFrequency(value as Frequency)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border focus:outline-primary ${frequency === value
                                        ? "bg-primary/10 text-primary border-primary/30 ring-2 ring-primary/20"
                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inicia dentro de (meses) */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            <Clock size={12} className="inline mr-1 -mt-0.5" />
                            Inicia dentro de
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={0}
                                max={24}
                                value={startsInMonths}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setStartsInMonths(val);
                                    if (hasEndDate && endsInMonths <= val) {
                                        setEndsInMonths(val + 1);
                                    }
                                }}
                                className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                            <span className="min-w-18 text-center text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                {startsInMonths === 0 ? "Ahora" : `${startsInMonths} ${startsInMonths === 1 ? "mes" : "meses"}`}
                            </span>
                        </div>
                    </div>

                    {/* Finaliza dentro de (meses) — opcional */}
                    {frequency !== "once" && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <TimerOff size={12} className="inline mr-1 -mt-0.5" />
                                    Finaliza dentro de
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setHasEndDate(!hasEndDate)}
                                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${hasEndDate ? "bg-primary" : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hasEndDate ? "translate-x-4" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>

                            {hasEndDate && (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={startsInMonths + 1}
                                        max={120}
                                        value={endsInMonths}
                                        onChange={(e) => setEndsInMonths(Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="min-w-18 text-center text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                        {`${endsInMonths} ${endsInMonths === 1 ? "mes" : "meses"}`}
                                    </span>
                                </div>
                            )}

                            {hasEndDate && (
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                    Duración: {endsInMonths - startsInMonths} {endsInMonths - startsInMonths === 1 ? "mes" : "meses"}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!concept.trim() || !amount}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Save size={16} />
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
