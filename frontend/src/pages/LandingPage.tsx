import { useNavigate } from "react-router";
import { LineChart, FlaskConical, Shield, ArrowRight, HardDrive, Lock, Zap } from "lucide-react";
import { Button } from "@/ui/primitives/Button";
import { useScenarioStore } from "@/store";
import logo from "@/assets/images/logo-1.png";

// ── Data ──────────────────────────────────────────────────────────────────────

const USE_CASES = [
    "¿Puedo permitirme cambiar de trabajo aunque cobre menos?",
    "¿Llego a fin de mes si me mudo a un piso más caro?",
    "¿Cuánto tiempo resisto si pierdo el empleo?",
    "¿Podré ahorrar para el coche si subo mi alquiler?",
    "¿En qué mes me quedaré sin liquidez si sigo así?",
    "¿Qué pasa con mis finanzas si tengo un hijo?",
] as const;

const FEATURES = [
    {
        icon: LineChart,
        title: "Proyecta el futuro",
        description:
            "Ve tu cashflow mes a mes hasta 5 años. Identifica los meses en negativo antes de que lleguen.",
    },
    {
        icon: FlaskConical,
        title: "Simula cambios",
        description:
            "¿Qué pasa si te suben el sueldo? ¿Y si te mudas? Crea escenarios alternativos y compáralos lado a lado.",
    },
    {
        icon: Shield,
        title: "Privacidad total",
        description:
            "Sin cuenta ni servidor. Tus datos viven en tu navegador. Exporta e importa cuando quieras.",
    },
] as const;

const STEPS = [
    {
        number: "01",
        title: "Define tu situación",
        description:
            "Añade tus ingresos y gastos recurrentes. Salario, alquiler, suscripciones. Todo editable en cualquier momento.",
        detail: "No necesitas ser preciso al 100%. Con una estimación realista ya obtienes una proyección útil.",
    },
    {
        number: "02",
        title: "Ve tu proyección",
        description:
            "Forecash calcula tu cashflow mes a mes y te avisa visualmente de los periodos con riesgo.",
        detail: "Verás exactamente en qué mes tu balance entra en negativo, cuánto tiempo tienes y cuál es el peor escenario.",
    },
    {
        number: "03",
        title: "Simula y decide",
        description:
            "Crea un escenario alternativo, modifica una variable y compara el resultado.",
        detail: "Duplica tu escenario actual, cambia el salario o el alquiler, y compara ambas trayectorias en la misma pantalla.",
    },
] as const;

const GUARANTEES = [
    {
        icon: HardDrive,
        title: "Tus datos no salen de tu dispositivo",
        description:
            "Todo se guarda en el localStorage de tu navegador. Ningún servidor recibe tu información financiera.",
    },
    {
        icon: Lock,
        title: "Sin cuenta, sin contraseña",
        description:
            "Abre la app y empieza. No hay registro, no hay email, no hay verificación. Cero fricción.",
    },
    {
        icon: Zap,
        title: "Gratis, sin límites",
        description:
            "Sin planes de pago, sin features bloqueadas, sin anuncios. La app completa desde el primer momento.",
    },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export const LandingPage = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        const { activeScenarioId } = useScenarioStore.getState();
        navigate(`/escenario/${activeScenarioId}/planificacion`);
    };

    return (
        <div className="min-h-dvh bg-background text-foreground font-poppins">

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="" className="w-8 object-contain" />
                        <span className="font-semibold text-xl tracking-tight">
                            <span className="text-primary">Fore</span>cash
                        </span>
                    </div>
                    <Button size="sm" onClick={handleEnter}>
                        Entrar a la app
                    </Button>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6">
                    Planificador financiero personal · Sin registro · Sin servidor
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-balance">
                    ¿Sabes si podrás permitirte
                    <br className="hidden sm:block" /> ese cambio?
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 text-pretty">
                    Forecash proyecta tu cashflow mes a mes y simula qué pasa antes de que
                    decidas. Sin cuenta, sin servidor. Solo tú y tus números.
                </p>
                <Button onClick={handleEnter}>
                    Empezar ahora
                    <ArrowRight size={16} />
                </Button>
            </section>

            <Divider />

            {/* ── Use cases ── */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <SectionLabel>Preguntas que Forecash responde</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {USE_CASES.map((question) => (
                        <div
                            key={question}
                            className="flex items-center gap-3 px-5 py-4 rounded-xl border border-border bg-card"
                        >
                            <span className="text-primary font-bold text-sm shrink-0 mt-px">→</span>
                            <p className="text-sm text-foreground font-medium text-pretty">
                                {question}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Divider />

            {/* ── Features ── */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <SectionLabel>Qué hace Forecash</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card"
                        >
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-1 text-balance">
                                    {title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Divider />

            {/* ── How it works ── */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <SectionLabel>Cómo funciona</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {STEPS.map(({ number, title, description, detail }) => (
                        <div key={number} className="flex flex-col gap-3">
                            <span className="text-4xl font-bold text-primary/20 tabular-nums leading-none">
                                {number}
                            </span>
                            <h3 className="text-base font-bold text-foreground text-balance">
                                {title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                                {description}
                            </p>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed border-l-2 border-primary/20 pl-3 text-pretty">
                                {detail}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Divider />

            {/* ── Guarantees ── */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <SectionLabel>Sin letra pequeña</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {GUARANTEES.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex flex-col gap-3">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-primary" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground text-balance">
                                {title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Divider />

            {/* ── Final CTA ── */}
            <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                <h2 className="text-3xl font-bold mb-3 text-balance">
                    Empieza ahora, sin registro
                </h2>
                <p className="text-muted-foreground mb-8 text-pretty">
                    Todo en tu navegador. Sin cuenta, sin servidor, sin tracking.
                </p>
                <Button onClick={handleEnter}>
                    Abrir Forecash
                    <ArrowRight size={16} />
                </Button>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-border bg-card">
                <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">

                    {/* Marca */}
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="" className="w-7 object-contain" />
                            <span className="font-semibold text-lg tracking-tight">
                                <span className="text-primary">Fore</span>cash
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-pretty">
                            Planificador financiero personal
                        </p>
                    </div>

                    {/* Privacidad */}
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <p className="text-xs font-bold text-foreground uppercase tracking-widest">
                            Privacidad
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {[
                                "Sin cookies de seguimiento",
                                "Sin análisis de comportamiento",
                                "Tus datos nunca salen de tu navegador",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="size-1 rounded-full bg-primary/40 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <p className="text-xs font-bold text-foreground uppercase tracking-widest">
                            Legal
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {[
                                "Proyecto de código abierto",
                                "Sin términos de servicio vinculantes",
                                "Sin responsabilidad sobre decisiones financieras",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="size-1 rounded-full bg-primary/40 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="border-t border-border">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground tabular-nums">
                            © {new Date().getFullYear()} Forecash · Hecho para planificar, no para preocuparse
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const Divider = () => (
    <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
    </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-12">
        {children}
    </p>
);
