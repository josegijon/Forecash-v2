import { Plus } from "lucide-react"

export const SidebarSection = () => {
    const id = 1;

    return (
        <div className="pt-6">
            <div className="px-3 mb-3 flex justify-between items-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Escenarios
                </p>
                <button
                    // onClick={handleCreateScenario}
                    className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 hover:text-blue-700 transition-all flex items-center justify-center hover:scale-105 hover:shadow-md shadow-blue-200/50 cursor-pointer"
                    title="Crear nuevo escenario"
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className='flex flex-col gap-1'>
                {/* {allScenarios.map((scenario) => ( */}
                <button
                    // key={scenario.id}
                    // onClick={() => handleSelectScenario(scenario.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all truncate group cursor-pointer 
                                ${id === 1
                            ? 'bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                    }
                >
                    <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full transition-all 
                                    ${id === 1
                                ? 'bg-blue-600 shadow-sm shadow-blue-300'
                                : 'bg-slate-300 group-hover:bg-slate-400'
                            }
                                    `
                        }></span>
                        <span className="truncate">Escenario 1</span>
                    </div>
                </button>
                {/* ))} */}
            </div>
        </div>
    )
}
