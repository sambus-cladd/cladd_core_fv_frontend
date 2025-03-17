import React from 'react';
import Chart from "react-apexcharts";
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

const paletaColores = [
  '#8dbf42',
  '#2196f3',
  '#e2a03f',
  '#e7515a',
  '#ff9800',
  '#9c27b0',
  '#607d8b',
  '#03a9f4',
  '#ff5722',
  '#009688',
  '#f44336',
  '#673ab7',
  '#00bcd4',
  '#ffc107',
  '#4caf50',
  '#ffeb3b',
  '#795548',
  '#9e9e9e',
  '#cddc39',
  '#ffcdd2',
  '#ff5722',
  '#ff4081',
  '#03a9f4',
  '#e91e63',
  '#ff6f00',
  '#9c27b0',
  '#2196f3',
  '#fdd835',
  '#00bcd4',
  '#4caf50',
  '#607d8b',
  '#9e9e9e',
  '#cddc39',
  '#ff9800',
  '#8bc34a',
  '#f44336',
  '#673ab7',
  '#ffc107',
  '#ff5722',
  '#ffeb3b',
  '#795548',
  '#9c27b0',
  '#2196f3',
  '#00bcd4',
  '#4caf50',
  '#607d8b',
  '#9e9e9e',
  '#cddc39',
  '#ff9800',
  '#8bc34a',
  '#f44336',
  '#673ab7',
  '#ffc107',
  '#ff5722',
  '#ffeb3b',
  '#795548',
];

function ReporteHistorialXMaquinaParosGraficoTodos({ Serie }) {
  const datosAgrupados = {};

  // Agrupar los datos por fecha y máquina
  Serie.forEach((elemento) => {
    const fecha = elemento.Fecha.split("T", 2)[0];
    const [anio, mes, dia] = fecha.split("-");
    const key = `${dia}-${mes}-${anio}`;
    const idMaquina = elemento.IdMaquina;

    if (!datosAgrupados[key]) {
      datosAgrupados[key] = {
        fecha: key,
        [idMaquina]: elemento.TiempoParos,
      };
    } else {
      datosAgrupados[key][idMaquina] = (datosAgrupados[key][idMaquina] || 0) + elemento.TiempoParos;
    }
  });

  // Convertir el objeto agrupado en un arreglo para usarlo en el gráfico
  const DatosGraficoProduccion = Object.values(datosAgrupados).map(item => ({
    x: item.fecha,
    ...item,
  }));

  // Obtener la lista de máquinas disponibles
  const maquinas = Object.keys(Serie.reduce((acc, item) => ({ ...acc, [item.IdMaquina]: true }), {}));

  // Crear una serie para cada máquina y asignar sus valores para cada fecha
  const seriesPorMaquina = maquinas.map((maquina, index)=> ({
    name: `Maq. ${maquina}`,
    // name: `Máquina ${maquina}`,
    type: 'column',
    data: DatosGraficoProduccion.map(item => ({
      x: item.x,
      y: item[maquina] || 0,
    })),
    color: paletaColores[index % paletaColores.length], // Asignar colores de la paleta
  }));

  const data = {
    options: {
      fill: {
        opacity: [0.85, 0.85, 1],
        colors: ['#008FFB', '#FEB019','#00E396', '#FF4560'],
      },
      markers: {
        size: 3,
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
        enabledOnSeries: [1, 2],
        formatter: function(val) {
          return Number(val).toLocaleString();
        },
        offsetY: -10,
        style: {
          fontSize: "10px",
        }
      },
      stroke: {
        width: [0, 3, 3, 3],
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
        },
      },
      yaxis: [
        {
          seriesName: 'TiempoParos',
          opposite: false,
          title: {
            text: '[Minutos]',
            style: {
              style: {
                color: '#323334', // Color del título del eje Y
                fontSize: '12px', // Opcional: Tamaño de fuente personalizado
              }
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
      ],
    },
    series: [
      ...seriesPorMaquina, // Agregar las nuevas series por máquina
    ],
    noData: {
      text: 'Esperando Datos...'
    }
  };

  return (
    <Box p={1} textAlign="center">
      {/* Título del eje Y */}
      <Typography variant="subtitle1" color="#3b3c3e"><strong>
        [Minutos]</strong>
      </Typography>
      {/* Gráfico */}
      <Chart
        options={data.options}
        series={data.series} 
        type="line" 
        height="400"
      />
    </Box>
  );
}

export default ReporteHistorialXMaquinaParosGraficoTodos;
