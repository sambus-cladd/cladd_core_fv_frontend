import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './DocPedidoRollo';
import ReactDOM from 'react-dom';
import { getStockRollosXOrden } from '../../../API/APIFunctions';

function getDatosValidos(serie) {
  if (Array.isArray(serie)) {
    if (Array.isArray(serie[0])) {
      return serie[0];
    }
    return serie;
  }
  return [];
}

const RollosPorOrden = ({ orden, articulo, maquina }) => {
    const [rollos, setRollos] = useState([]);

    async function fetchRollosDeOrden(orden) {
        try {
            const response = await getStockRollosXOrden(orden);
            console.log('Respuesta de la API:', response.data);
            const datos = getDatosValidos(response.data);
            console.log('Datos válidos:', datos);
            if (datos.length > 0) {
                const dataSinFechaRegistro = datos.map(({ fecha_registro, ...resto }) => resto);
                setRollos(dataSinFechaRegistro);
                console.log('Rollos seteados:', dataSinFechaRegistro);
            } else {
                setRollos([]);
                console.log('No hay datos, rollos seteados como array vacío');
            }
        } catch (error) {
            console.error(error);
            setRollos([]);
        }
    }
    

    useEffect(() => {
        console.log('Orden recibida:', orden);
        fetchRollosDeOrden(orden);
    }, [orden]);

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
                <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '1.3em' }}>Orden: {orden}</h1>
                <ul style={{ color: '#222', fontWeight: 'bold', fontSize: '1.1em' }}>
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
