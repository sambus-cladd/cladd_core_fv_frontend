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
import ReporteProduccionFechaGrafico from './ReporteProduccionFechaGrafico';

function ReporteProduccionGraficoTabla({  Serie,ProduccionTotal,Labels,Titulo,FechaIncio,FechaFin}) {
  
    let FecharComienzo="/ / ";
    let FecharFinal  ="/ / ";

    let fila,filas=[];
    // let sumaAbril=0;

    if(FechaIncio!=null)FecharComienzo=FechaIncio.toLocaleDateString('en-GB')
    
    if(FechaFin!=null)FecharFinal= FechaFin.toLocaleDateString('en-GB')
  
      let ExcelFileName=FecharComienzo+"-"+FecharFinal
      console.log(Serie)

      if(Serie!=0)
      {    
        Serie.map((elemento, index) => 
        {
          // if(elemento.metros!=0)
          // {   
            // sumaAbril=sumaAbril + parseFloat(parseFloat(elemento.PESO).toFixed(2)) 
            // sumaFebrero=sumaFebrero+ parseInt(parseFloat(elemento.KILOSPRODFEBRERO).toFixed(0)) 
            const fecha = elemento.Fecha.split("T", 2)[0];
            const [anio, mes, dia] = fecha.split("-");
            fila = {
                id: index,
                Fecha: `${dia}-${mes}-${anio}`,
                Produccion: (elemento.Produccion).toLocaleString('de-DE'),       
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
          field: 'Produccion', 
          headerName: 'Producción [Kg.]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
      ];

    return (      

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={2} rowSpacing={1} columns={12}>
          
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReporteProduccionFechaGrafico Serie={Serie} />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6}>
          <hr />
            <Box display="flex" justifyContent="center">
              <h2 style={{ color: 'black' }}>Total Producción:  <span style={{ color: '#008FFB' }}>{parseFloat(ProduccionTotal).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Kg.</span></h2>
            </Box>
            <hr />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} filename={"Reporte Producción - "+ExcelFileName} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
              {/* <Footer ProduccionTotal={ProduccionTotal}  Bg= {'rgba(25, 118, 210,0.3)'}/> */}
          </Grid>

      </Grid> 

    );

}

//Barra de total de los datos sumados.
// function  Footer(props) {
//   const {  ProduccionTotal,Bg } =  props;
//   return (
//     <TableContainer>
//     <Table sx={{ width: '100%' }} size={'small'}   >
//     <TableHead >
//       <TableRow>
//           <TableCell sx={{ bgcolor: Bg, textAlign: 'right' }}>
//             <h2>
//                Total: &nbsp;  
//                {
//                  ProduccionTotal.toLocaleString('de-DE') 
//                } [kg]
//             </h2>
//           </TableCell>
//       </TableRow>
//     </TableHead>
//     </Table>
//   </TableContainer>
//   );
// }

export default ReporteProduccionGraficoTabla