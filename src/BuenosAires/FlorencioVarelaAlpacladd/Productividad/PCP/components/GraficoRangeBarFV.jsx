import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Chart from 'react-apexcharts';
import { format, parseISO } from 'date-fns';
import { GetTABLACOLORES } from '../API/APIFunctions';
import es from 'apexcharts/dist/locales/es.json';
import { Margin } from '@mui/icons-material';

function GraficoRangeBarFV({ Serie }) {
  const [colores, setColores] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const chartRef = useRef(null);

  const machineColors = {
    'LINEA DIFERENCIADO': '#9b00fb',
    'LINEA TER. DIRECTA': '#0d47a1',
    'LINEA NEGRO': '#0d0d0d',
    'LINEA APTO': '#fc9403',
    'LINEA APTO ESTAMPAR': '#66fcff',
    'MANTENIMIENTO': '#f50a12',
    'LIMPIEZA': '#bf9021',
  };

  useEffect(() => {
      document.title = "CladdCore FV";
    }, []);

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

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
      const parsed = parseISO(dateStr);
      return isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;
    } catch {
      return new Date(dateStr);
    }
  };

  if (!Array.isArray(Serie) || Serie.length === 0) {
    return <Box p={1} textAlign="center">No hay datos disponibles</Box>;
  }

  const flatSerie = Array.isArray(Serie[0]) ? Serie[0] : Serie;
  const giroLentoItems = flatSerie.filter(item => item.maquina === 'GIRO LENTO');
  const otrasMaquinas = flatSerie.filter(item => item.maquina !== 'GIRO LENTO');

  // OTRAS MAQUINAS
  const otrasSeriesProcesadas = otrasMaquinas.map(item => {
    const color = item.proceso === 'LINEA COLOR'
      ? colores.find(c => c.color === item.color)?.color_hex || '#000000'
      : machineColors[item.proceso] || '#000000';

    const inicio = new Date(parseDate(item.hora_inicio).getTime() - 3 * 3600 * 1000);
    const fin = new Date(parseDate(item.hora_fin).getTime() - 3 * 3600 * 1000);

    return {
      x: item.maquina || 'Sin máquina',
      y: [inicio.getTime(), fin.getTime()],
      fillColor: color,
      orden: item.orden || 'Sin orden',
      procmaquina: item.maquina_proceso || 'Sin proceso',
      proceso: item.proceso || 'Sin proceso',
      articulo: item.articulo || 'Sin artículo',
      color: item.color || 'Sin color',
      metros: item.metros || 0,
      horas_total: item.horas_total || 0,
      hora_inicio: item.hora_inicio || 'Sin hora inicio',
      hora_fin: item.hora_fin || 'Sin hora fin',
      tooltip: true
    };
  });

  // OPCIONES DE AMBOS GRAFICOS
  const commonOptions = {
    chart: {
      type: 'rangeBar',
      height: 350,
      locales: [es],
      defaultLocale: 'es',
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: Object.keys(machineColors).map(name => ({
            from: 0,
            to: 0,
            color: machineColors[name]
          }))
        }
      }
    },
    title: {
      align: 'left',
      offsetX: 10,
      style: { fontSize: '25px' }
    },
    dataLabels: {
      enabled: true,
      formatter: function (value, { dataPointIndex, w }) {
        const item = w.config.series[0].data[dataPointIndex];
        return `${item.orden} (${item.articulo})`;
      }
      ,
      style: { fontSize: '12px' }
    },
    xaxis: {
      type: 'datetime',
      min: new Date().setHours(0 - 3, 0, 0, 0),
      max: new Date().setHours(23 - 3, 59, 0, 0),
      position: 'top',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMMM',
          day: 'dd MMM',
          hour: 'HH:mm'
        },
        style: { colors: '#000000' }
      }
    },
    tooltip: {
      enabled: true,
      custom: function ({ dataPointIndex, w }) {
        const item = w.config.series[0].data[dataPointIndex];
        if (!item || item.tooltip === false) return '';

        const inicio = new Date(item.hora_inicio);
        const fin = new Date(item.hora_fin);

        return `
          <div style="background-color:white;border:1px solid #ccc;border-radius:8px;">
            <div style="background:${item.fillColor};margin-bottom:5px;padding:10px;">
              <span style="color:white;"><strong>Orden: ${item.orden}</strong></span>
            </div>
            <div style="margin-left:5px;display:flex;flex-direction:column;align-items:flex-start;">
              <span> • <strong>Proc Maquina:</strong> ${item.procmaquina}</span>
              <span> • <strong>Proceso:</strong> ${item.proceso}</span>
              <span> • <strong>Metros:</strong> ${item.metros}</span>
              <span> • <strong>Articulo:</strong> ${item.articulo}</span>
              <span> • <strong>Horas:</strong> ${item.horas_total}</span>
              <span> ► <strong>Inicio:</strong> ${format(inicio, 'yy/MM/dd HH:mm')}</span>
              <span> ► <strong>Fin:</strong> ${format(fin, 'yy/MM/dd HH:mm')}</span>
            </div>
          </div>`;
      }
    },
    noData: { text: 'Esperando Datos...' },
    annotations: {
      xaxis: (() => {
        const today = new Date();
        return [6, 14, 22].map(hour => {
          const time = new Date(today);
          time.setHours(hour - 3, 0, 0, 0);
          return {
            x: time.getTime(),
            borderColor: hour === 6 ? 'red' : 'black',
            label: {
              text: `${String(hour).padStart(2, '0')}:00`,
              style: {
                color: 'white',
                background: hour === 6 ? 'red' : 'black'
              }
            }
          };
        });
      })()
    }
  };

  // OPCIONES DE OTRAS MAQUINAS
  const dataOtrasMaquinas = {
    options: {
      ...commonOptions,
      title: {
        ...commonOptions.title,
        text: 'Producción Estimada'
      },
      yaxis: {
        categories: [...new Set(otrasSeriesProcesadas.map(item => item.x))],
        labels: { style: { colors: '#000000' } }
      }
    },
    series: [{
      name: 'Duración',
      data: otrasSeriesProcesadas
    }]
  };

  return (
    <>
      <Box p={1}>
        {otrasSeriesProcesadas.length > 0 && (
          <>
            <Chart
              key={forceUpdate + '-otras'}
              ref={chartRef}
              options={dataOtrasMaquinas.options}
              series={dataOtrasMaquinas.series}
              type="rangeBar"
              height="550"
              width="100%" />
          </>
        )}
      </Box>

    </>

  );
}

export default GraficoRangeBarFV;
