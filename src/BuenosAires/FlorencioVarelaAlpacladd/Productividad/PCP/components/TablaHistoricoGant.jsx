import { React, useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Chart from "react-apexcharts";

import { GetHISTORICOGANTT } from '../API/APIFunctions';

import DataGridTable from '../../../../../components/DataGrid/DataGridTable';
import { Button, Hidden } from "@mui/material";
import { renderActionsCell } from "@mui/x-data-grid";

const TablaGantt = ({handleChange}) => {
  const [DatosGantt, setDatosGantt] = useState([]);


  /* INICIO - CONEXION DATOS GANTT */
  useEffect(() => {
    const CargaGantt = async () => {
      try {
        const response = await GetHISTORICOGANTT();
        setDatosGantt(response.Dato);
        // console.log("Respuesta:", response);
      } catch (error) {
        console.error("Error al obtener las datos", error);
      }
    }
    CargaGantt();
  }, []);
  /* FIN - CONEXION DATOS CONERA*/


  return (
    <Grid container sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', width: "100vw" }} columnSpacing={1} rowSpacing={1} columns={12}>
      <Grid item xs={12} sm={12} md={12} lg={12} >
        <TablaHistoricoGantt Serie={DatosGantt} handleChange={handleChange} />
      </Grid>
    </Grid>
  );
}

function getDatosValidos(serie) {
  if (Array.isArray(serie)) {
    if (Array.isArray(serie[0])) {
      return serie[0];
    }
    return serie;
  }
  return [];
}

function TablaHistoricoGantt({ Serie, handleChange }) {
  let fila, filas = [];
  const datos = getDatosValidos(Serie);

  if (datos.length !== 0) {
    datos.map((elemento, index) => {
      fila = {
        id: index,
        Orden: elemento.orden,
        Maquina: elemento.maquina,
        MaquinaProceso: elemento.maquina_proceso,
        Proceso: elemento.proceso,
        Color: elemento.color,
        Articulo: elemento.articulo,
        Metros: elemento.metros,
        HorasT: elemento.horas_total,
        HoraInicio: dayjs(elemento.hora_inicio).format('DD-MM-YYYY HH:mm'),
        HoraFin: dayjs(elemento.hora_fin).format('DD-MM-YYYY HH:mm')
      };
      filas.push(fila);
    });
  }

  const columns = [
    {
      field: 'Orden',
      headerName: 'Orden',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
      renderCell: (params) => (
        <div
          onClick={() => {
            handleChange(null,7, params.row.Orden, params.row.Articulo, params.row.Maquina)
          }}
          style={{ cursor: 'pointer' }} // Esto hará que el mouse muestre una mano
        >
          {params.row.Orden}
        </div>
      )
    },
    {
      field: 'Maquina',
      headerName: 'Maquina',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'MaquinaProceso',
      headerName: 'Maquina Proceso',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Proceso',
      headerName: 'Proceso',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Color',
      headerName: 'Color',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Articulo',
      headerName: 'Articulo',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Metros',
      headerName: 'Metros',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'HorasT',
      headerName: 'Horas Total',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'HoraInicio',
      headerName: 'Hora Inicio',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'HoraFin',
      headerName: 'Hora Fin',
      flex: 1,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },

  ];

  return (

    <Grid container sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', width: "100vw", height: "90%" }} columnSpacing={1} rowSpacing={1} columns={12}>

      <Grid item xs={12} sm={12} md={12} lg={12} >
        <DataGridTable rows={filas} columns={columns} filename={"- HISTORICO GANTT "} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg={'rgba(25, 118, 210,0.3)'} />
      </Grid>

    </Grid>

  );

}



export default TablaGantt;