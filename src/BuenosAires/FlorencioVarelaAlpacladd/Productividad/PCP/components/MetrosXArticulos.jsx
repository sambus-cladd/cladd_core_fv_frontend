import { React, useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Chart from "react-apexcharts";

import  { GetMetrosxArticulo } from '../API/APIFunctions';

import DataGridTable from '../../../../../components/DataGrid/DataGridTable';
import { Button } from "@mui/material";

const MetrosXArticulos = () => {
    const [Data, setData] = useState([]);
    

    /* INICIO - CONEXION DATOS GANTT */
    useEffect(() => {
        const CargaGantt = async () => {
            try {
                const response = await GetMetrosxArticulo();
                setData(response.Dato);
                console.log("Respuesta:", response);
            } catch (error) {
                console.error("Error al obtener las datos", error);
            }
        }
        CargaGantt();
    }, []);
    /* FIN - CONEXION DATOS CONERA*/


    return ( 
        <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100vw"}} columnSpacing={1} rowSpacing={1} columns={12}> 
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <GraficoMetrosxArticulo Serie={Data} />
            </Grid>       
            <Grid item xs={12} sm={12} md={12} lg={12} >
                <TablaMetrosXArticulos Serie={Data} />  
            </Grid>
        </Grid> 
    ); 
}

function TablaMetrosXArticulos({ Serie }) {
  let filas = [];
  const datos = Array.isArray(Serie[0]) ? Serie[0] : Serie;

  if (datos.length !== 0) {
    datos.filter(elemento => elemento.articulo && elemento.metros > 0)
      .map((elemento, index) => {
        filas.push({
          id: index,
          Articulo: elemento.articulo,
          Metros: elemento.metros 
        });
      });
  }
 
    const columns = [
      { 
        field: 'id', 
        headerName: 'ID', 
        flex: 1,
        minWidth:100,
        headerClassName: 'table-header',
        cellClassName: 'table-body',
        hide: true 
      },
      { 
        field: 'Articulo', 
        headerName: 'Articulo', 
        flex: 1,
        minWidth:100,
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      },
      { 
        field: 'Metros', 
        headerName: 'Metros',
        flex: 1, 
        minWidth:100,  
        headerClassName: 'table-header',
        cellClassName: 'table-body',
      }
    ];

    return ( 

      <Grid container sx={{display: 'flex', alignItems: 'stretch', justifyContent:'center', width:"100vw",height:"90%"}} columnSpacing={1} rowSpacing={1} columns={12}>        
          
          <Grid item xs={12} sm={12} md={12} lg={12} >
              <DataGridTable   rows={filas} columns={columns} rowHeight={50} filename={"- METROS X ARTICULO "} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg= {'rgba(25, 118, 210,0.3)'}  />
          </Grid>

      </Grid> 
      
    );

}

function GraficoMetrosxArticulo({ Serie }) {
  const datos = Array.isArray(Serie[0]) ? Serie[0] : Serie;
  if (!datos || !Array.isArray(datos)) {
    return (
      <Box p={2} textAlign="center">
        <p>Esperando datos para mostrar gráfico...</p>
      </Box>
    );
  }

  let DatosGrafico = [];
  datos.forEach(elemento => {
    const obj = {
      x: elemento.articulo,
      y: elemento.metros
    };
    DatosGrafico.unshift(obj); // Agregar al inicio para invertir el orden
  });
  
  // Configuración de los datos del gráfico
  const data = {
    options: {
      fill: {
        opacity: [0.85, 0.85, 1],
      },
      animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
              speed: 1000,
          },
      },
      markers: {
        size: 3,
        strokeColors: 'rgba(155, 155, 155, 0.8)',
        strokeWidth: 2,
        strokeOpacity: 0.9,
        fillOpacity: 0.9,
        shape: "circle",
        hover: {
          size: 3,
          sizeOffset: 3
        }
      },
      title: {
        text: 'Metros',
        align: 'left',
        offsetX: 110,
        style: {
          fontSize: '18px'
        }
      },
      forecastDataPoints: {
        count: 0,
        fillOpacity: 0.5,
        strokeWidth: 2,
        dashArray: 4,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        formatter: function(val) {
          return Number(val).toLocaleString();
        },
        offsetY: -10,
        offsetX: -3, 
        style: {
          fontSize: "12px",
          zIndex: 0 
        }
      },
      stroke: {
        width: [3, 3],
        curve: 'smooth'
      },
      xaxis: {
        position: 'bottom',
        labels: {
          show: true,
          rotateAlways: true,
          offsetY: 0,
          style: {
            colors: '#000000',
          },
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      },
      yaxis: [
        {
          opposite: false,
          axisBorder: {
            show: true,
            color: '#0B6477'
          },
          axisTicks: {
            show: true
          },
          labels: {
            show: true,
            offsetX: -10,
            formatter: function(val) {
              return Number(val).toLocaleString();
            },
            style: {
              colors: '#0B6477',
            },
          },
          forceNiceScale: true,
        }
      ],
      series: [
        {
          name: "Metros x Articulos",
          type: 'line',
          color: '#0B6477',
          data: DatosGrafico
        },
      ],
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        y: {
          formatter: function(val) {
            return Number(val).toLocaleString();
          }
        }
      },
      noData: {
        text: 'Esperando Datos...'
      }
    }
  };
  
  return (
    <Box p={1} textAlign="center">
      <Chart
        options={data.options}
        series={data.options.series}
        type="line"
        height="400" 
      />
    </Box>
  );
}



export default MetrosXArticulos;