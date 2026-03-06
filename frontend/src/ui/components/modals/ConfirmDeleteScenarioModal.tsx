import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface Props {
    scenarioName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDeleteScenarioModal = ({ scenarioName, onConfirm, onCancel }: Props) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Focus the cancel button on mount (safe default)
    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            {/* Panel */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Cerrar"
                >
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mb-4">
                        <AlertTriangle size={22} className="text-rose-500" />
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Eliminar escenario
                    </h2>
                    <p className="text-sm text-slate-500 mb-1">
                        ¿Seguro que quieres eliminar{" "}
                        <span className="font-semibold text-slate-700">"{scenarioName}"</span>?
                    </p>
                    <p className="text-sm text-slate-400">
                        Se eliminarán también todos sus ítems de cashflow. Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                        <Trash2 size={14} />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};