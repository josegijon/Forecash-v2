import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

import { useScenarioStore } from "@/store";
import { Button } from "@/ui/primitives/Button";

interface AddScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddScenarioModal = ({ isOpen, onClose }: AddScenarioModalProps) => {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [touched, setTouched] = useState(false);

    const navigate = useNavigate();
    const addScenario = useScenarioStore((s) => s.addScenario);

    const handleClose = () => {
        setName("");
        setError(undefined);
        setTouched(false);
        onClose();
    };

    const validate = (value: string): string | undefined => {
        if (!value.trim()) return "El nombre no puede estar vacío.";
        return undefined;
    };

    const handleBlur = () => {
        setTouched(true);
        setError(validate(name));
    };

    const handleChange = (value: string) => {
        setName(value);
        if (touched) setError(validate(value));
    };

    const handleSubmit = () => {
        const validationError = validate(name);
        if (validationError) {
            setTouched(true);
            setError(validationError);
            return;
        }
        const newId = addScenario(name);
        navigate(`/escenario/${newId}/planificacion`);
        handleClose();
    };

    if (!isOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="relative w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div>
                        <h2 className="text-lg font-medium leading-none tracking-tight">
                            Nuevo escenario
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ponle un nombre que te ayude a identificarlo: "Si me suben el sueldo", "Plan con mudanza"...
                        </p>
                    </div>
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
                <div className="px-6 py-5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Nombre del escenario
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: Si me suben el sueldo, Plan con mudanza..."
                        value={name}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        autoFocus
                        className={`w-full px-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all ${error
                            ? "border-destructive/70 focus:ring-destructive/20"
                            : "border-border/60"
                            }`}
                    />
                    {error && (
                        <p className="text-xs text-destructive mt-1.5 font-medium">{error}</p>
                    )}
                </div>

                {/* Footer */}
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
                        className="px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Crear escenario
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};