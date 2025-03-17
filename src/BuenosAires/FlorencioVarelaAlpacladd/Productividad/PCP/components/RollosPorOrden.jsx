import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './DocPedidoRollo';
import ReactDOM from 'react-dom';
import { getStockRollosXOrden } from '../../../API/APIFunctions';
const RollosPorOrden = ({ orden, articulo, maquina }) => {
    const [rollos, setRollos] = useState([]);

    async function fetchRollosDeOrden(orden) {
        try {
            const response = await getStockRollosXOrden(orden);
            
            // Si hay datos válidos en la respuesta
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const dataSinFechaRegistro = response.data.map(({ fecha_registro, ...resto }) => resto);
                setRollos(dataSinFechaRegistro); // Actualiza el estado con los datos filtrados
            } else {
                setRollos([]); // Si no hay datos, asegura que el estado se limpie
            }
        } catch (error) {
            console.error(error);
            setRollos([]); // En caso de error, también limpia el estado
        }
    }
    

    useEffect(() => {
        fetchRollosDeOrden(orden);
    }, [orden]); // Agregamos orden como dependencia

    function handleprint() {

        const newWindow = window.open('', '_blank');
        const rootElement = newWindow.document.createElement('div');
        newWindow.document.body.appendChild(rootElement);
        const reactRoot = ReactDOM.createRoot(rootElement);
        reactRoot.render(
            <>
                <PDFViewer width="100%" height="600">
                    <MyDocument orden={orden} maquina={maquina} articulo={articulo} rollos={rollos} />
                </PDFViewer>
            </>
        );

    }

    return (
        <>
            <div>
                <h1>Orden: {orden}</h1>
                <ul>
                    {rollos && Array.isArray(rollos) && rollos.length > 0
                        ? rollos.map((rollo) => <li key={rollo.id}>{rollo.rollo}</li>)
                        : <li>No hay rollos disponibles</li>
                    }
                </ul>
            </div>
            <div>   
                <button onClick={handleprint}>Imprimir</button>
            </div>
        </>
    );
};

export default RollosPorOrden;
