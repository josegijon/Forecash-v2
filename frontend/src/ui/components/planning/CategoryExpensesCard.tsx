import { CategoryDonutChart } from "./CategoryDonutChart";
import { CategoryLegend } from "./CategoryLegend";

interface CategoryExpensesCardProps {
    title: string;
}

export const CategoryExpensesCard = ({ title }: CategoryExpensesCardProps) => {
    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold">{title}</h3>
                </div>
            </div>

            <CategoryDonutChart />

            <CategoryLegend />

            {/* <div className="grid grid-cols-4 grid-rows-2 gap-2 h-40">
                <div className="col-span-2 row-span-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Vivienda</span>
                    <span className="font-bold text-indigo-600 ">65%</span>
                </div>
                <div className="col-span-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Comida</span>
                    <span className="font-bold text-emerald-600 ">20%</span>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-2 flex flex-col justify-end">
                    <span className="text-[8px] font-bold text-amber-400 uppercase">Ocio</span>
                    <span className="font-bold text-amber-600  text-xs">10%</span>
                </div>
                <div className="bg-slate-500/20 border border-slate-500/30 rounded-lg p-2 flex flex-col justify-end">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Otros</span>
                    <span className="font-bold text-slate-600 text-xs">5%</span>
                </div>
            </div> */}
        </div>
    )
}
