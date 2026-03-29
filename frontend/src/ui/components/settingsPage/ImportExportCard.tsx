import { ArrowLeftRight, FileJson, FileSpreadsheet, Upload, ChevronRight } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface Props {
    onExportJson: () => void;
    onExportCsv: () => void;
    onImport: () => void;
}

export const ImportExportCard = ({ onExportJson, onExportCsv, onImport }: Props) => (
    <div className="flex flex-col gap-6 p-6 rounded-3xl border-0 bg-card text-card-foreground shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10">
                <ArrowLeftRight size={15} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium leading-none tracking-tight">
                Importar / Exportar
            </h3>
        </div>

        <p className="text-sm text-muted-foreground -mt-2">
            Exporta tus datos para respaldo o importa una configuración previa.
        </p>

        <div className="space-y-2.5">
            {/* Exportar JSON */}
            <ActionButton
                onClick={onExportJson}
                iconBg="bg-primary/10"
                iconBorder="border-primary/20"
                icon={<FileJson size={18} className="text-primary" />}
                label="Exportar como JSON"
                sublabel="Todos los escenarios y configuración"
                actionIcon={
                    <ChevronRight
                        size={16}
                        className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                    />
                }
            />

            {/* Exportar CSV */}
            <ActionButton
                onClick={onExportCsv}
                iconBg="bg-success/10"
                iconBorder="border-success/20"
                icon={<FileSpreadsheet size={18} className="text-success" />}
                label="Exportar como CSV"
                sublabel="Compatible con hojas de cálculo"
                actionIcon={
                    <ChevronRight
                        size={16}
                        className="text-muted-foreground group-hover:text-success transition-colors shrink-0"
                    />
                }
            />

            {/* Separador visual antes de importar */}
            <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-border" />
            </div>

            {/* Importar */}
            <ActionButton
                onClick={onImport}
                iconBg="bg-muted"
                iconBorder="border-border"
                icon={<Upload size={18} className="text-muted-foreground" />}
                label="Importar datos"
                sublabel="Selecciona un archivo .json guardado previamente"
                actionIcon={
                    <ChevronRight
                        size={16}
                        className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                    />
                }
            />
        </div>
    </div>
);