import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/ui/utils/cn";

// ---------------------------------------------------------------------------
// Variantes — derivadas de los patrones reales del proyecto
// ---------------------------------------------------------------------------

const buttonVariants = cva(
    // Base: presente en todos los botones del proyecto
    [
        "inline-flex items-center justify-center gap-1.5",
        "whitespace-nowrap rounded-xl",
        "transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-40 disabled:cursor-not-allowed",
    ],
    {
        variants: {
            /**
             * intent — qué acción comunica el botón
             *
             * primary     → CTA principal. Fondo verde sólido.
             *               Fuente: AddScenarioModal #4, CategoryManagerCard #8,
             *                       WelcomeBannerModal, EmptyPlanningBanner
             *
             * secondary   → Cancelar / volver. Sin fondo, texto muted.
             *               Fuente: AddScenarioModal #2, todos los footers de modal
             *
             * destructive → Acción irreversible. Fondo rojo sólido.
             *               Fuente: ConfirmDeleteCashflowItemModal, ConfirmDeleteScenarioModal,
             *                       ConfirmResetModal #3
             *               Nota: el llamante añade className="flex-1" si necesita crecer
             *
             * ghost       → Icono solo, sin fondo visible. Para cerrar modales.
             *               Fuente: AddScenarioModal #1 y todos los modales
             *
             * chip        → Selector de opción entre varias. Borde visible.
             *               Activo: fondo primary/10, texto primary, borde primary/30
             *               Inactivo: fondo muted/40, texto muted-foreground
             *               Fuente: FrequencySelector, QuestionsStep #9
             */
            intent: {
                primary: "text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90",
                secondary: "text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted",
                destructive: "text-sm font-bold text-destructive-foreground bg-destructive hover:bg-destructive/90",
                ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
                chip: "text-xs font-semibold border",
            },

            /**
             * size — dimensiones
             *
             * md   → Estándar en modales (px-5 py-2.5)
             * sm   → Inline compacto en settings (h-9 px-3.5), también #8
             * icon → Solo icono, cuadrado (w-8 h-8). Solo con intent="ghost"
             */
            size: {
                md: "px-5 py-2.5",
                sm: "h-9 px-3.5",
                icon: "w-8 h-8 shrink-0",
            },

            /**
             * active — solo relevante cuando intent="chip"
             * Controla el estado seleccionado/deseleccionado
             */
            active: {
                true: "bg-primary/10 text-primary border-primary/30",
                false: "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground",
            },
        },

        compoundVariants: [
            // chip sin "active" explícito → estado inactivo por defecto
            {
                intent: "chip",
                active: undefined,
                className: "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground",
            },
        ],

        defaultVariants: {
            intent: "primary",
            size: "md",
        },
    }
);

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants { }

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Button = ({
    className,
    intent,
    size,
    active,
    ...props
}: ButtonProps) => (
    <button
        className={cn(buttonVariants({ intent, size, active }), className)}
        {...props}
    />
);

export { buttonVariants };