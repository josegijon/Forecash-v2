import { useState } from "react";
import { createPortal } from "react-dom";
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

    const handleClose = () => {
        setName("");
        onClose();
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        const newId = addScenario(name);
        navigate(`/escenario/${newId}/planificacion`);
        handleClose();
    };

    if (!isOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="relative w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Layers size={18} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium leading-none tracking-tight">
                                Nuevo escenario
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Crea una versión alternativa de tu planificación
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        aria-label="Cerrar"
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Nombre del escenario
                    </label>

                    <div className="relative">
                        <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Ej: Escenario optimista, Plan B..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            autoFocus
                            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        Crear escenario
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};