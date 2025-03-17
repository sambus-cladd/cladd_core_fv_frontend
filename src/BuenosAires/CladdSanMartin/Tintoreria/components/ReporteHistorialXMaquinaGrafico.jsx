import React from 'react'
import Chart from "react-apexcharts";
import { Box } from '@mui/system';

function ReporteHistorialXMaquinaGrafico({ Serie }) {

    let objProduccion=[];
    let DatosGraficoProduccion = [];
    let DatosGraficoEficiencia = [];
    

    Serie.map((elemento) => {
      const fecha = elemento.Fecha.split("T", 2)[0];
      const [anio, mes, dia] = fecha.split("-");

      const objProduccion = {
          x: `${dia}-${mes}-${anio}`,
          y: elemento.Kilos,
      };
      DatosGraficoProduccion.push(objProduccion);
  });

Serie.map((elemento) => {
  const fecha = elemento.Fecha.split("T", 2)[0];
  const [anio, mes, dia] = fecha.split("-");

  const objProduccion = {
      x: `${dia}-${mes}-${anio}`,
      y: elemento.Eficiencia,
  };
  DatosGraficoEficiencia.push(objProduccion);
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

          // PorcSinProduccion -- EJE Y
          {
            seriesName: 'Kilos',
            opposite: true,

            title: {
              text: 'Produccion [Kg]',
              style: {
                color:  '#008FFB',
              }
            },
            
          axisBorder: {
            show: true,
            color: '#008FFB'
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
              colors: '#008FFB',
            },
          },
          }, 

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

      ],
        
      series: [{
        name: "Produccion [Kg]",
        type: 'column',
        color: '#008FFB',
        data: DatosGraficoProduccion
      },     
      {
        name: "Eficiencia [%]",
        type: 'line',
        color: '#6d9c07',
        data: DatosGraficoEficiencia
      },  
      ],
      
      noData: {
        text: 'Esperando Datos...'
      }
      }
    }

  return (
    <Box p={1} textAlign="center">
          <Chart
              options={data.options}
              series={data.options.series} 
              type="line" 
              height="350"
            />
          </Box>
  )
}

export default ReporteHistorialXMaquinaGrafico