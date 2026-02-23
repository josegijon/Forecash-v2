// Contenido: Componente que renderiza la leyenda del gráfico: una lista vertical/horizontal con el indicador de color (bolita/cuadrado), el nombre de la categoría, el porcentaje y opcionalmente el monto. Recibe como props el mismo array de categorías.

export const CategoryLegend = () => {
    return (
        <div className="bg-gray-100 rounded-lg p-4">
            <span className="text-gray-400">[Leyenda de categorías]</span>
        </div>
    )
}
