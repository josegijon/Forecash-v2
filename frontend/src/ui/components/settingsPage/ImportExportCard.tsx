import { Download, Upload, FileJson, FileSpreadsheet } from "lucide-react";
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
                <Download size={15} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium leading-none tracking-tight">
                Importar / Exportar
            </h3>
        </div>

        <p className="text-sm text-muted-foreground -mt-2">
            Exporta tus datos para respaldo o importa una configuración previa.
        </p>

        <div className="space-y-2.5">
            <ActionButton
                onClick={onExportJson}
                iconBg="bg-primary/10"
                iconBorder="border-primary/20"
                icon={<FileJson size={18} className="text-primary" />}
                label="Exportar como JSON"
                sublabel="Todos los escenarios y configuración"
                actionIcon={<Download size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
            />

            <ActionButton
                onClick={onExportCsv}
                iconBg="bg-success/10"
                iconBorder="border-success/20"
                icon={<FileSpreadsheet size={18} className="text-success" />}
                label="Exportar como CSV"
                sublabel="Compatible con hojas de cálculo"
                actionIcon={<Download size={16} className="text-muted-foreground group-hover:text-success transition-colors" />}
            />

            <ActionButton
                onClick={onImport}
                iconBg="bg-muted"
                iconBorder="border-border"
                icon={<Upload size={18} className="text-muted-foreground" />}
                label="Importar datos"
                sublabel="Arrastra o selecciona un archivo JSON"
                actionIcon={<Upload size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
                variant="dashed"
            />
        </div>
    </div>
);