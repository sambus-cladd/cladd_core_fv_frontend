import React from 'react'
import Chart from "react-apexcharts";
import { Box } from '@mui/system';

function ReporteHistorialXMaquinaTiemposGrafico({ Serie }) {

    let objProduccion=[];
    let DatosGraficoSinProduccion = []; let DatosGraficoParos = [];
    let DatosGraficoProduccion = []; let DatosGraficoDisponible = [];
    

    Serie.map((elemento) => {
      const fecha = elemento.Fecha.split("T", 2)[0];
      const [anio, mes, dia] = fecha.split("-");

      const objProduccion = {
          x: `${dia}-${mes}-${anio}`,
          y: elemento.TiempoSinProduccion,
      };
      DatosGraficoSinProduccion.push(objProduccion);
  });

  Serie.map((elemento) => {
    const fecha = elemento.Fecha.split("T", 2)[0];
    const [anio, mes, dia] = fecha.split("-");

    const objProduccion = {
        x: `${dia}-${mes}-${anio}`,
        y: elemento.TiempoParos,
    };
    DatosGraficoParos.push(objProduccion);
});

Serie.map((elemento) => {
  const fecha = elemento.Fecha.split("T", 2)[0];
  const [anio, mes, dia] = fecha.split("-");

  const objProduccion = {
      x: `${dia}-${mes}-${anio}`,
      y: elemento.TiempoReal,
  };
  DatosGraficoProduccion.push(objProduccion);
});

// Serie.map((elemento) => {
//   const fecha = elemento.Fecha.split("T", 2)[0];
//   const [anio, mes, dia] = fecha.split("-");

//   const objProduccion = {
//       x: `${dia}-${mes}-${anio}`,
//       y: elemento.TiempoDisponible,
//   };
//   DatosGraficoDisponible.push(objProduccion);
// });


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
          
          width: [0, 3, 3,3],
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

          // TiempoSinProduccion -- EJE Y
          {
            seriesName: 'TiempoSinProduccion',
            opposite: false,

            title: {
              text: 'Sin Produccion [Min]',
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
          
          // TiempoParos -- EJE Y
          {
            seriesName: 'TiempoParos',
            opposite: true,

            title: {
              text: 'Paros [Min]',
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

          // TiempoReal -- EJE Y
          {
            seriesName: 'TiempoReal',
            opposite: false,

            title: {
              text: 'Tiempo Real [Min]',
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
            // TiempoDisponible -- EJE Y
            // {
            //   seriesName: 'TiempoDisponible',
            //   opposite: true,
  
            //   title: {
            //     text: 'Tiempo Disponible [Min]',
            //     style: {
            //       color:  '#008FFB',
            //     }
            //   },
              
            // axisBorder: {
            //   show: true,
            //   color: '#008FFB'
            // },
  
            // axisTicks: {
            //   show: true
            // },
  
            // labels: {
            //   show: true,
            //   offsetX: -20,
            //   formatter: function(val) {
            //     return Number(val).toLocaleString();
            //   },
            //   style: {
            //     colors: '#008FFB',
            //   },
            // },
            // },

      ],
        
      series: [{
        name: "Sin Produccion [Min]",
        type: 'column',
        color: '#e09106',
        data: DatosGraficoSinProduccion
      },   
      {
        name: "Paros [Min]",
        type: 'column',
        color: '#e90f0f',
        data: DatosGraficoParos
      },  
      {
        name: "Tiempo Real [Min]",
        type: 'column',
        color: '#6d9c07',
        data: DatosGraficoProduccion
      },  
      // {
      //   name: "Tiempo Disponible [Min]",
      //   type: 'line',
      //   color: '#008FFB',
      //   data: DatosGraficoDisponible
      // },  
        
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

export default ReporteHistorialXMaquinaTiemposGrafico