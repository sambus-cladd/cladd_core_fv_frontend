import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import Chart from 'react-apexcharts';
import { format, parseISO } from 'date-fns';
import { GetTABLACOLORES, GetDatosGantFV } from '../API/APIFunctions';
import es from 'apexcharts/dist/locales/es.json';
import { Navbar } from '../../../../../components';
import AlpaLogo from '../../../../../assets/Images/alpaLogo.png';
import PropTypes from 'prop-types';
import HomeIcon from '@mui/icons-material/Home';
import DvrIcon from '@mui/icons-material/Dvr';
import { Navigate } from 'react-router-dom';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function GraficoGiroLento() {
    const [colores, setColores] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [value, setValue] = useState(1);
    const [datosGiroLento, setDatosGiroLento] = useState([]);
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

    const maquinasGiroLento = [
        'GIRO LENTO 1', 'GIRO LENTO 2', 'GIRO LENTO 3',
        'GIRO LENTO 4', 'GIRO LENTO 5', 'GIRO LENTO 6', 'GIRO LENTO 7'
    ];

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
        const fetchDatos = async () => {
            try {
                const response = await GetDatosGantFV();
                setDatosGiroLento(response.Dato[0] || []);
            } catch (error) {
                console.error("Error al obtener datos de giro lento", error);
            }
        };
        fetchDatos();

        const interval = setInterval(fetchDatos, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (datosGiroLento.length > 0) {
            console.log('Datos recibidos:', datosGiroLento);
            setForceUpdate(prev => prev + 1);
        }
    }, [datosGiroLento]);

    const parseDate = (dateStr) => {
        if (!dateStr) return new Date();
        try {
            const parsed = parseISO(dateStr);
            return isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;
        } catch {
            return new Date(dateStr);
        }
    };

    const giroLentoItems = datosGiroLento.filter(item => item.maquina === 'GIRO LENTO');

    const giroLentoProcesado = giroLentoItems.map(item => {
        const color = item.proceso === 'LINEA COLOR'
            ? colores.find(c => c.color === item.color)?.color_hex || '#000000'
            : machineColors[item.proceso] || '#000000';

        const inicio = new Date(parseDate(item.hora_inicio).getTime() - 3 * 3600 * 1000);
        const fin = new Date(parseDate(item.hora_fin).getTime() - 3 * 3600 * 1000);

        const match = item.maquina_proceso?.match(/GL([1-7])/i);
        const maquinaAsignada = match ? `GIRO LENTO ${match[1]}` : 'GIRO LENTO';

        return {
            x: maquinaAsignada,
            y: [inicio.getTime(), fin.getTime()],
            fillColor: color,
            orden: item.orden || 'Sin orden',
            procmaquina: item.maquina_proceso || 'Sin proceso',
            proceso: item.proceso || 'Sin proceso',
            articulo: item.articulo || 'Sin artículo',
            color: item.color || 'Sin color',
            metros: item.metros || 0,
            horas_total: item.horas_total || 0,
            hora_inicio: item.hora_inicio || '',
            hora_fin: item.hora_fin || '',
            tooltip: true
        };
    });

    const giroLentoProcesadoOrdenado = giroLentoProcesado.sort(
        (a, b) => maquinasGiroLento.indexOf(a.x) - maquinasGiroLento.indexOf(b.x)
    );

    const commonOptions = {
        chart: {
            type: 'rangeBar',
            height: 350,
            locales: [es],
            defaultLocale: 'es',
            toolbar: { show: true }
        },
        plotOptions: {
            bar: { horizontal: true }
        },
        title: {
            align: 'left',
            offsetX: 10,
            style: { fontSize: '25px' }
        },
        dataLabels: {
            enabled: true,
            formatter: (_, { dataPointIndex, w }) => {
                const item = w.config.series[0].data[dataPointIndex];
                return `${item.orden} (${item.articulo})`;
            },
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
            custom: ({ dataPointIndex, w }) => {
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
            xaxis: [6, 14, 22].map(hour => {
                const time = new Date();
                time.setHours(hour - 3, 0, 0, 0);
                return {
                    x: time.getTime(),
                    borderColor: hour === 6 ? 'red' : 'black',
                    label: {
                        text: `${String(hour).padStart(2, '0')}:00`,
                        style: { color: 'white', background: hour === 6 ? 'red' : 'black' }
                    }
                };
            })
        }
    };

    const dataGiroLento = {
        options: {
            ...commonOptions,
            title: {
                ...commonOptions.title,
                text: 'Producción Estimada - Giro Lento'
            },
            yaxis: {
                categories: maquinasGiroLento,
                labels: { style: { colors: '#000000' } }
            }
        },
        series: [{
            name: 'Duración',
            data: giroLentoProcesadoOrdenado
        }]
    };

    const alturaGraficoGiroLento = Math.max(giroLentoProcesadoOrdenado.length * 25 + 100, 300);

    // INDICADORES DE ESTADO DE MAQUINA EN TIEMPO REAL
    const hoy = new Date();
    const maquinasEnUso = new Set();

    giroLentoProcesado.forEach(item => {
        const inicio = parseDate(item.hora_inicio);
        const fin = parseDate(item.hora_fin);


        if (hoy >= inicio && hoy <= fin) {
            maquinasEnUso.add(item.x);
        }
    });

    const estadoMaquinas = maquinasGiroLento.map(maquina => ({
        nombre: maquina,
        enUso: maquinasEnUso.has(maquina)
    }));

    return (

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: '0' }}>
            <div style={{ flexGrow: 1 }}>
                <Navbar Titulo="DIAGRAMA GANTT" color="alpacladd" plantaLogo={AlpaLogo} />
                <Box sx={{ bgcolor: "#d3d3d3", display: 'flex', justifyContent: 'center' }}>
                    <Tabs value={value} onChange={(_, nv) => setValue(nv)} variant='scrollable' scrollButtons="on">
                        <Tab label="Home" icon={<HomeIcon />} />
                        <Tab label="Grafico Giro Lento" icon={<DvrIcon />} />
                    </Tabs>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <CustomTabPanel value={value} index={0}>
                        <Navigate to='/BuenosAires/FlorencioVarela/Productividad'></Navigate>
                    </CustomTabPanel>
                </Box>
                <Box p={1}>
                    {estadoMaquinas.length > 0 && (
                        <>
                            {/* INDICADORES DE ESTADO */}
                            <Grid container spacing={1} justifyContent="center" mb={2}>
                                {estadoMaquinas.map((m, i) => (
                                    <Grid item key={i}>
                                        <Box
                                            p={1}
                                            sx={{
                                                backgroundColor: m.enUso ? '#4caf50' : '#eeeeee',
                                                color: m.enUso ? 'white' : 'black',
                                                borderRadius: 2,
                                                boxShadow: 1,
                                                minWidth: 120,
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography variant="subtitle2">{m.nombre}</Typography>
                                            <Typography variant="caption">
                                                {m.enUso ? '🟢 En uso' : '⚪ Libre'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                        </>
                    )}
                </Box>

                <Box p={1}>
                    {giroLentoProcesado.length > 0 && (
                        <Chart
                            key={forceUpdate + '-giro'}
                            ref={chartRef}
                            options={dataGiroLento.options}
                            series={dataGiroLento.series}
                            type="rangeBar"
                            height={alturaGraficoGiroLento}
                            width="100%"
                        />
                    )}
                </Box>
            </div>

            {/* FOOTER */}
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "4px 8px",
                    borderRadius: "4px"
                }}
            >
                <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
                <Typography variant="caption" color="white">IT - Depto. Aplicaciones</Typography>
            </Box>
        </div>
    );
}

export default GraficoGiroLento;
