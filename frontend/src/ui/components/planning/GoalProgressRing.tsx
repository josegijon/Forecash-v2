import { useCurrencySymbol } from "@/store";

interface GoalProgressRingProps {
    progress: number;
    savedAmount: number;
    goalAmount: number;
    label: string;
    sublabel?: string;
    color?: "primary" | "violet" | "red";
    isDeficit?: boolean;
}

const CIRCLE_RADIUS = 28;
const CIRCLE_CENTER = 32;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 175.93

const getDashOffset = (progress: number) =>
    CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * progress / 100);

const COLOR_MAP = {
    primary: "text-primary",
    violet: "text-violet-500",
    red: "text-red-400",
};

export const GoalProgressRing = ({
    progress,
    savedAmount,
    goalAmount,
    label,
    sublabel,
    color = "primary",
    isDeficit = false,
}: GoalProgressRingProps) => {
    const ringColor = isDeficit ? COLOR_MAP.red : COLOR_MAP[color];
    const currencySymbol = useCurrencySymbol();

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-32.5 h-32.5">
                <svg
                    viewBox="0 0 64 64"
                    role="img"
                    aria-label={`${label}: ${progress}% completado`}
                    className="absolute top-0 left-0 w-32.5 h-32.5"
                >
                    <circle
                        className={ringColor + " opacity-20"}
                        cx={CIRCLE_CENTER}
                        cy={CIRCLE_CENTER}
                        fill="transparent"
                        r={CIRCLE_RADIUS}
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                </svg>
                <svg
                    viewBox="0 0 64 64"
                    className="absolute top-0 left-0 -rotate-90 w-32.5 h-32.5"
                >
                    <circle
                        className={ringColor}
                        cx={CIRCLE_CENTER}
                        cy={CIRCLE_CENTER}
                        fill="transparent"
                        r={CIRCLE_RADIUS}
                        stroke="currentColor"
                        strokeDasharray={CIRCLE_CIRCUMFERENCE}
                        strokeDashoffset={getDashOffset(progress)}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center font-semibold ${isDeficit ? "text-red-500" : "text-foreground"}`}>
                    {progress}%
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                {isDeficit ? (
                    <p className="text-xs text-red-500 font-medium">
                        Déficit de {Math.abs(savedAmount).toLocaleString("es-ES", { minimumFractionDigits: 2 })} {currencySymbol}
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        {sublabel ?? `${savedAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} ${currencySymbol} de ${goalAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} ${currencySymbol}`}
                    </p>
                )}
            </div>
        </div>
    );
};