import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

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
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 shrink-0">
                            <AlertTriangle size={20} className="text-chart-line" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium leading-none tracking-tight">
                                Eliminar escenario
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Esta acción es irreversible
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        aria-label="Cerrar"
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm text-muted-foreground mb-3">
                        ¿Seguro que quieres eliminar{" "}
                        <span className="font-semibold text-foreground">
                            "{scenarioName}"
                        </span>
                        ?
                    </p>

                    <p className="text-sm text-muted-foreground mb-5">
                        Se eliminarán también todos sus ítems de cashflow. Esta acción no se puede deshacer.
                    </p>

                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-chart-line">
                        No podrás recuperar este escenario una vez eliminado.
                    </div>
                </div>

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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 size={15} />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};