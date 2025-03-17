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
import ReporteParosFechaGrafico from './ReporteParosFechaGrafico';

function ReporteProduccionGraficoTabla({Serie,TiempoPTotal,Titulo,FechaIncio,FechaFin}) {
  
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
                Maquina: elemento.Maquina,
                TiempoParo: elemento.TiempoDeParo.toLocaleString(),       
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
          field: 'Maquina', 
          headerName: 'Máquina',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'TiempoParo', 
          headerName: 'Tiempo de Paro [Min.]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
      ];

    return (      

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={2} rowSpacing={1} columns={12}>
          
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReporteParosFechaGrafico Serie={Serie} />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6}>
            <hr />
            <Box display="flex" justifyContent="center">
              <h2 style={{ color: 'black' }}>Total Tiempo de Paros:  <span style={{ color: '#de721a' }}>{parseInt(TiempoPTotal).toLocaleString()} Minutos</span></h2>
            </Box>
            <hr />
          </Grid>
  
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} filename={"Reporte Producción - "+ExcelFileName} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
              {/* <Footer TiempoTotalFooter={TiempoPTotal}  Bg= {'rgba(25, 118, 210,0.3)'}/> */}
          </Grid>

      </Grid> 

    );

}

//Barra de total de los datos sumados.
// function  Footer(props) {
//   const {  TiempoTotalFooter,Bg } =  props;
//   return (
//     <TableContainer>
//     <Table sx={{ width: '100%' }} size={'small'}   >
//     <TableHead >
//       <TableRow>
//           <TableCell sx={{ bgcolor: Bg, textAlign: 'right' }}>
//             <h2>
//                Total: &nbsp;  
//                {
//                  TiempoTotalFooter.toLocaleString('de-DE') 
//                } [Min.]
//             </h2>
//           </TableCell>
//       </TableRow>
//     </TableHead>
//     </Table>
//   </TableContainer>
//   );
// }

export default ReporteProduccionGraficoTabla