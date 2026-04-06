import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/ui/utils/cn";

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

const badgeVariants = cva(
    // Base — presente en todos los badges
    "inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5",
    {
        variants: {
            /**
             * variant
             *
             * danger  → Negativo, exceso, alerta crítica
             *           StatusBadge "Negativo", RatioProgressBar "exceso",
             *           SummaryCard tendencia negativa
             *
             * warning → Pico de gasto, alerta moderada
             *           StatusBadge "Pico"
             *
             * neutral → Etiqueta informativa sin carga emocional
             *           StatusBadge "Déficit", SummaryCard "Base",
             *           BalanceGoalsCard "Opcional"
             *
             * success → Tendencia positiva
             *           SummaryCard tendencia positiva
             */
            variant: {
                danger: "bg-badge-danger-bg text-badge-danger-fg",
                warning: "bg-badge-warning-bg text-badge-warning-fg",
                neutral: "bg-badge-neutral-bg text-badge-neutral-fg",
                success: "bg-badge-success-bg text-badge-success-fg",
            },
        },

        defaultVariants: {
            variant: "neutral",
        },
    }
);

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    BadgeVariants { }

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
    <span
        className={cn(badgeVariants({ variant }), className)}
        {...props}
    />
);