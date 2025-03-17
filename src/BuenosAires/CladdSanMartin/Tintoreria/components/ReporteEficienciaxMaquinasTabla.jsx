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
import ReporteEficienciaxMaquinasGrafico from './ReporteEficienciaxMaquinasGrafico';

function ReporteEficienciaxMaquinasTabla({Serie,Titulo,FechaIncio,FechaFin}) {
  
    let FecharComienzo="/ / ";
    let FecharFinal  ="/ / ";

    let fila,filas=[];

    if(FechaIncio!=null)FecharComienzo=FechaIncio.toLocaleDateString('en-GB')
    
    if(FechaFin!=null)FecharFinal= FechaFin.toLocaleDateString('en-GB')
  
      let ExcelFileName=FecharComienzo+"-"+FecharFinal
      console.log(Serie)

      if(Serie!==0)
      {    
        Serie.map((elemento, index) => 
        {   
          /* El "Serie", trae el objAux del archivo ReporteParosxFechas donde ahí se guardo la consulta a la API de 
          acuerdo a las fechas seleccionadas. En ese mismo archivo guardamos cada campo (Maquina y TiempoDeParo)

          */
            fila = {
                id: index,
                Barcada: elemento.Barcada,
                TiempoTeorico: elemento.TiempoTeorico.toLocaleString(),
                TiempoReal: elemento.TiempoReal.toLocaleString(),
                TiempoParo: elemento.TiempoParo.toLocaleString(), 
                Eficiencia: elemento.Eficiencia.toFixed(2),   
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
          field: 'Barcada', 
          headerName: 'Barcada',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'TiempoTeorico', 
          headerName: 'Tiempo Teorico [Min.]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'TiempoReal', 
          headerName: 'Tiempo Real [Min.]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'TiempoParo', 
          headerName: 'Tiempo Paro [Min.]',
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
          
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReporteEficienciaxMaquinasGrafico Serie={Serie} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} filename={"Reporte Eficiencia - "+ExcelFileName} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>   
          </Grid>

      </Grid> 

    );

}

export default ReporteEficienciaxMaquinasTabla