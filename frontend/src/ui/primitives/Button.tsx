import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/ui/utils/cn";

const buttonVariants = cva(
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
             * intent
             *
             * primary     → CTA principal. Fondo verde sólido + shadow-sm.
             * secondary   → Cancelar / volver. Sin fondo, texto muted.
             * destructive → Acción irreversible. Fondo rojo.
             * ghost       → Sin fondo. Botones de cierre de modal.
             * chip        → Selector entre opciones. Con borde.
             */
            intent: {
                primary: "text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm",
                secondary: "text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted",
                destructive: "text-sm font-bold text-destructive-foreground bg-destructive hover:bg-destructive/90",
                ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
                chip: "text-xs font-semibold border",
            },

            /**
             * size
             *
             * md   → Footer de modal (px-5 py-2.5)
             * sm   → Inline compacto en settings (h-9 px-3.5)
             * icon → Cuadrado fijo 32px. Siempre con intent="ghost" y X size={16}
             */
            size: {
                md: "px-5 py-2.5",
                sm: "h-9 px-3.5",
                icon: "w-8 h-8 shrink-0",
            },

            /**
             * active — solo para intent="chip"
             */
            active: {
                true: "bg-primary/10 text-primary border-primary/30",
                false: "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground",
            },
        },

        compoundVariants: [
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

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants { }

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