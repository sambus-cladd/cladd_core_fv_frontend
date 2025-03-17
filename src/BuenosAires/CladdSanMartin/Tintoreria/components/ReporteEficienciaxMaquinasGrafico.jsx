import React from 'react'
import Chart from "react-apexcharts";
import { Box } from '@mui/system';

function ReporteEficienciaxMaquinasGrafico({Serie}) {

    let objProduccion=[];
    let DatosGraficoTiempoTeorico = [];
    let DatosGraficoTiempoReal = [];
    let DatosGraficoTiempoParo = [];
    let DatosGraficoEficiencia = [];
    
    Serie.map((elemento) => {
      const objProduccion = {
          x: elemento.Barcada,
          y: elemento.TiempoTeorico.toLocaleString(),
          // z: elemento.Veces,
      };
      DatosGraficoTiempoTeorico.push(objProduccion);
  });

  Serie.map((elemento) => {
    const objProduccion = {
        x: elemento.Barcada,
        y: elemento.TiempoReal.toLocaleString(),
        // z: elemento.Veces,
    };
    DatosGraficoTiempoReal.push(objProduccion);
});

 Serie.map((elemento) => {
    const objProduccion = {
        x: elemento.Barcada,
        y: elemento.TiempoParo.toLocaleString(),
        // z: elemento.Veces,
    };
    DatosGraficoTiempoParo.push(objProduccion);
});

Serie.map((elemento) => {
  const objProduccion = {
      x: elemento.Barcada,
      y: elemento.Eficiencia.toFixed(2),
      // z: elemento.Veces,
  };
  DatosGraficoEficiencia.push(objProduccion);
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
            fontSize: "10px",
            
          }
        }, 
        
        stroke: {//Líneas gráficas
          
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
                  offsetX: 0, // Ajustar el espacio horizontal entre las etiquetas (8 píxeles en este ejemplo)
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
          // GRÁFICO DE TIEMPO TEORICO -- EJE Y
            {
              seriesName: 'TiempoTeorico',
              opposite: false,

              title: {
                text: 'Tiempo Teorico',
                style: {
                  color:  '#0b719b',
                }
              },
              
            axisBorder: {
              show: true,
              color: '#0b719b'
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
                colors: '#0b719b',
              },
            },
            }, 

        // GRÁFICO DE TIEMPO REAL -- EJE Y
        {
          seriesName: 'TiempoReal',
          opposite: true,

          title: {
            text: 'Tiempo Real',
            style: {
              color:  '#3dc707',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#3dc707'
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          offsetX: -15,
          formatter: function(val) {
            return Number(val).toLocaleString() + " Min";
          },
          style: {
            colors: '#3dc707',
          },
        },
        },
        
        // GRÁFICO DE TIEMPO PARO -- EJE Y
        {
          seriesName: 'TiempoParo',
          opposite: false,

          title: {
            text: 'Tiempo Paro',
            style: {
              color:  '#c71507',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#c71507'
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
            colors: '#c71507',
          },
        },
        },
        
        // GRÁFICO DE EFICIENCIA -- EJE Y
        {
          seriesName: 'Eficiencia',
          opposite: true,

          title: {
            text: 'Eficiencia',
            style: {
              color:  '#e38f0a',
            }
          },
          
        axisBorder: {
          show: true,
          color: '#e38f0a'
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          offsetX: -15,
          formatter: function(val) {
            return Number(val).toLocaleString() + " %";
          },
          style: {
            colors: '#e38f0a',
          },
        },
        },
      ],
        
        series: [{
          name: "Total Tiempo Teorico [Min.]",
          type: 'column',
          color: '#0b719b',
          data: DatosGraficoTiempoTeorico
        },

        {
          name: "Total Tiempo Real [Min.]",
          type: 'column',
          color: '#3dc707',
          data: DatosGraficoTiempoReal
        },

        {
          name: "Total Tiempo Paro [Min.]",
          type: 'column',
          color: '#c71507',
          data: DatosGraficoTiempoParo
        },

        {
          name: "Eficiencia [%]",
          type: 'column',
          color: '#e38f0a',
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

export default ReporteEficienciaxMaquinasGrafico