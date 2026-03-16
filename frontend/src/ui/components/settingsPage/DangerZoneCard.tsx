import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { ConfirmResetModal } from "@/ui/components/modals/ConfirmResetModal";

interface Props {
    onClearAllData: () => void;
}

export const DangerZoneCard = ({ onClearAllData }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div className="rounded-2xl border border-destructive/20 bg-badge-danger-bg/40 p-6">
                <div className="flex items-center gap-2.5 mb-3">
                    <AlertTriangle size={20} className="text-chart-line" />
                    <h3 className="font-bold text-badge-danger-fg">Zona Peligrosa</h3>
                </div>

                <p className="text-sm text-badge-danger-fg/70 mb-5">
                    Estas acciones son irreversibles. Úsalas con precaución.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-chart-line bg-card hover:bg-destructive/5 px-4 py-2.5 rounded-xl border border-destructive/20 hover:border-destructive/40 transition-all cursor-pointer"
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
        </>
    );
};