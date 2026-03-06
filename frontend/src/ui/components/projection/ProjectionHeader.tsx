import { ProjectionHorizonSelect } from "../controls/ProjectionHorizonSelect";

interface ProjectionHeaderProps {
    selectedMonths: number;
    onMonthsChange: (months: number) => void;
}

export const ProjectionHeader = ({ selectedMonths, onMonthsChange }: ProjectionHeaderProps) => (
    <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold text-slate-900">
                Proyección financiera
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
                Visualiza tu cashflow y balance acumulado en el tiempo
            </p>
        </div>

        <ProjectionHorizonSelect
            selectedMonths={selectedMonths}
            onMonthsChange={onMonthsChange}
        />
    </div>
);