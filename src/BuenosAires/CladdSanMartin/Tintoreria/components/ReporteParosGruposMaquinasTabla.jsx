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

function ReporteParosGruposMaquinasTabla({ Serie }) {

    let fila,filas=[];

      if(Serie!=0)
      {    
        Serie.map((elemento, index) => 
        {
            fila = {
                id: index,
                IdMaquina: (elemento.IdMaquina),
                TiempoParos: (elemento.TiempoParos),      
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
          field: 'IdMaquina', 
          headerName: 'Máquina',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
        { 
          field: 'TiempoParos', 
          headerName: 'Paros [Min]',
          flex: 1,   
          headerClassName: 'table-header',
          cellClassName: 'table-body',
        },
      ];

    return (      

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100%", mt:"0rem"}} columnSpacing={2} rowSpacing={1} columns={12}>
        

          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
          </Grid>

      </Grid> 

    );

}


export default ReporteParosGruposMaquinasTabla