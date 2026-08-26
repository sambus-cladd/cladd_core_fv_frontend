import React, { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { GetTABLACOLORES } from '../API/APIFunctions';
import es from 'apexcharts/dist/locales/es.json';

const MACHINE_COLORS = {
  'LINEA DIFERENCIADO': '#9b00fb',
  'LINEA TER. DIRECTA': '#0d47a1',
  'LINEA NEGRO': '#0d0d0d',
  'LINEA APTO': '#fc9403',
  'LINEA APTO ESTAMPAR': '#66fcff',
  'MANTENIMIENTO': '#f50a12',
  'LIMPIEZA': '#bf9021',
};

function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const parsed = parseISO(dateStr);
    return isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;
  } catch {
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  }
}

function GraficoRangeBarFV({ Serie }) {
  const [colores, setColores] = React.useState([]);

  useEffect(() => {
    document.title = 'CladdCore FV';
  }, []);

  useEffect(() => {
    const cargarColores = async () => {
      try {
        const response = await GetTABLACOLORES();
        const lista = Array.isArray(response?.Dato)
          ? response.Dato.flat().filter((c) => c && typeof c === 'object')
          : [];
        setColores(lista);
      } catch (error) {
        console.error('Error al obtener los colores:', error);
      }
    };
    cargarColores();
  }, []);

  const otrasSeriesProcesadas = useMemo(() => {
    if (!Array.isArray(Serie) || Serie.length === 0) return [];

    const items = Serie.filter((item) => item?.maquina && item.maquina !== 'GIRO LENTO');

    return items
      .map((item) => {
        const inicioDate = parseDate(item.hora_inicio);
        const finDate = parseDate(item.hora_fin);
        if (!inicioDate || !finDate) return null;

        const color = item.proceso === 'LINEA COLOR'
          ? colores.find((c) => c.color === item.color)?.color_hex || '#000000'
          : MACHINE_COLORS[item.proceso] || '#546e7a';

        return {
          x: item.maquina,
          y: [inicioDate.getTime(), finDate.getTime()],
          fillColor: color,
          orden: item.orden || 'Sin orden',
          procmaquina: item.maquina_proceso || 'Sin proceso',
          proceso: item.proceso || 'Sin proceso',
          articulo: item.articulo || 'Sin artículo',
          metros: item.metros || 0,
          horas_total: item.horas_total || 0,
          hora_inicio: item.hora_inicio,
          hora_fin: item.hora_fin,
        };
      })
      .filter(Boolean);
  }, [Serie, colores]);

  const chartOptions = useMemo(() => {
    const hoyInicio = startOfDay(new Date()).getTime();
    const hoyFin = endOfDay(new Date()).getTime();

    return {
      chart: {
        type: 'rangeBar',
        locales: [es],
        defaultLocale: 'es',
        toolbar: { show: true },
        animations: { enabled: otrasSeriesProcesadas.length < 80 },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%',
          rangeBarGroupRows: true,
        },
      },
      title: {
        text: 'Producción Estimada',
        align: 'left',
        offsetX: 10,
        style: { fontSize: '22px', fontWeight: 600 },
      },
      dataLabels: {
        enabled: otrasSeriesProcesadas.length <= 40,
        formatter: (_value, { dataPointIndex, w }) => {
          const item = w.config.series[0]?.data[dataPointIndex];
          return item ? `${item.orden} (${item.articulo})` : '';
        },
        style: { fontSize: '11px' },
      },
      xaxis: {
        type: 'datetime',
        min: hoyInicio,
        max: hoyFin,
        position: 'top',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM',
            day: 'dd MMM',
            hour: 'HH:mm',
          },
          style: { colors: '#333' },
        },
      },
      yaxis: {
        labels: { style: { colors: '#333', fontSize: '12px' } },
      },
      grid: {
        padding: { left: 10, right: 20 },
      },
      tooltip: {
        custom: ({ dataPointIndex, w }) => {
          const item = w.config.series[0]?.data[dataPointIndex];
          if (!item) return '';

          const inicio = parseDate(item.hora_inicio);
          const fin = parseDate(item.hora_fin);

          return `
            <div style="background:#fff;border:1px solid #ccc;border-radius:8px;padding:0;min-width:220px;">
              <div style="background:${item.fillColor};padding:8px 10px;">
                <strong style="color:#fff;">Orden: ${item.orden}</strong>
              </div>
              <div style="padding:8px 10px;font-size:13px;line-height:1.5;">
                <div><strong>Máquina:</strong> ${item.x}</div>
                <div><strong>Proceso:</strong> ${item.proceso}</div>
                <div><strong>Artículo:</strong> ${item.articulo}</div>
                <div><strong>Metros:</strong> ${item.metros}</div>
                <div><strong>Horas:</strong> ${item.horas_total}</div>
                <div><strong>Inicio:</strong> ${inicio ? format(inicio, 'dd/MM/yy HH:mm') : '-'}</div>
                <div><strong>Fin:</strong> ${fin ? format(fin, 'dd/MM/yy HH:mm') : '-'}</div>
              </div>
            </div>`;
        },
      },
      noData: { text: 'Sin datos para mostrar' },
      annotations: {
        xaxis: [6, 14, 22].map((hour) => {
          const time = new Date();
          time.setHours(hour, 0, 0, 0);
          return {
            x: time.getTime(),
            borderColor: hour === 6 ? '#e53935' : '#424242',
            label: {
              text: `${String(hour).padStart(2, '0')}:00`,
              style: {
                color: '#fff',
                background: hour === 6 ? '#e53935' : '#424242',
              },
            },
          };
        }),
      },
      legend: { show: false },
    };
  }, [otrasSeriesProcesadas]);

  const chartSeries = useMemo(() => ([{
    name: 'Duración',
    data: otrasSeriesProcesadas,
  }]), [otrasSeriesProcesadas]);

  const chartHeight = Math.max(
    [...new Set(otrasSeriesProcesadas.map((item) => item.x))].length * 48 + 120,
    350
  );

  if (!Array.isArray(Serie) || Serie.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="text.secondary">No hay datos de producción programada para hoy.</Typography>
      </Box>
    );
  }

  if (otrasSeriesProcesadas.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="text.secondary">
          Hay {Serie.length} registros, pero ninguno corresponde a máquinas de producción (excluyendo Giro Lento).
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', bgcolor: '#fafafa', borderRadius: 1, p: 1 }}>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="rangeBar"
        height={chartHeight}
        width="100%"
      />
    </Box>
  );
}

export default GraficoRangeBarFV;
