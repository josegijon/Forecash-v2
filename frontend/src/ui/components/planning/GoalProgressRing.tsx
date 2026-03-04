interface GoalProgressRingProps {
    progress: number;
    savedAmount: number;
    goalAmount: number;
    label?: string;
    sublabel?: string;
    color?: "primary" | "violet" | "red";
    isDeficit?: boolean;
}

const CIRCLE_RADIUS = 28;
const CIRCLE_CENTER = 32;
const CIRCLE_CIRCUMFERENCE = 175.9;

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
    label = "Progreso Meta",
    sublabel,
    color = "primary",
    isDeficit = false,
}: GoalProgressRingProps) => {
    const ringColor = isDeficit ? COLOR_MAP.red : COLOR_MAP[color];
    const currencySymbol = "€";

    return (
        <div className="flex items-center gap-4 pt-2">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-slate-100"
                        cx={CIRCLE_CENTER}
                        cy={CIRCLE_CENTER}
                        fill="transparent"
                        r={CIRCLE_RADIUS}
                        stroke="currentColor"
                        strokeWidth="4"
                    />
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
                <span className={`absolute text-[11px] font-bold ${isDeficit ? "text-red-500" : "text-slate-700"}`}>
                    {progress}%
                </span>
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                {isDeficit ? (
                    <p className="text-xs text-red-500 font-medium">
                        Déficit de {Math.abs(savedAmount).toLocaleString("es-ES", { minimumFractionDigits: 2 })} {currencySymbol}
                    </p>
                ) : (
                    <p className="text-xs text-slate-500">
                        {sublabel ?? `${savedAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} ${currencySymbol} de ${goalAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} ${currencySymbol}`}
                    </p>
                )}
            </div>
        </div>
    );
};