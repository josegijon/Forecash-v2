const TITLES: Record<string, string> = {
    planificacion: 'Planificación Financiera',
    simulaciones: 'Simulador "What-If"',
    proyeccion: 'Análisis de Futuro',
    datos: 'Datos y Ajustes',
};

export const Header = () => {

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
            </div>
        </header>
    )
}
