import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmResetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmResetModal = ({ isOpen, onClose, onConfirm }: ConfirmResetModalProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) cancelRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
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
                            Borrar todos los datos
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                        Se eliminarán permanentemente:
                    </p>

                    <ul className="space-y-1.5">
                        {[
                            "Todos los escenarios y sus cashflows",
                            "Todas las categorías personalizadas",
                            "La configuración de moneda",
                            "Todo el historial guardado",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive/40 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        ref={cancelRef}
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 size={16} />
                        Sí, borrar todo
                    </button>
                </div>

            </div>
        </div>
    );
};