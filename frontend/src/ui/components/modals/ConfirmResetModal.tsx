import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmResetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmResetModal = ({ isOpen, onClose, onConfirm }: ConfirmResetModalProps) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40">
                            <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Borrar todos los datos
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Esta acción es irreversible
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Se eliminarán permanentemente:
                    </p>
                    <ul className="space-y-1.5 mb-5">
                        {[
                            "Todos los escenarios y sus cashflows",
                            "Todas las categorías personalizadas",
                            "La configuración de moneda",
                            "Todo el historial guardado",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-5">
                        La aplicación volverá al estado inicial, como si fuera la primera vez que la abres.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer"
                        >
                            <Trash2 size={15} />
                            Sí, borrar todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};