
import { useState } from "react";
import {
    Tags, PlusCircle, Pencil, Trash2, Check, X,
    Coins, ChevronDown,
    Download, Upload, FileJson, FileSpreadsheet,
    Layers, Plus, MoreVertical,
    AlertTriangle, RotateCcw,
} from "lucide-react";

/* ── Datos falsos ─────────────────────────────────────── */

interface Category {
    id: number;
    name: string;
    color: string;
}

const INITIAL_EXPENSE_CATEGORIES: Category[] = [
    { id: 1, name: "Hogar", color: "#6366f1" },
    { id: 2, name: "Transporte", color: "#f59e0b" },
    { id: 3, name: "Alimentación", color: "#10b981" },
    { id: 4, name: "Salud", color: "#ef4444" },
    { id: 5, name: "Entretenimiento", color: "#8b5cf6" },
    { id: 6, name: "Educación", color: "#3b82f6" },
];

const INITIAL_INCOME_CATEGORIES: Category[] = [
    { id: 10, name: "Trabajo", color: "#10b981" },
    { id: 11, name: "Freelance", color: "#6366f1" },
    { id: 12, name: "Inversiones", color: "#f59e0b" },
    { id: 13, name: "Otros ingresos", color: "#8b5cf6" },
];

interface Scenario {
    id: number;
    name: string;
    createdAt: string;
    itemsCount: number;
}

const INITIAL_SCENARIOS: Scenario[] = [
    { id: 1, name: "Escenario Base", createdAt: "15 Ene 2026", itemsCount: 12 },
    { id: 2, name: "Ahorro Agresivo", createdAt: "02 Feb 2026", itemsCount: 8 },
    { id: 3, name: "Inversión Moderada", createdAt: "10 Feb 2026", itemsCount: 15 },
];

const CURRENCIES = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "Dólar estadounidense" },
    { code: "GBP", symbol: "£", name: "Libra esterlina" },
    { code: "ARS", symbol: "$", name: "Peso argentino" },
    { code: "MXN", symbol: "$", name: "Peso mexicano" },
    { code: "CLP", symbol: "$", name: "Peso chileno" },
    { code: "COP", symbol: "$", name: "Peso colombiano" },
    { code: "BRL", symbol: "R$", name: "Real brasileño" },
    { code: "JPY", symbol: "¥", name: "Yen japonés" },
];

/* ── Componente principal ─────────────────────────────── */

export const DataPage = () => {
    // Categorías
    const [expenseCategories, setExpenseCategories] = useState<Category[]>(INITIAL_EXPENSE_CATEGORIES);
    const [incomeCategories, setIncomeCategories] = useState<Category[]>(INITIAL_INCOME_CATEGORIES);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    const [newExpenseCategory, setNewExpenseCategory] = useState("");
    const [newIncomeCategory, setNewIncomeCategory] = useState("");

    // Moneda
    const [selectedCurrency, setSelectedCurrency] = useState("EUR");
    const [currencyOpen, setCurrencyOpen] = useState(false);

    // Escenarios
    const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
    const [editingScenarioId, setEditingScenarioId] = useState<number | null>(null);
    const [editingScenarioName, setEditingScenarioName] = useState("");
    const [scenarioMenuId, setScenarioMenuId] = useState<number | null>(null);

    // ── Handlers categorías ──
    const handleAddCategory = (type: "expense" | "income") => {
        const name = type === "expense" ? newExpenseCategory.trim() : newIncomeCategory.trim();
        if (!name) return;

        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
        const newCat: Category = { id: Date.now(), name, color: randomColor };

        if (type === "expense") {
            setExpenseCategories((prev) => [...prev, newCat]);
            setNewExpenseCategory("");
        } else {
            setIncomeCategories((prev) => [...prev, newCat]);
            setNewIncomeCategory("");
        }
    };

    const handleDeleteCategory = (type: "expense" | "income", id: number) => {
        if (type === "expense") setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
        else setIncomeCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const startEditingCategory = (cat: Category) => {
        setEditingCategoryId(cat.id);
        setEditingCategoryName(cat.name);
    };

    const confirmEditCategory = (type: "expense" | "income") => {
        const setter = type === "expense" ? setExpenseCategories : setIncomeCategories;
        setter((prev) =>
            prev.map((c) => (c.id === editingCategoryId ? { ...c, name: editingCategoryName } : c))
        );
        setEditingCategoryId(null);
    };

    // ── Handlers escenarios ──
    const handleAddScenario = () => {
        const newScenario: Scenario = {
            id: Date.now(),
            name: `Escenario ${scenarios.length + 1}`,
            createdAt: "23 Feb 2026",
            itemsCount: 0,
        };
        setScenarios((prev) => [...prev, newScenario]);
    };

    const handleDeleteScenario = (id: number) => {
        setScenarios((prev) => prev.filter((s) => s.id !== id));
        setScenarioMenuId(null);
    };

    const startEditingScenario = (s: Scenario) => {
        setEditingScenarioId(s.id);
        setEditingScenarioName(s.name);
        setScenarioMenuId(null);
    };

    const confirmEditScenario = () => {
        setScenarios((prev) =>
            prev.map((s) => (s.id === editingScenarioId ? { ...s, name: editingScenarioName } : s))
        );
        setEditingScenarioId(null);
    };

    const currentCurrency = CURRENCIES.find((c) => c.code === selectedCurrency)!;

    /* ── Render helpers ──────────────────────────────────── */

    const renderCategoryList = (categories: Category[], type: "expense" | "income") => (
        <div className="flex flex-col gap-2">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-all"
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                        />
                        {editingCategoryId === cat.id ? (
                            <input
                                autoFocus
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && confirmEditCategory(type)}
                                className="flex-1 text-sm font-medium bg-white px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        ) : (
                            <span className="text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {editingCategoryId === cat.id ? (
                            <>
                                <button
                                    onClick={() => confirmEditCategory(type)}
                                    className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={() => setEditingCategoryId(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => startEditingCategory(cat)}
                                    className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(type, cat.id)}
                                    className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    /* ── JSX principal ───────────────────────────────────── */

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ═══ FILA 1: Categorías ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Categorías de gastos */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Tags size={20} className="text-rose-500" />
                            <h3 className="font-bold text-slate-900">Categorías de Gastos</h3>
                        </div>

                        {renderCategoryList(expenseCategories, "expense")}

                        {/* Agregar nueva */}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                value={newExpenseCategory}
                                onChange={(e) => setNewExpenseCategory(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddCategory("expense")}
                                placeholder="Nueva categoría…"
                                className="flex-1 text-sm px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <button
                                onClick={() => handleAddCategory("expense")}
                                className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 transition-all cursor-pointer"
                            >
                                <PlusCircle size={16} />
                                Añadir
                            </button>
                        </div>
                    </div>

                    {/* Categorías de ingresos */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Tags size={20} className="text-emerald-500" />
                            <h3 className="font-bold text-slate-900">Categorías de Ingresos</h3>
                        </div>

                        {renderCategoryList(incomeCategories, "income")}

                        {/* Agregar nueva */}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                value={newIncomeCategory}
                                onChange={(e) => setNewIncomeCategory(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddCategory("income")}
                                placeholder="Nueva categoría…"
                                className="flex-1 text-sm px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <button
                                onClick={() => handleAddCategory("income")}
                                className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 transition-all cursor-pointer"
                            >
                                <PlusCircle size={16} />
                                Añadir
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ FILA 2: Moneda + Import/Export ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Selector de moneda */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Coins size={20} className="text-amber-500" />
                            <h3 className="font-bold text-slate-900">Moneda</h3>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            Selecciona la moneda que se usará en todas las cantidades de la aplicación.
                        </p>

                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setCurrencyOpen(!currencyOpen)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-lg font-bold text-amber-600">
                                        {currentCurrency.symbol}
                                    </span>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-800">{currentCurrency.code}</p>
                                        <p className="text-xs text-slate-500">{currentCurrency.name}</p>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {currencyOpen && (
                                <div className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-lg max-h-56 overflow-y-auto">
                                    {CURRENCIES.map((c) => (
                                        <button
                                            key={c.code}
                                            onClick={() => { setSelectedCurrency(c.code); setCurrencyOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl ${selectedCurrency === c.code ? "bg-primary/5" : ""}`}
                                        >
                                            <span className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                                {c.symbol}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{c.code}</p>
                                                <p className="text-xs text-slate-500">{c.name}</p>
                                            </div>
                                            {selectedCurrency === c.code && (
                                                <Check size={16} className="ml-auto text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Importar / Exportar datos */}
                    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Download size={20} className="text-blue-500" />
                            <h3 className="font-bold text-slate-900">Importar / Exportar</h3>
                        </div>

                        <p className="text-sm text-slate-500 mb-5">
                            Exporta tus datos para respaldo o importa una configuración previa.
                        </p>

                        <div className="space-y-3">
                            {/* Exportar JSON */}
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
                                <span className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                                    <FileJson size={18} className="text-blue-500" />
                                </span>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-semibold text-slate-800">Exportar como JSON</p>
                                    <p className="text-xs text-slate-500">Todos los escenarios y configuración</p>
                                </div>
                                <Download size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </button>

                            {/* Exportar CSV */}
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
                                <span className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <FileSpreadsheet size={18} className="text-emerald-500" />
                                </span>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-semibold text-slate-800">Exportar como CSV</p>
                                    <p className="text-xs text-slate-500">Compatible con hojas de cálculo</p>
                                </div>
                                <Download size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            </button>

                            {/* Importar */}
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
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
                </div>

                {/* ═══ FILA 3: Escenarios ═══ */}
                <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Layers size={20} className="text-primary" />
                            <h3 className="font-bold text-slate-900">Escenarios</h3>
                        </div>
                        <button
                            onClick={handleAddScenario}
                            className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                            Nuevo Escenario
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 mb-5">
                        Crea diferentes escenarios financieros para comparar estrategias. Cada escenario tiene sus propios ítems de efectivo independientes.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                className="relative flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                            >
                                {/* Header del escenario */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/30" />
                                        {editingScenarioId === scenario.id ? (
                                            <input
                                                autoFocus
                                                value={editingScenarioName}
                                                onChange={(e) => setEditingScenarioName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") confirmEditScenario();
                                                    if (e.key === "Escape") setEditingScenarioId(null);
                                                }}
                                                className="flex-1 text-sm font-semibold bg-white px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-slate-800 truncate">
                                                {scenario.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Menú de acciones */}
                                    {editingScenarioId === scenario.id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={confirmEditScenario}
                                                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setEditingScenarioId(null)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <button
                                                onClick={() => setScenarioMenuId(scenarioMenuId === scenario.id ? null : scenario.id)}
                                                className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600 transition-all cursor-pointer"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {scenarioMenuId === scenario.id && (
                                                <div className="absolute right-0 top-8 z-10 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-40">
                                                    <button
                                                        onClick={() => startEditingScenario(scenario)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil size={14} />
                                                        Renombrar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteScenario(scenario.id)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Detalles */}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Creado: {scenario.createdAt}</span>
                                    <span className="px-2 py-0.5 bg-slate-200/60 rounded-md font-medium">
                                        {scenario.itemsCount} ítems
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ FILA 4: Zona peligrosa ═══ */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={20} className="text-rose-500" />
                        <h3 className="font-bold text-rose-700">Zona Peligrosa</h3>
                    </div>

                    <p className="text-sm text-rose-600/80 mb-5">
                        Estas acciones son irreversibles. Úsalas con precaución.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 transition-all cursor-pointer">
                            <RotateCcw size={16} />
                            Restablecer categorías
                        </button>
                        <button className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 transition-all cursor-pointer">
                            <Trash2 size={16} />
                            Borrar todos los datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
