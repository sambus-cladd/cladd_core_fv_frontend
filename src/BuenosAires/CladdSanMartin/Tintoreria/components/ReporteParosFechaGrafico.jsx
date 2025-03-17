import React from 'react'
import Chart from "react-apexcharts";
import { Box } from '@mui/system';

function ReporteParosFechaGrafico({Serie}) {

    let objProduccion=[], DatosGraficoParos=[];

    
    Serie.map((elemento) => {
      const objProduccion = {
          x: elemento.Maquina,
          y: elemento.TiempoDeParo,
      };
      DatosGraficoParos.push(objProduccion);
  });

    const data = {
        options: {
 
        fill: {
          opacity: [0.85, 0.85, 1],
          colors: ['#de721a', '#FEB019','#00E396', '#FF4560'],
 
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
          
          // tickPlacement: 'on',
          
          position: "bottom",//bottom
          labels: {               // Etiquetas en Eje X
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
          },  
          title: {
            text: 'Máquinas',
            style: {
              color: '008FFB',
              fontWeight: 'bold',
              fontSize: '12px'
            },
            offsetX: 0,
            offsetY: 80
          }     
          },

        yaxis: [
          // PRODUCCION EJE Y
            {
              seriesName: 'TiempoDeParo',
              opposite: false,

              title: {
                text: 'Tiempo de Paros',
                style: {
                  color:  '#de721a',
                }
              },
              
            axisBorder: {
              show: true,
              color: '#de721a'
            },
            axisTicks: {
              show: true
            },
            labels: {
              show: true,
              formatter: function(val) {
                return Number(val).toLocaleString() + " Min";
              },
              style: {
                colors: '#de721a',
              },

            },
            
            
            },                     


          ],
        
        series: [{
          name: "Total Tiempo de Paros [Min.]",
          type: 'column',
          data: DatosGraficoParos
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
              height="300"
            />
          </Box>
  )
}

export default ReporteParosFechaGrafico