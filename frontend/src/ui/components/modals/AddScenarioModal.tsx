import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

import { useScenarioStore } from "@/store";
import { Button } from "@/ui/primitives/Button";
import { Input } from "@/ui/primitives/Input";

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
                    <Input
                        type="text"
                        placeholder="Ej: Si me suben el sueldo, Plan con mudanza..."
                        value={name}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        autoFocus
                        error={!!error}
                    />
                    {error && (
                        <p className="text-xs text-destructive mt-1.5 font-medium">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
                    <Button
                        intent="secondary"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                    >
                        Crear escenario
                    </Button>
                </div>

            </div>
        </div>,
        document.body
    );
};