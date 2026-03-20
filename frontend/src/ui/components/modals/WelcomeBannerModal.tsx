import { Shield, HardDrive, MapPin, X } from "lucide-react";

interface WelcomeBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INFO_ITEMS = [
    {
        icon: MapPin,
        title: "Empieza por Planificación",
        description:
            "Añade tus ingresos y gastos recurrentes. A partir de ahí podrás proyectar el futuro y simular cambios.",
    },
    {
        icon: HardDrive,
        title: "Tus datos viven en este navegador",
        description:
            "Nada sale de tu dispositivo. Si limpias el caché o cambias de navegador, los datos desaparecen. Expórtalos en JSON desde Datos y Ajustes.",
    },
    {
        icon: Shield,
        title: "Sin cuenta, sin servidor, sin tracking",
        description:
            "La app funciona completamente offline. Nadie tiene acceso a tu información financiera.",
    },
];

export const WelcomeBannerModal = ({ isOpen, onClose }: WelcomeBannerModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div aria-hidden="true" className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative bg-card text-card-foreground rounded-3xl shadow-xl border border-border w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            Bienvenido
                        </span>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">
                            Cómo funciona Forecash
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-xl hover:bg-muted mt-0.5"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-5 space-y-4">
                    {INFO_ITEMS.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex gap-4 items-start">
                            <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon size={16} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground leading-snug">
                                    {title}
                                </span>
                                <span className="text-xs text-muted-foreground leading-relaxed">
                                    {description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                        Entendido, empezar
                    </button>
                </div>

            </div>
        </div>
    );
};