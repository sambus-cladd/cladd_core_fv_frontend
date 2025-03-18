import { useState, useEffect } from 'react'; 
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

//Para exportar los datos de la tabla a excel .xlsx
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import { getTablaArticulosDetalles } from '../API/APIFunctions';
import DataGridTable from '../DataGrid/DataGridTable';
import { getTablaArticulosDetalles } from '../API/APIFunctions';

// import DataGridTable from '../../../../../../components/DataGrid/DataGridTable';

function TablaArtDetalles() {

    const [Serie, setSerie] = useState([]);

    useEffect(() =>{
        const DatosArt = async () => {
            try {
                const response = await getTablaArticulosDetalles()
                setSerie(response.Dato);
                console.log("respuesta: ", response.Dato);
            } catch (error) {
                console.error("Error al obtener datos", error)
            }
        }
        DatosArt();
    }, [])

    let fila,filas=[];
    

      if(Serie!=0)
    {    
      Serie.map((elemento, index) => 
      {
        fila= {
                id: index,
                Articulo: elemento.articulo,
                Urdimbre: elemento.urdimbre,
                Trama: elemento.trama,
                Hilos: elemento.hilos,
                PXCM: elemento.pas_x_cm,
                Peine: elemento.peine
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
        field: 'Articulo', 
        headerName: 'Articulo',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'Urdimbre', 
        headerName: 'Urdimbre',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'Trama', 
        headerName: 'Trama',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'Hilos', 
        headerName: 'Hilos',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'PXCM', 
        headerName: 'Pas x Cm',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'Peine', 
        headerName: 'Peine',
        flex: 1,   
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },     
    ];

    return ( 

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', margin: "0px 15px", marginTop:"10px"}} columnSpacing={1} rowSpacing={1} columns={12}>        
          
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridTable  rows={filas} columns={columns} filename={"- Listado de Articulos"} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}/>
          </Grid>

      </Grid> 
      
    );

}

export default TablaArtDetalles