import { PlusCircle, Sparkles } from "lucide-react";

interface EmptyPlanningBannerProps {
    onAddItem: () => void;
}

export const EmptyPlanningBanner = ({ onAddItem }: EmptyPlanningBannerProps) => {
    return (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 flex flex-col items-center text-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles size={22} className="text-primary" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">
                    Empieza definiendo tus ingresos y gastos
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    En cuanto añadas tus primeros ítems, verás tu cashflow proyectado mes a mes.
                </p>
            </div>

            <button
                onClick={onAddItem}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all cursor-pointer"
            >
                <PlusCircle size={16} />
                Añadir primer ítem
            </button>

        </div>
    );
};