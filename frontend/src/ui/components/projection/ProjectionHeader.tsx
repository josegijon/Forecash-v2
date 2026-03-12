import { ProjectionHorizonSelect } from "../controls/ProjectionHorizonSelect";

interface ProjectionHeaderProps {
    selectedMonths: number;
    onMonthsChange: (months: number) => void;
}

export const ProjectionHeader = ({ selectedMonths, onMonthsChange }: ProjectionHeaderProps) => (
    <div className="flex items-center justify-between">
        <ProjectionHorizonSelect
            selectedMonths={selectedMonths}
            onMonthsChange={onMonthsChange}
        />
    </div>
);