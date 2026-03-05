import { Download, Upload, FileJson, FileSpreadsheet } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface Props {
    onExportJson: () => void;
    onExportCsv: () => void;
    onImport: () => void;
}

export const ImportExportCard = ({ onExportJson, onExportCsv, onImport }: Props) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
            <Download size={20} className="text-blue-500" />
            <h3 className="font-bold text-slate-900">Importar / Exportar</h3>
        </div>

        <p className="text-sm text-slate-500 mb-5">
            Exporta tus datos para respaldo o importa una configuración previa.
        </p>

        <div className="space-y-3">
            <ActionButton
                onClick={onExportJson}
                iconBg="bg-blue-50"
                iconBorder="border-blue-100"
                icon={<FileJson size={18} className="text-blue-500" />}
                label="Exportar como JSON"
                sublabel="Todos los escenarios y configuración"
                actionIcon={<Download size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
            />

            <ActionButton
                onClick={onExportCsv}
                iconBg="bg-emerald-50"
                iconBorder="border-emerald-100"
                icon={<FileSpreadsheet size={18} className="text-emerald-500" />}
                label="Exportar como CSV"
                sublabel="Compatible con hojas de cálculo"
                actionIcon={<Download size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />}
            />

            <ActionButton
                onClick={onImport}
                iconBg="bg-indigo-50"
                iconBorder="border-indigo-100"
                icon={<Upload size={18} className="text-indigo-500" />}
                label="Importar datos"
                sublabel="Arrastra o selecciona un archivo JSON"
                actionIcon={<Upload size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />}
                variant="dashed"
            />
        </div>
    </div>
);