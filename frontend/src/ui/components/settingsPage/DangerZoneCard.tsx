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
            <div className="rounded-2xl border border-destructive/20 bg-badge-danger-bg/30 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-destructive/15">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-badge-danger-fg" />
                        <span className="text-xs font-bold text-badge-danger-fg uppercase tracking-widest">
                            Zona peligrosa
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <p className="text-sm text-badge-danger-fg/70 leading-relaxed">
                        Elimina todos los escenarios, ítems, categorías y preferencias.{" "}
                        <span className="font-semibold text-badge-danger-fg/90">Esta acción no se puede deshacer.</span>
                    </p>

                    <button
                        onClick={() => setModalOpen(true)}
                        disabled={!hasData}
                        aria-haspopup="dialog"
                        className={`inline-flex items-center gap-2 text-sm font-semibold text-badge-danger-fg bg-badge-danger-bg px-4 py-2 rounded-xl border border-destructive/25 whitespace-nowrap shrink-0 transition-all ${hasData
                            ? "hover:bg-destructive/15 hover:border-destructive/40 cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                            }`}
                    >
                        <Trash2 size={14} />
                        Borrar todo
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