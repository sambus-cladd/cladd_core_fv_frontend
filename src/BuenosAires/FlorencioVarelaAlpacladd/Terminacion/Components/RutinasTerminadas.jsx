import React, { useEffect, useState } from 'react'
import DataGridTable from '../../../../components/DataGrid/DataGridTable'
import { getRutinasTerminadas } from '../../API/APIFunctions';

const RutinasTerminadas = () => {
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'lote', headerName: 'Lote', with: 100},
        { field: 'rutina', headerName: 'Rutina', width: 150 },
        { field: 'articulo_final', headerName: 'Articulo', width: 100},
        { field: 'resultado', headerName:'Resultado', width:150},
        { field: 'ancho_sin_lavar_cal', headerName: 'Ancho Sin Lavar', width: 180 },
        { field: 'peso_sin_lavar_cal', headerName: 'Peso Sin Lavar', width: 180 },
        { field: 'peso_lavado_cal', headerName: 'Peso Lavado', width: 150 },
        { field: 'recuento_urdido_cal', headerName: 'Recuento Urdido', width: 180 },
        { field: 'recuento_trama_cal', headerName: 'Recuento Trama', width: 180 },
        { field: 'pasadas_por_costo_cal', headerName: 'Pasadas por Costo', width: 180 },
        { field: 'estabilidad_urdido_cal', headerName: 'Estabilidad Urdido', width: 180 },
        { field: 'estabilidad_trama_cal', headerName: 'Estabilidad Trama', width: 180 },
        { field: 'ancho_lavado_cal', headerName: 'Ancho Lavado', width: 150 },
        { field: 'predistorsion_izq', headerName: 'Predistorsión Izq', width: 180 },
        { field: 'predistorsion_der', headerName: 'Predistorsión Der', width: 180 },
        { field: 'movimiento_izq', headerName: 'Movimiento Izq', width: 180 },
        { field: 'movimiento_der', headerName: 'Movimiento Der', width: 180 },
        { field: 'elasticidad_sin_lavar_cal', headerName: 'Elasticidad Sin Lavar', width: 180 },
        { field: 'elasticidad_lavada_cal', headerName: 'Elasticidad Lavada', width: 180 },
        { field: 'deformacion_lavada_cal', headerName: 'Deformación Lavada', width: 180 },
        { field: 'elmendorf_urdido_sin_lavar_cal', headerName: 'Elmendorf Urdido Sin Lavar', width: 220 },
        { field: 'elmendorf_trama_sin_lavar_cal', headerName: 'Elmendorf Trama Sin Lavar', width: 220 },
        { field: 'desliz_costura_ut_cal', headerName: 'Desliz Costura UT', width: 180 },
        { field: 'desliz_costura_tu_cal', headerName: 'Desliz Costura TU', width: 180 },
        { field: 'rigidez_cal', headerName: 'Rigidez', width: 150 },
        { field: 'fecha_registro', headerName: 'Fecha Registro', width: 150 }
    ];

    async function fetchRutinasTerminadas() {
        try {
            let respuesta = await getRutinasTerminadas();
            if(respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 0){
                setRows(respuesta.data[0]);
            }
            else {
                setRows([]);
            }
        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        fetchRutinasTerminadas()
        return () => {
        }
    }, [])

    return (
        <>
        <DataGridTable
        rows={rows}
        columns={columns}
        filename={"Rutinas Finalizadas al " + new Date().toLocaleDateString()}
        >

        </DataGridTable>
        </>
    )
}

export default RutinasTerminadas