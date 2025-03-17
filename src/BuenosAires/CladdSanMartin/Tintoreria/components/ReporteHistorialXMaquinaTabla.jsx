import * as React from 'react'; 
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import DataGridTable from '../../../../components/DataGrid/DataGridTable';
// import ReporteProduccionFechaGrafico from './ReporteProduccionFechaGrafico';

function ReporteHistorialXMaquinaTabla({  Serie,ProduccionTotal,Labels,Titulo,FechaIncio,FechaFin}) {

    let fila,filas=[];

      if(Serie!=0)
      {    
        Serie.map((elemento, index) => 
        {
            const fecha = elemento.Fecha.split("T", 2)[0];
            const [anio, mes, dia] = fecha.split("-");

            fila = {
                id: index,
                Fecha: `${dia}-${mes}-${anio}`,
                Maquina: (elemento.IdMaquina),
                Kilos: (elemento.Kilos).toLocaleString('de-DE'),
                Eficiencia: (elemento.Eficiencia),      
            };
                filas.push(fila);
          }
        )
      }
   
      const columns = [
        { 
          field: 'id', 
          headerName: 'ID', 
          flex: 1,
          width: 1,
          headerClassName: 'table-header',
          cellClassName: 'table-body',
          hide: true 
        },
        { 
          field: 'Fecha', 
          headerName: 'Fecha',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'Maquina', 
          headerName: 'Máquina',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'Kilos', 
          headerName: 'Producción [Kg.]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'Eficiencia', 
          headerName: 'Eficiencia [%]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
      ];

    return (      

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={2} rowSpacing={1} columns={12}>
          
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReporteProduccionFechaGrafico Serie={Serie} />
          </Grid> */}

          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
          </Grid>

      </Grid> 

    );

}


export default ReporteHistorialXMaquinaTabla