
interface GoalProgressRingProps {
    progress: number; // Progreso en porcentaje (0-100)
    savedAmount: number; // Cantidad ahorrada
    goalAmount: number; // Cantidad objetivo
}

export const GoalProgressRing = ({ progress, savedAmount, goalAmount }: GoalProgressRingProps) => {
    return (
        <div className="flex items-center gap-4 pt-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-slate-100"
                        cx="32" cy="32" fill="transparent" r="28"
                        stroke="currentColor"
                        strokeWidth="4">
                    </circle>

                    <circle
                        className="text-primary" cx="32" cy="32" fill="transparent" r="28"
                        stroke="currentColor"
                        strokeDasharray="175.9"
                        strokeDashoffset={175.9 - (175.9 * progress / 100)}
                        strokeWidth="4">
                    </circle>
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
