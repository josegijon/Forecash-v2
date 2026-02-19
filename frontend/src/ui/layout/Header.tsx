import { ChevronDown } from "lucide-react";

export const Header = () => {

    const TITLES: Record<string, string> = {
        planificacion: 'Planificación Financiera',
        simulaciones: 'Simulador "What-If"',
        proyeccion: 'Análisis de Futuro',
        datos: 'Datos y Ajustes',
    };

    const getTitle = () => {
        const lastSegment = location.pathname.split('/').filter(Boolean).pop() ?? '';
        return TITLES[lastSegment] ?? 'Forecash';
    };

    return (
        <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-lg sticky top-0 z-10 shadow-sm py-4">
            <div className="h-full px-8 flex items-center justify-between">
                {/* Título y Escenario */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 font-medium">Escenario:</span>
                        <span className="px-2.5 py-1 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-semibold text-xs border border-blue-100">
                            Escenario 1
                        </span>
                    </div>
                </div>

                {/* Selector de Proyección */}
                <div className="flex items-center gap-3">
                    {/* <label className="text-sm font-semibold text-slate-700">Proyección:</label> */}
                    <div className="relative group">
                        <select
                            // value={projectionMonths}
                            // onChange={(e) => setProjectionMonths(Number(e.target.value))}
                            className="appearance-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all hover:shadow-md"
                        >
                            <option value={6}>6 meses</option>
                            <option value={12}>12 meses</option>
                            <option value={24}>24 meses</option>
                            <option value={60}>5 años</option>
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-200 group-focus-within:rotate-180 group-hover:text-blue-600">
                            <ChevronDown size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
