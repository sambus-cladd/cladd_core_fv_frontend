import * as React from 'react'; 
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import DataGridTable from '../../../../components/DataGrid/DataGridTable';

function ReporteProduccionTabla({  Serie,Labels,Titulo,FechaIncio,FechaFin}) {
    let FecharComienzo="/ / ";
    let FecharFinal  ="/ / ";
    let fila,filas=[];
    let sumaEnero=0;
    let sumaFebrero=0;
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
            sumaEnero=sumaEnero+ parseInt(parseFloat(elemento.KILOSPRODENERO).toFixed(0)) 
            sumaFebrero=sumaFebrero+ parseInt(parseFloat(elemento.KILOSPRODFEBRERO).toFixed(0)) 
          fila= {
                  id: index,
                  // Fecha:(elemento.fecha.split("T",2)[0]),       
                  CODIGO:(elemento.CODIGO),
                  BDASPRODENERO:(parseInt(parseFloat(elemento.BDASPRODENERO).toFixed(0)).toLocaleString('de-DE')),
                  BDASPRODFEBRERO:(parseInt(parseFloat(elemento.BDASPRODFEBRERO).toFixed(0)).toLocaleString('de-DE')),
                  BDASPRODMARZO:(parseInt(parseFloat(elemento.BDASPRODMARZO).toFixed(0)).toLocaleString('de-DE') ),            
                  KILOSPRODENERO:(parseInt(parseFloat(elemento.KILOSPRODENERO).toFixed(0)).toLocaleString('de-DE')),
                  KILOSPRODFEBRERO:(parseInt(parseFloat(elemento.KILOSPRODFEBRERO).toFixed(0)).toLocaleString('de-DE')),
                  KILOSPRODMARZO:(parseInt(parseFloat(elemento.KILOSPRODMARZO).toFixed(0)).toLocaleString('de-DE')),
                }
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
          field: 'CODIGO', 
          headerName: 'MAQUINA',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'BDASPRODENERO', 
          headerName: 'LOTES ENERO',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'BDASPRODFEBRERO', 
          headerName: 'LOTES FEBRERO',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'KILOSPRODENERO', 
          headerName: 'KILOS ENERO',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'KILOSPRODFEBRERO', 
          headerName: 'KILOS FEBRERO',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
      ];

    return (        
      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={2} rowSpacing={1} columns={12}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <Card sx={{ minWidth: 275, background: "linear-gradient(90deg, rgba(9,9,121,0.333858543417367) 35%, rgba(0,212,255,0.46271008403361347) 100%)"}}>
                PRODUCCION ENERO:<br/> {sumaEnero.toLocaleString('de-DE')}
                </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <Card sx={{ minWidth: 275, background: "linear-gradient(90deg, rgba(9,9,121,0.333858543417367) 35%, rgba(0,212,255,0.46271008403361347) 100%)"}}>
                PRODUCCION FEBRERO: <br/> {sumaFebrero.toLocaleString('de-DE')}
                </Card>
            </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} filename={"Reporte Producción - "+ExcelFileName} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
          </Grid>
      </Grid> 

    );

}

export default ReporteProduccionTabla