interface GoalProgressRingProps {
    progress: number; // Progreso en porcentaje (0-100)
    savedAmount: number; // Cantidad ahorrada
    goalAmount: number; // Cantidad objetivo
}

const CIRCLE_RADIUS = 28;
const CIRCLE_CENTER = 32;
const CIRCLE_CIRCUMFERENCE = 175.9;

const getDashOffset = (progress: number) =>
    CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * progress / 100);

export const GoalProgressRing = ({ progress, savedAmount, goalAmount }: GoalProgressRingProps) => {
    return (
        <div className="flex items-center gap-4 pt-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
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
                        className="text-primary"
                        cx={CIRCLE_CENTER}
                        cy={CIRCLE_CENTER}
                        fill="transparent"
                        r={CIRCLE_RADIUS}
                        stroke="currentColor"
                        strokeDasharray={CIRCLE_CIRCUMFERENCE}
                        strokeDashoffset={getDashOffset(progress)}
                        strokeWidth="4"
                    />
                </svg>

                <span className="absolute text-[11px] font-bold">
                    {progress}%
                </span>
            </div>

            <div>
                <p className="text-sm font-semibold">Progreso Meta</p>
                <p className="text-xs text-slate-500">
                    ${savedAmount} ahorrados de ${goalAmount}
                </p>
            </div>
        </div>
    )
}