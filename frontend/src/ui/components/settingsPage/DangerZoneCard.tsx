import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { ConfirmResetModal } from "@/ui/components/modals/ConfirmResetModal";

interface Props {
    onClearAllData: () => void;
    hasData: boolean;
}

export const DangerZoneCard = ({ onClearAllData, hasData }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section aria-label="Zona peligrosa">
            <div className="rounded-2xl border border-chart-line/20 bg-badge-danger-bg/40 p-6">
                <div className="flex items-center gap-2.5 mb-3">
                    <AlertTriangle size={20} className="text-chart-line" />
                    <h3 className="font-bold text-badge-danger-fg">Zona Peligrosa</h3>
                </div>

                <p className="text-sm text-badge-danger-fg/70 mb-5">
                    Se eliminarán <strong>todos los escenarios, ítems, categorías personalizadas y preferencias</strong>.
                    Esta acción no se puede deshacer.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        disabled={!hasData}
                        aria-haspopup="dialog"
                        className={`inline-flex items-center gap-2 text-sm font-semibold text-chart-line bg-card px-4 py-2.5 rounded-xl border border-destructive/20 transition-all ${hasData
                            ? "hover:bg-destructive/5 hover:border-destructive/40 cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                            }`}
                    >
                        <Trash2 size={16} />
                        Borrar todos los datos
                    </button>
                </div>
            </div>

            <ConfirmResetModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={onClearAllData}
            />
        </section>
    );
};