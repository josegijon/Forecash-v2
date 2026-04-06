import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/ui/utils/cn";

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

const inputVariants = cva(
    // Base — presente en todos los inputs
    [
        "w-full rounded-xl border text-sm font-medium text-foreground",
        "placeholder:text-muted-foreground/50",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Oculta el spinner nativo en inputs type="number" — siempre
        "[&::-webkit-inner-spin-button]:appearance-none",
        "[&::-webkit-outer-spin-button]:appearance-none",
    ],
    {
        variants: {
            /**
             * variant
             *
             * default  → Inputs en modales. Fondo muted/40, borde suave.
             *            AddScenarioModal, AddCashflowModal, StartSlider, EndDateSection
             *
             * settings → Inputs inline en settings. Fondo background, altura fija h-9.
             *            CategoryManagerCard, ScenarioManagerCard
             */
            variant: {
                default: "px-4 py-2.5 bg-muted/40 border-border/60",
                settings: "h-9 px-3 py-2 bg-background border-border",
            },

            /**
             * error — estado de validación fallida
             * Cambia el borde a destructive. Se usa con cualquier variant.
             */
            error: {
                true: "border-destructive/60 focus-visible:ring-destructive/20 focus-visible:border-destructive/60",
                false: "",
            },
        },

        defaultVariants: {
            variant: "default",
            error: false,
        },
    }
);

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariants { }

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Input = ({
    className,
    variant,
    error,
    ...props
}: InputProps) => (
    <input
        className={cn(inputVariants({ variant, error }), className)}
        {...props}
    />
);