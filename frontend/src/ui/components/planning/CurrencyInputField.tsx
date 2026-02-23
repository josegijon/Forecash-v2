interface CurrencyInputFieldProps {
    label: string;
    value: number;
    currencySymbol: string;
    onChange: (value: number) => void;
}

export const CurrencyInputField = ({ label, value, currencySymbol, onChange }: CurrencyInputFieldProps) => {
    return (
        <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">{currencySymbol}</span>
                <input
                    className="bg-transparent border-none p-0 focus:ring-0 font-bold text-2xl w-full"
                    type="text"
                    value={value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => onChange(parseFloat(e.target.value.replace(/[^0-9.]/g, '')))}
                />
            </div>
        </div>
    )
}
