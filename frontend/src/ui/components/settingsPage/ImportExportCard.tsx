import { ArrowLeftRight, FileJson, FileSpreadsheet, Upload, ChevronRight } from "lucide-react";

interface Props {
    onExportJson: () => void;
    onExportCsv: () => void;
    onImport: () => void;
}

interface ActionRowProps {
    onClick: () => void;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    sublabel: string;
}

const ActionRow = ({ onClick, icon, iconBg, iconColor, label, sublabel }: ActionRowProps) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full group flex items-center gap-3.5 px-3.5 py-3 rounded-xl border border-border/60 bg-background hover:bg-muted/40 hover:border-border transition-all duration-150 cursor-pointer"
    >
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <span className={iconColor}>{icon}</span>
        </span>
        <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">{sublabel}</p>
        </div>
        <ChevronRight
            size={14}
            className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0"
        />
    </button>
);

export const ImportExportCard = ({ onExportJson, onExportCsv, onImport }: Props) => (
    <div className="flex flex-col p-5 rounded-2xl bg-card text-card-foreground shadow-sm border border-border/40 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                    <ArrowLeftRight size={13} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Datos
                </span>
            </div>
            <span className="text-xs text-muted-foreground">
                Exportar · Importar
            </span>
        </div>

        {/* Exportar */}
        <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider px-0.5 mb-2">
                Exportar
            </p>
            <ActionRow
                onClick={onExportJson}
                icon={<FileJson size={15} />}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                label="JSON — Copia de seguridad"
                sublabel="Escenarios, ítems y configuración completa"
            />
            <ActionRow
                onClick={onExportCsv}
                icon={<FileSpreadsheet size={15} />}
                iconBg="bg-success/10"
                iconColor="text-success"
                label="CSV — Hoja de cálculo"
                sublabel="Compatible con Excel, Sheets y Numbers"
            />
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Importar */}
        <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider px-0.5 mb-2">
                Importar
            </p>
            <ActionRow
                onClick={onImport}
                icon={<Upload size={15} />}
                iconBg="bg-muted"
                iconColor="text-muted-foreground"
                label="Importar desde JSON"
                sublabel="Se añadirá sin reemplazar los datos actuales"
            />
        </div>
    </div>
);