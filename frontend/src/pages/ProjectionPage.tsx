
import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    Clock,
    Wallet,
    AlertTriangle,
    BarChart3,
    Activity,
    ShieldAlert,
    PiggyBank,
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
    Bar,
    BarChart,
    ReferenceLine,
    Cell,
} from "recharts";

/* ─── Datos mock ─── */

const MONTH_NAMES = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const TIME_OPTIONS = [
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" },
    { value: 24, label: "24 meses" },
    { value: 60, label: "5 años" },
];

interface MonthData {
    month: string;
    ingresos: number;
    gastos: number;
    cashflow: number;
    balance: number;
    isNegativeBalance: boolean;
    isNegativeCashflow: boolean;
    isPeakExpense: boolean;
}

const generateProjectionData = (months: number): MonthData[] => {
    const data: MonthData[] = [];
    let balance = 5000;

    const startDate = new Date(2026, 1); // Feb 2026

    // Gastos base por mes (con estacionalidad)
    const baseIncome = 2800;
    const baseExpenses = 2200;

    for (let i = 0; i <= months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const monthIndex = date.getMonth();
        const label = `${MONTH_NAMES[monthIndex]} ${date.getFullYear().toString().slice(-2)}`;

        // Variación estacional
        const seasonalExpense =
            monthIndex === 11 ? 900 : // Diciembre - navidad
                monthIndex === 7 ? 700 :  // Agosto - vacaciones
                    monthIndex === 0 ? 400 :  // Enero - rebajas
                        monthIndex === 8 ? 350 :  // Septiembre - vuelta al cole
                            0;

        // Ingresos extras ocasionales
        const extraIncome =
            monthIndex === 5 ? 2800 :  // Junio - paga extra
                monthIndex === 11 ? 2800 : // Diciembre - paga extra
                    Math.random() > 0.85 ? Math.round(200 + Math.random() * 300) : 0;

        const ingresos = baseIncome + extraIncome + Math.round((Math.random() - 0.5) * 100);
        const gastos = baseExpenses + seasonalExpense + Math.round((Math.random() - 0.5) * 200);
        const cashflow = ingresos - gastos;
        balance += cashflow;

        const isPeakExpense = gastos > baseExpenses * 1.3;

        data.push({
            month: label,
            ingresos,
            gastos,
            cashflow,
            balance,
            isNegativeBalance: balance < 0,
            isNegativeCashflow: cashflow < 0,
            isPeakExpense,
        });
    }

    return data;
};

/* ─── Componente principal ─── */

export const ProjectionPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);

    const data = generateProjectionData(selectedMonths);
    const lastPoint = data[data.length - 1];
    const firstPoint = data[0];
    const balanceDiff = lastPoint.balance - firstPoint.balance;
    const isPositive = balanceDiff >= 0;

    const negativeMonths = data.filter((d) => d.isNegativeCashflow).length;
    const peakExpenseMonths = data.filter((d) => d.isPeakExpense).length;
    const minBalance = Math.min(...data.map((d) => d.balance));
    const avgCashflow = Math.round(
        data.reduce((sum, d) => sum + d.cashflow, 0) / data.length
    );

    // Alertas
    const alerts: { type: "danger" | "warning" | "info"; message: string }[] = [];
    const negBalanceMonths = data.filter((d) => d.isNegativeBalance);
    if (negBalanceMonths.length > 0) {
        alerts.push({
            type: "danger",
            message: `Tu balance entra en negativo en ${negBalanceMonths.length} ${negBalanceMonths.length === 1 ? "mes" : "meses"}. El punto más bajo es ${minBalance.toLocaleString("es-ES")} €.`,
        });
    }
    if (negativeMonths >= 3) {
        alerts.push({
            type: "warning",
            message: `Tienes ${negativeMonths} meses con cashflow negativo. Revisa tus gastos en esos periodos.`,
        });
    }
    if (peakExpenseMonths > 0) {
        alerts.push({
            type: "warning",
            message: `${peakExpenseMonths} ${peakExpenseMonths === 1 ? "mes" : "meses"} con picos de gasto superiores al 130% del gasto base.`,
        });
    }
    if (avgCashflow > 0 && negativeMonths === 0) {
        alerts.push({
            type: "info",
            message: `Margen medio positivo de ${avgCashflow.toLocaleString("es-ES")} €/mes. Tu plan es sostenible.`,
        });
    }

    return (
        <div className="flex-1 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ─── Cabecera: Selector de horizonte ─── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Proyección financiera
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Visualiza tu cashflow y balance acumulado en el tiempo
                        </p>
                    </div>

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

                {/* ─── Alertas visuales ─── */}
                {alerts.length > 0 && (
                    <div className="space-y-3">
                        {alerts.map((alert, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-3 rounded-2xl border p-4 ${alert.type === "danger"
                                    ? "bg-red-50/70 border-red-200"
                                    : alert.type === "warning"
                                        ? "bg-amber-50/70 border-amber-200"
                                        : "bg-emerald-50/70 border-emerald-200"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${alert.type === "danger"
                                        ? "bg-red-100"
                                        : alert.type === "warning"
                                            ? "bg-amber-100"
                                            : "bg-emerald-100"
                                        }`}
                                >
                                    {alert.type === "danger" ? (
                                        <ShieldAlert size={16} className="text-red-600" />
                                    ) : alert.type === "warning" ? (
                                        <AlertTriangle size={16} className="text-amber-600" />
                                    ) : (
                                        <TrendingUp size={16} className="text-emerald-600" />
                                    )}
                                </div>
                                <p
                                    className={`text-sm font-medium ${alert.type === "danger"
                                        ? "text-red-800"
                                        : alert.type === "warning"
                                            ? "text-amber-800"
                                            : "text-emerald-800"
                                        }`}
                                >
                                    {alert.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Tarjetas resumen ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Balance actual */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Wallet size={16} className="text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Balance Actual
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {firstPoint.balance.toLocaleString("es-ES")} €
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Punto de partida</p>
                    </div>

                    {/* Balance proyectado */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive ? "bg-emerald-100" : "bg-red-100"}`}>
                                {isPositive ? (
                                    <TrendingUp size={16} className="text-emerald-600" />
                                ) : (
                                    <TrendingDown size={16} className="text-red-600" />
                                )}
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Balance Final
                            </span>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl font-bold text-slate-900">
                                {lastPoint.balance.toLocaleString("es-ES")} €
                            </p>
                            <span
                                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${isPositive
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {isPositive ? "+" : ""}{balanceDiff.toLocaleString("es-ES")} €
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">En {selectedMonths} meses</p>
                    </div>

                    {/* Margen medio */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${avgCashflow >= 0 ? "bg-indigo-100" : "bg-red-100"}`}>
                                <PiggyBank size={16} className={avgCashflow >= 0 ? "text-indigo-600" : "text-red-600"} />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Margen Medio
                            </span>
                        </div>
                        <p className={`text-2xl font-bold ${avgCashflow >= 0 ? "text-slate-900" : "text-red-700"}`}>
                            {avgCashflow >= 0 ? "+" : ""}{avgCashflow.toLocaleString("es-ES")} €
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Cashflow medio mensual</p>
                    </div>

                    {/* Meses en riesgo */}
                    <div className={`rounded-2xl border p-5 ${negativeMonths > 0
                        ? "bg-amber-50/60 border-amber-200"
                        : "bg-card-light border-slate-200"
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${negativeMonths > 0 ? "bg-amber-100" : "bg-slate-100"}`}>
                                <AlertTriangle size={16} className={negativeMonths > 0 ? "text-amber-600" : "text-slate-400"} />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Meses en Riesgo
                            </span>
                        </div>
                        <p className={`text-2xl font-bold ${negativeMonths > 0 ? "text-amber-700" : "text-slate-900"}`}>
                            {negativeMonths}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Con cashflow negativo</p>
                    </div>
                </div>

                {/* ─── Gráfica: Cashflow mensual (barras) ─── */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">
                            Cashflow mensual
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
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
                                    name === "ingresos" ? "Ingresos" : "Gastos",
                                ]}
                                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                            />
                            <Legend
                                formatter={(value: string) =>
                                    value === "ingresos" ? "Ingresos" : "Gastos"
                                }
                                wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                            />
                            <Bar
                                dataKey="ingresos"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={selectedMonths <= 12 ? 24 : 14}
                            />
                            <Bar
                                dataKey="gastos"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={selectedMonths <= 12 ? 24 : 14}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isPeakExpense ? "#ef4444" : "#f59e0b"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-sm bg-amber-500" />
                            Gasto normal
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-sm bg-red-500" />
                            Pico de gasto (&gt;130%)
                        </div>
                    </div>
                </div>

                {/* ─── Gráfica: Balance acumulado ─── */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">
                            Balance acumulado
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={340}>
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
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
                                formatter={(value) => [
                                    `${Number(value).toLocaleString("es-ES")} €`,
                                    "Balance",
                                ]}
                                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                            />
                            <ReferenceLine
                                y={0}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                strokeWidth={1.5}
                                label={{
                                    value: "Zona de riesgo",
                                    position: "insideTopLeft",
                                    fill: "#ef4444",
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="balance"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fill="url(#gradBalance)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: "#6366f1",
                                    strokeWidth: 2,
                                    stroke: "#fff",
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ─── Tabla: Detalle mensual ─── */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">
                            Detalle mensual
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Mes
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Ingresos
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Gastos
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Cashflow
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Balance
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => {
                                    const cfPositive = row.cashflow >= 0;
                                    return (
                                        <tr
                                            key={i}
                                            className={`border-b border-slate-100 transition-colors ${row.isNegativeBalance
                                                ? "bg-red-50/50"
                                                : row.isPeakExpense
                                                    ? "bg-amber-50/40"
                                                    : "hover:bg-slate-50/50"
                                                }`}
                                        >
                                            <td className="py-3 px-4 font-medium text-slate-700">
                                                {row.month}
                                            </td>
                                            <td className="py-3 px-4 text-right text-slate-700">
                                                {row.ingresos.toLocaleString("es-ES")} €
                                            </td>
                                            <td className="py-3 px-4 text-right text-slate-700">
                                                {row.gastos.toLocaleString("es-ES")} €
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <span
                                                    className={`inline-flex items-center gap-1 font-semibold ${cfPositive
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    {cfPositive ? (
                                                        <ArrowUpRight size={14} />
                                                    ) : (
                                                        <ArrowDownRight size={14} />
                                                    )}
                                                    {cfPositive ? "+" : ""}
                                                    {row.cashflow.toLocaleString("es-ES")} €
                                                </span>
                                            </td>
                                            <td className={`py-3 px-4 text-right font-medium ${row.isNegativeBalance ? "text-red-700" : "text-slate-700"
                                                }`}>
                                                {row.balance.toLocaleString("es-ES")} €
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {row.isNegativeBalance ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                                                        <ShieldAlert size={12} />
                                                        Negativo
                                                    </span>
                                                ) : row.isPeakExpense ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                                                        <AlertTriangle size={12} />
                                                        Pico
                                                    </span>
                                                ) : row.isNegativeCashflow ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                                        <ChevronDown size={12} />
                                                        Déficit
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                        <TrendingUp size={12} />
                                                        OK
                                                    </span>
                                                )}
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
