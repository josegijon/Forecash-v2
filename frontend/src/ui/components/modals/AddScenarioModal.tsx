import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Layers, Save } from "lucide-react";

import { useScenarioStore } from "@/store";

interface AddScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddScenarioModal = ({ isOpen, onClose }: AddScenarioModalProps) => {
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const addScenario = useScenarioStore((s) => s.addScenario);

    const resetForm = () => {
        setName("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (name: string) => {
        if (!name.trim()) return;

        const newId = addScenario(name);
        navigate(`/escenario/${newId}/planificacion`);
        onClose();
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
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layers size={16} className="text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Nuevo Escenario</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-5">
                    {/* Nombre */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            Nombre del escenario
                        </label>
                        <div className="relative">
                            <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Ej: Escenario optimista, Plan B..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit(name)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
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
                        onClick={() => handleSubmit(name)}
                        disabled={!name.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Save size={16} />
                        Crear Escenario
                    </button>
                </div>
            </div>
        </div>
    );
};