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
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={20} className="text-rose-500" />
                    <h3 className="font-bold text-rose-700">Zona Peligrosa</h3>
                </div>

                <p className="text-sm text-rose-600/80 mb-5">
                    Estas acciones son irreversibles. Úsalas con precaución.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 transition-all cursor-pointer"
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