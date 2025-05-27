import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Chart from 'react-apexcharts';
import { format, parseISO } from 'date-fns';

import { GetTABLACOLORES } from '../API/APIFunctions';

function GraficoRangeBarFV({ Serie }) {
  const [colores, setColores] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  var es = require("apexcharts/dist/locales/es.json");

  useEffect(() => {
    const CargarColores = async () => {
      try {
        const response = await GetTABLACOLORES();
        setColores(response.Dato);
      } catch (error) {
        console.error("Error al obtener los colores: ", error);
      }
    };
    CargarColores();
  }, []);

  useEffect(() => {
    if (Serie && Serie.length > 0) {
      console.log('Datos recibidos:', Serie);
      setForceUpdate(prev => prev + 1);
    }
  }, [Serie]);

  const chartRef = useRef(null);

  const machineColors = {
    'LINEA DIFERENCIADO': '#9b00fb',
    'LINEA TER. DIRECTA': '#0d47a1',
    'LINEA NEGRO': '#0d0d0d',
    'LINEA APTO': '#fc9403',
    'LINEA APTO ESTAMPAR': '#66fcff',
    'MANTENIMIENTO': '#f50a12',
    'LIMPIEZA': '#bf9021'
  };

  const machineOrder = ["108", "GIRO LENTO", "120", "130", "20", "124", "123", "146", "149", "150", "10", "160"];

  const parseDate = (dateStr) => {
    if (!dateStr) {
      console.error('Fecha no definida');
      return new Date();
    }

    try {
      // Intentar parsear como ISO
      const date = parseISO(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (error) {
      console.error('Error al parsear fecha ISO:', error);
    }

    // Si falla, intentar con Date directamente
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (error) {
      console.error('Error al crear fecha con Date:', error);
    }

    console.error('No se pudo parsear la fecha:', dateStr);
    return new Date();
  };

  if (!Serie || !Array.isArray(Serie) || Serie.length === 0) {
    console.log('Serie no válida:', Serie);
    return <Box p={1} textAlign="center">No hay datos disponibles</Box>;
  }

  // Asegurarse de que Serie sea un array plano
  const flatSerie = Array.isArray(Serie[0]) ? Serie[0] : Serie;

  const seriesData = flatSerie.map((item, index) => {
    if (!item) {
      console.error(`Item ${index} es undefined`);
      return null;
    }

    console.log(`Procesando item ${index}:`, item);
    
    const colorSeleccionado = item.proceso === 'LINEA COLOR'
      ? colores.find(color => color.color === item.color)?.color_hex || '#000000'
      : machineColors[item.proceso] || '#000000';

    const horaInicio = parseDate(item.hora_inicio);
    const horaFin = parseDate(item.hora_fin);

    return {
      x: item.maquina || 'Sin máquina',
      y: [horaInicio.getTime(), horaFin.getTime()],
      fillColor: colorSeleccionado,
      orden: item.orden || 'Sin orden',
      procmaquina: item.maquina_proceso || 'Sin proceso',
      proceso: item.proceso || 'Sin proceso',
      articulo: item.articulo || 'Sin artículo',
      color: item.color || 'Sin color',
      metros: item.metros || 0,
      horas_total: item.horas_total || 0,
      hora_inicio: item.hora_inicio || 'Sin hora inicio',
      hora_fin: item.hora_fin || 'Sin hora fin'
    };
  }).filter(item => item !== null)
    .sort((a, b) => machineOrder.indexOf(a.x) - machineOrder.indexOf(b.x));

  // Obtener el máximo y mínimo tiempo
  const maxTime = Math.max(...Serie.map(item => new Date(item.hora_fin).getTime()));
  const minTime = maxTime - (2 * 24 * 60 * 60 * 1000); // Restar 2 días

  const getAnnotationsForToday = () => {
    const today = new Date();
    const annotations = [];

    // 6:00 AM
    const sixAM = new Date(today);
    sixAM.setHours(6 - 3, 0, 0, 0);
    annotations.push({
      x: sixAM.getTime(),
      borderColor: 'red',
      label: {
        text: '06:00',
        style: {
          color: 'white',
          background: 'red'
        }
      }
    });

    // 14:00 PM
    const twoPM = new Date(today);
    twoPM.setHours(14 - 3, 0, 0, 0);
    annotations.push({
      x: twoPM.getTime(),
      borderColor: 'black',
      label: {
        text: '14:00',
        style: {
          color: 'white',
          background: 'black'
        }
      }
    });

    // 22:00 PM
    const tenPM = new Date(today);
    tenPM.setHours(22 - 3, 0, 0, 0);
    annotations.push({
      x: tenPM.getTime(),
      borderColor: 'black',
      label: {
        text: '22:00',
        style: {
          color: 'white',
          background: 'black'
        }
      }
    });

    return annotations;
  };
  const data = {
    options: {
      chart: {
        type: 'rangeBar',
        height: 350,
        locales: [es],
        defaultLocale: 'es',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          colors: {
            ranges: Object.keys(machineColors).map(machine => ({
              from: 0,
              to: 0,
              color: machineColors[machine]
            }))
          }
        }
      },
      title: {
        text: `Producción Estimada`,
        align: 'left',
        offsetX: 110,
        style: {
          fontSize: '25px'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, { dataPointIndex }) {
          const item = seriesData[dataPointIndex];
          return `${item.orden} (${item.articulo})`;
        },
        style: {
          fontSize: "12px",
        },
      },
      xaxis: {
        type: 'datetime',
        min: new Date().setHours(0-3, 0, 0, 0),
        max: new Date().setHours(23-3, 59, 0, 0),
        position: 'top',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMMM',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          style: {
            colors: '#000000',
          }
        },
        categories: machineOrder,
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000',
          }
        }
      },
      tooltip: {
        enabled: true,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const item = seriesData[dataPointIndex]; // Usar seriesData directamente

          if (!item) return '';

          const inicio = new Date(item.hora_inicio);
          const fin = new Date(item.hora_fin);

          inicio.setHours(inicio.getHours() + 3);
          fin.setHours(fin.getHours() + 3);

          const tooltipStyle = `
              background-color: white;
              border: 1px solid #ccc;
              border-radius: 8px;
          `;
          const titleStyle = `
              background: ${item.fillColor};
              margin-bottom: 5px;
              padding: 10px;
          `;
          const contentStyle = `
              margin-bottom: 5px;
              margin-left: 5px;
              display: flex;
              flex-direction: column;
              justify-content: stretch;
              align-items: flex-start;
              align-content: stretch;
          `;
          const textStyle = `
              color: white;
          `;

          return `
              <div style="${tooltipStyle}">
                  <div style="${titleStyle}">
                      <span style="${textStyle}"><strong> Orden: ${item.orden}</strong></span>
                  </div>
                  <div style="${contentStyle}">
                      <span> • <strong>Proc Maquina:</strong>  ${item.procmaquina} </span>
                      <span> • <strong>Proceso:</strong>  ${item.proceso} </span>
                      <span> • <strong>Metros:</strong>  ${item.metros} </span>
                      <span> • <strong>Articulo:</strong>  ${item.articulo} </span>
                      <span> • <strong>Horas:</strong>  ${item.horas_total} </span>
                      <span> ► <strong>Inicio:</strong> ${format(inicio, 'yy/MM/dd HH:mm')} </span>
                      <span> ► <strong>Fin:</strong> ${format(fin, 'yy/MM/dd HH:mm')} </span>
                  </div>
              </div>
          `;
        }
      },
      noData: {
        text: 'Esperando Datos...'
      },
      annotations: {
        xaxis: getAnnotationsForToday(), // Genera anotaciones solo para hoy a las 6, 14 y 22 horas
      }

    },
    series: [{
      name: 'Duración',
      data: seriesData
    }]
  };

  return (
    <Box p={1} textAlign="center">
      {Serie && Serie.length > 0 ? (
        <Chart
          key={forceUpdate} // Se actualiza cada vez que 'Serie' cambia
          ref={chartRef}
          options={data.options}
          series={data.series}
          type="rangeBar"
          height="550"
          width="100%"
        />
      ) : (
        <p>Esperando datos para mostrar gráfico...</p>
      )}

    </Box>
  );
}

export default GraficoRangeBarFV;