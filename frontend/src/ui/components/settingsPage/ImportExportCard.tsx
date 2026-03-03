import { Download, Upload, FileJson, FileSpreadsheet } from "lucide-react";

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
            <button
                onClick={onExportJson}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
            >
                <span className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <FileJson size={18} className="text-blue-500" />
                </span>
                <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-slate-800">Exportar como JSON</p>
                    <p className="text-xs text-slate-500">Todos los escenarios y configuración</p>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
                onClick={onExportCsv}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
            >
                <span className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <FileSpreadsheet size={18} className="text-emerald-500" />
                </span>
                <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-slate-800">Exportar como CSV</p>
                    <p className="text-xs text-slate-500">Compatible con hojas de cálculo</p>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
                onClick={onImport}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
            >
                <span className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Upload size={18} className="text-indigo-500" />
                </span>
                <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-slate-800">Importar datos</p>
                    <p className="text-xs text-slate-500">Arrastra o selecciona un archivo JSON</p>
                </div>
                <Upload size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
        </div>
    </div>
);