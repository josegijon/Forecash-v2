import { Button } from "@/ui/primitives/Button";
import type { Frequency } from "@core";

const frequencyLabels: Record<Frequency, string> = {
    once: "Una vez",
    monthly: "Mensual",
    bimonthly: "Bimestral",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    annual: "Anual",
};

interface FrequencySelectorProps {
    value: Frequency;
    onChange: (f: Frequency) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => (
    <div>
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Frecuencia
        </label>

        <div className="grid grid-cols-3 gap-2">
            {(Object.entries(frequencyLabels) as [Frequency, string][]).map(([freq, label]) => (
                <Button
                    type="button"
                    intent="chip"
                    active={value === freq}
                    onClick={() => onChange(freq)}
                >
                    {label}
                </Button>
            ))}
        </div>
    </div>
);