
import { useState } from "react";
import {
    Copy,
    GitCompareArrows,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    Clock,
    Layers,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

/* ─── Datos mock ─── */

const SCENARIOS = [
    { id: "current", name: "Escenario Actual" },
    { id: "optimista", name: "Escenario Optimista" },
    { id: "conservador", name: "Escenario Conservador" },
];

const generateMockData = (months: number) => {
    const data = [];
    let currentBalance = 5000;
    let altBalance = 5000;

    const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const startDate = new Date(2026, 1); // Feb 2026

    for (let i = 0; i <= months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const label = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;

        currentBalance += Math.round(300 + Math.random() * 200 - 80);
        altBalance += Math.round(450 + Math.random() * 300 - 60);

        data.push({
            month: label,
            actual: currentBalance,
            comparado: altBalance,
            diferencia: altBalance - currentBalance,
        });
    }

    return data;
};

const TIME_OPTIONS = [
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" },
    { value: 24, label: "24 meses" },
    { value: 60, label: "5 años" },
];

/* ─── Componente principal ─── */

export const SimulationPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);
    const [selectedScenario, setSelectedScenario] = useState("optimista");

    const data = generateMockData(selectedMonths);
    const lastPoint = data[data.length - 1];
    const diff = lastPoint.diferencia;
    const diffPercent = ((diff / lastPoint.actual) * 100).toFixed(1);
    const isPositive = diff >= 0;

    const scenarioName =
        SCENARIOS.find((s) => s.id === selectedScenario)?.name ?? "Escenario";

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ─── Cabecera: Copiar escenario + Selector de escenario + Tiempo ─── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Botón copiar escenario */}
                    <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
                        onClick={() => alert("TODO: Crear copia del escenario actual")}
                    >
                        <Copy size={16} strokeWidth={2.5} />
                        Crear copia del escenario
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Selector de escenario a comparar */}
                        <div className="relative group">
                            <select
                                value={selectedScenario}
                                onChange={(e) => setSelectedScenario(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all hover:shadow-md"
                            >
                                {SCENARIOS.filter((s) => s.id !== "current").map((s) => (
                                    <option key={s.id} value={s.id}>
                                        vs {s.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                                <ChevronDown size={16} strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Selector de tiempo */}
                        <div className="relative group">
                            <select
                                value={selectedMonths}
                                onChange={(e) => setSelectedMonths(Number(e.target.value))}
                                className="appearance-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all hover:shadow-md"
                            >
                                {TIME_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                                <Clock size={16} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Tarjetas resumen ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Saldo final actual */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Layers size={16} className="text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Escenario Actual
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {lastPoint.actual.toLocaleString("es-ES")} €
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Saldo proyectado a {selectedMonths} meses
                        </p>
                    </div>

                    {/* Saldo final comparado */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <GitCompareArrows size={16} className="text-indigo-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {scenarioName}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {lastPoint.comparado.toLocaleString("es-ES")} €
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Saldo proyectado a {selectedMonths} meses
                        </p>
                    </div>

                    {/* Diferencia */}
                    <div
                        className={`rounded-2xl border p-5 ${isPositive
                                ? "bg-emerald-50/60 border-emerald-200"
                                : "bg-red-50/60 border-red-200"
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive ? "bg-emerald-100" : "bg-red-100"
                                    }`}
                            >
                                {isPositive ? (
                                    <TrendingUp size={16} className="text-emerald-600" />
                                ) : (
                                    <TrendingDown size={16} className="text-red-600" />
                                )}
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Diferencia
                            </span>
                        </div>
                        <div className="flex items-end gap-2">
                            <p
                                className={`text-2xl font-bold ${isPositive ? "text-emerald-700" : "text-red-700"
                                    }`}
                            >
                                {isPositive ? "+" : ""}
                                {diff.toLocaleString("es-ES")} €
                            </p>
                            <span
                                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${isPositive
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {isPositive ? (
                                    <ArrowUpRight size={12} />
                                ) : (
                                    <ArrowDownRight size={12} />
                                )}
                                {diffPercent}%
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            El {scenarioName.toLowerCase()} {isPositive ? "supera" : "queda por debajo de"} tu escenario actual
                        </p>
                    </div>
                </div>

                {/* ─── Gráfica comparativa ─── */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <GitCompareArrows size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">
                            Trayectoria comparativa
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradComparado" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                axisLine={{ stroke: "#e2e8f0" }}
                                tickLine={false}
                                interval={selectedMonths <= 12 ? 0 : selectedMonths <= 24 ? 2 : 5}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v: number) =>
                                    `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
                                }
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    fontSize: "13px",
                                }}
                                formatter={(value, name) => [
                                    `${Number(value).toLocaleString("es-ES")} €`,
                                    name === "actual" ? "Escenario Actual" : scenarioName,
                                ]}
                                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                            />
                            <Legend
                                formatter={(value: string) =>
                                    value === "actual" ? "Escenario Actual" : scenarioName
                                }
                                wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                            />

                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fill="url(#gradActual)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="comparado"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fill="url(#gradComparado)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ─── Tabla de resumen por hitos ─── */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">
                            Resumen por hitos
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Periodo
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Actual
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {scenarioName}
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Diferencia
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[3, 6, 12, 24, 60]
                                    .filter((m) => m <= selectedMonths)
                                    .map((m) => {
                                        const point = data[Math.min(m, data.length - 1)];
                                        const d = point.diferencia;
                                        const pos = d >= 0;
                                        return (
                                            <tr
                                                key={m}
                                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="py-3 px-4 font-medium text-slate-700">
                                                    {m < 12
                                                        ? `${m} meses`
                                                        : m === 12
                                                            ? "1 año"
                                                            : m === 24
                                                                ? "2 años"
                                                                : "5 años"}
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-700 font-medium">
                                                    {point.actual.toLocaleString("es-ES")} €
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-700 font-medium">
                                                    {point.comparado.toLocaleString("es-ES")} €
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span
                                                        className={`inline-flex items-center gap-1 font-semibold ${pos
                                                                ? "text-emerald-600"
                                                                : "text-red-600"
                                                            }`}
                                                    >
                                                        {pos ? (
                                                            <ArrowUpRight size={14} />
                                                        ) : (
                                                            <ArrowDownRight size={14} />
                                                        )}
                                                        {pos ? "+" : ""}
                                                        {d.toLocaleString("es-ES")} €
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
