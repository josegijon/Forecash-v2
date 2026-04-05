import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/ui/primitives/Button";

interface ConfirmDeleteScenarioModalProps {
    scenarioName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDeleteScenarioModal = ({
    scenarioName,
    onConfirm,
    onCancel,
}: ConfirmDeleteScenarioModalProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div className="relative w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 shrink-0">
                            <AlertTriangle size={20} className="text-destructive" />
                        </div>
                        <h2 className="text-lg font-medium leading-none tracking-tight">
                            Eliminar escenario
                        </h2>
                    </div>

                    <Button
                        intent="ghost"
                        size="icon"
                        onClick={onCancel}
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </Button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-foreground">
                        ¿Seguro que quieres eliminar{" "}
                        <span className="font-semibold">"{scenarioName}"</span>?
                        {" "}Se perderán todos sus ítems de cashflow y no podrás recuperarlo.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 size={16} />
                        Eliminar
                    </button>
                </div>

            </div>
        </div>
    );
};