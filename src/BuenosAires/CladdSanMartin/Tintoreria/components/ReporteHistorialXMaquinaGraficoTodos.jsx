import React from 'react';
import Chart from "react-apexcharts";
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

function ReporteHistorialXMaquinaGraficoTodos({ Serie, FechaInicio, FechaFin }) {

  let objProduccion=[];
  let DatosGraficoSinProduccion = []; 
  let DatosGraficoParos = [];
  let DatosGraficoEficiencia = [];
  
Serie.map((elemento) => {

const objProduccion = {
    x: elemento.IdMaquina,
    y: elemento.Eficiencia,
};
DatosGraficoEficiencia.push(objProduccion);
});

Serie.map((elemento) => {

  const objProduccion = {
      x: elemento.IdMaquina,
      y: elemento.PorcParos,
  };
  DatosGraficoParos.push(objProduccion);
});

  Serie.map((elemento) => {

    const objProduccion = {
        x: elemento.IdMaquina,
        y: elemento.PorcSinProduccion,
    };
    DatosGraficoSinProduccion.push(objProduccion);
});

  const data = {
      options: {
         
      fill: {
        opacity: [0.85, 0.85, 1],
        colors: ['#008FFB', '#FEB019','#00E396', '#FF4560'],
        },
        markers: {
          size: 3,
          // colors: '#000000',
          strokeColors: 'rgba(155, 155, 155, 0.8)f',
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 0.9,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: 3,
            sizeOffset: 3
          }
      },
      
      forecastDataPoints: {
        count: 0,
        fillOpacity: 0.5,
        strokeWidth: 2,
        dashArray: 4,
      },

      dataLabels: {
        enabled: false,
        enabledOnSeries: [1,2],
         
        formatter: function(val) {
          return Number(val).toLocaleString() ;
        },
        
        offsetY: -10,
        style: {
          fontSize: "10px",
          
        }
      }, 

      stroke: { //Líneas de gráficos
        
        width: [3, 3, 3,3],
        curve: 'smooth'
      },

      xaxis: {
              // tickPlacement: 'on', // Colocar las etiquetas sin superposición
              position: 'bottom',
              labels: {
                show: true,
                rotateAlways: true, // Rotar siempre las etiquetas
                offsetY: 0,
                // offsetX: 6, // Ajustar el espacio horizontal entre las etiquetas (8 píxeles en este ejemplo)
                style: {
                  colors: '#000000',
                  fontWeight: 'bold',
                  cssClass: 'apexcharts-xaxis-title',
                },
              },

              axisBorder: {
                show: true
              },

              axisTicks: {
                show: true
              },  
      },

      yaxis: [

        // Eficiencia -- EJE Y
        {
          seriesName: 'Eficiencia',
          opposite: false,

          title: {
            text: 'Eficiencia [%]',
            style: {
              color:  '#6d9c07',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#6d9c07'
        },

        axisTicks: {
          show: true
        },

        labels: {
          show: true,
          offsetX: -20,
          formatter: function(val) {
            return Number(val).toLocaleString();
          },
          style: {
            colors: '#6d9c07',
          },
        },
        },

        // PorcParos -- EJE Y
        {
          seriesName: 'PorcParos',
          opposite: true,

          title: {
            text: 'Paros [%]',
            style: {
              color:  '#e90f0f',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#e90f0f'
        },

        axisTicks: {
          show: true
        },

        labels: {
          show: true,
          offsetX: -20,
          formatter: function(val) {
            return Number(val).toLocaleString();
          },
          style: {
            colors: '#e90f0f',
          },
        },
        },

        // PorcSinProduccion -- EJE Y
        {
          seriesName: 'PorcSinProduccion',
          opposite: true,

          title: {
            text: 'Sin Produccion [%]',
            style: {
              color:  '#e09106',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#e09106'
        },

        axisTicks: {
          show: true
        },

        labels: {
          show: true,
          offsetX: -20,
          formatter: function(val) {
            return Number(val).toLocaleString();
          },
          style: {
            colors: '#e09106',
          },
        },
        },

    ],
      
    series: [
      
    {
      name: "Eficiencia [%]",
      type: 'line',
      color: '#6d9c07',
      data: DatosGraficoEficiencia
    },
    {
      name: "Paros [%]",
      type: 'line',
      color: '#e90f0f',
      data: DatosGraficoParos
    },  
    {
      name: "Sin Produccion [%]",
      type: 'line',
      color: '#e09106',
      data: DatosGraficoSinProduccion
    },    
      
    ],
    
    noData: {
      text: 'Esperando Datos...'
    }
    }
  }

return (
  <Box p={1} textAlign="center">  
      {/* Título del eje Y */}
      <Typography variant="subtitle1" color="#3b3c3e" fontSize={'20px'}><strong>
        Máquinas</strong>
      </Typography>
      {/* Gráfico */}  
        <Chart
            options={data.options}
            series={data.options.series} 
            type="line" 
            height="350"
          />
        </Box>
)
  
}
export default ReporteHistorialXMaquinaGraficoTodos;
