import React from 'react'
import Chart from "react-apexcharts";
import { Box } from '@mui/system';

function ReporteGruposParosFechaGrafico({Serie}) {

    let objProduccion=[];
    let DatosGraficGruposParos = [];
    let DatosGraficGruposVeces = [];

    
    Serie.map((elemento) => {
      const objProduccion = {
          x: elemento.Paro,
          y: elemento.TiempoDeParo,
          // z: elemento.Veces,
      };
      DatosGraficGruposParos.push(objProduccion);
  });

    Serie.map((elemento) => {
      const objProduccion = {
          x: elemento.Paro,
          y: elemento.Veces,
      };
      DatosGraficGruposVeces.push(objProduccion);
  });

    const data = {
        options: {
 
        fill: {
          opacity: [0.85, 0.85, 1],
          // colors: ['#008FFB', '#00E396','#00E396', '#FF4560'],
 
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
            fontSize: "6px",
            
          }
        }, 
        stroke: { //Líneas de gráficos
          
          width: [0, 3, 3,3],
          curve: 'smooth'
        },

        xaxis: {
                tickPlacement: 'on', // Colocar las etiquetas sin superposición
                position: 'bottom',
                labels: {
                  show: true,
                  rotateAlways: true, // Rotar siempre las etiquetas
                  offsetY: 0,
                  offsetX: 6, // Ajustar el espacio horizontal entre las etiquetas (8 píxeles en este ejemplo)
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
                // title: {
                //   text: 'Paros',
                //   style: {
                //     color: '008FFB',
                //     fontWeight: 'bold',
                //     fontSize: '14px'
                //   },
                //   offsetX: 0,
                //   offsetY: 80
                // }     
        },

        yaxis: [
          // GRÁFICO DE TIEMPO PAROS -- EJE Y
            {
              seriesName: 'TiempoDeParo',
              opposite: false,

              title: {
                text: 'Tiempo de Paros Total',
                style: {
                  color:  '#f75b5b',
                }
              },
              
            axisBorder: {
              show: true,
              color: '#f75b5b'
            },
            axisTicks: {
              show: true
            },
            labels: {
              show: true,
              offsetX: -10,
              formatter: function(val) {
                return Number(val).toLocaleString() + " Min";
              },
              style: {
                colors: '#f75b5b',
              },
            },
            }, 
          // GRÁFICO PARA VECES PAROS - EJE Y
        {
          seriesName: 'Veces',
          opposite: true,
          title: {
            text: 'Cantidad de Paros',
            style: {
              color: '#00E396',
            },
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          axisTicks: {
            show: true,
          },
          labels: { //Números del eje Y
            show: true,
            offsetX: -15,
            formatter: function (val) {
              return Number(val).toLocaleString();
            },
            style: {
              colors: '#00E396',
            },
          },
        },
      ],
        
        series: [{
          name: "Total Tiempo de Paros [Min.]",
          type: 'column',
          color: '#f75b5b',
          data: DatosGraficGruposParos
        },
        {
          name: 'Total Cantidad de Paros',
          type: 'column',
          color: '#00E396',
          data: DatosGraficGruposVeces,
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

export default ReporteGruposParosFechaGrafico