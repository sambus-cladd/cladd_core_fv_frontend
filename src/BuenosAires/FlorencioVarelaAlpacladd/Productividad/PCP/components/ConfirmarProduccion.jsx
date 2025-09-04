import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { GetDatosGantFV } from '../API/APIFunctions';
import { actualizarDatosReales, guardarEstadoOrden, getEstadoOrden, getSecuenciaRollo, getDatosOrdenes } from '../API/APIFunctions';
import { getStockRollosXOrden } from '../../../API/APIFunctions';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chip } from '@mui/material';
import 'dayjs/locale/es';
import dayjs from 'dayjs';

export default function ConfirmarProduccion() {
    const [datos, setDatos] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [rollosAsignados, setRollosAsignados] = useState([]);
    const [estadoOrden, setEstadoOrden] = useState("sin iniciar");
    const [horaInicioReal, setHoraInicioReal] = useState(null);
    const [horaFinReal, setHoraFinReal] = useState(null);
    const [metrosRealesPorOrden, setMetrosRealesPorOrden] = useState({});
    const [checksUsadosPorOrden, setChecksUsadosPorOrden] = useState({});
    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState([]);
    const [estadosPorOrden, setEstadosPorOrden] = useState({});
    const [filtroEstado, setFiltroEstado] = useState(null);
    const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [passwordIngresada, setPasswordIngresada] = useState("");
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const PASSWORD_SUPERUSER = "0000";

    useEffect(() => {
        const fetchData = async () => {
            if (busquedaActiva) return;
            try {
                const response = await GetDatosGantFV();
                const datosPlanos = response.Dato.flat();

                // Para cada orden, traigo los datos de metros usando getDatosOrdenes
                const datosConMetros = await Promise.all(
                    datosPlanos.map(async (item) => {
                        try {
                            const res = await getDatosOrdenes(item.id); // item.id segun la función
                            const metrosTotales = res?.data?.metros_totales ?? 0;
                            return { ...item, metrosTotales };
                        } catch (err) {
                            console.error("Error obteniendo metros de la orden:", item.orden, err);
                            return { ...item, metrosTotales: 0 };
                        }
                    })
                );

                setDatos(datosConMetros);
                setResultados(datosConMetros);

                // Traer estados de orden como ya lo haces
                if (!busquedaActiva) setResultados(datosConMetros);
                const estados = {};
                const promesas = datosConMetros.map(async (it) => {
                    try {
                        const r = await getEstadoOrden(it.id);
                        estados[it.id] = (r?.success && r?.data?.estado_orden) ? r.data.estado_orden : "sin iniciar";
                    } catch {
                        estados[it.id] = "sin iniciar";
                    }
                });
                await Promise.allSettled(promesas);
                setEstadosPorOrden(estados);

            } catch (error) {
                console.error("Error al obtener los datos de gantt", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [busquedaActiva]);


    const handleBuscar = () => {
        const filtro = busqueda.trim();
        if (filtro === "") {
            setResultados(datos);
            setBusquedaActiva(false);
        } else {
            const filtrados = datos.filter(item =>
                String(item.orden || "") === filtro
            );
            setResultados(filtrados);
            setBusquedaActiva(true);
        }
    };

    useEffect(() => {
        let lista = [...datos];
        if (filtroEstado) {
            lista = lista.filter(item =>
                (estadosPorOrden[item.id] || "sin iniciar").toLowerCase() === filtroEstado.toLowerCase()
            );
        }
        setResultados(lista);
    }, [datos, busqueda, filtroEstado, estadosPorOrden]);

    const GetDatosProd = async (Orden) => {
        if (!Orden) return;

        try {
            // Trae los rollos asignados a la orden
            const dataRAW = await getStockRollosXOrden(Orden);
            const rollosPorOrden = dataRAW.data || [];
            console.log("ROLLOS POR ORDEN SELECCIONADA:", Orden, rollosPorOrden);

            // Trae la secuencia de cada rollo
            const rollosConSecuencia = await Promise.all(
                rollosPorOrden.map(async (rollo) => {
                    const res = await getSecuenciaRollo(rollo.rollo);
                    const secuencia = res.success ? res.data.secuencia_lr : "N/A";
                    return { ...rollo, secuencia_lr: secuencia };
                })
            );
            console.log("ROLLOS POR ORDEN CON SECUENCIA:", rollosConSecuencia);

            setRollosAsignados(rollosConSecuencia);
        } catch (err) {
            console.error("Error obteniendo rollos con secuencia:", err);
            setRollosAsignados([]);
        }
    };


    const handleOpenPopup = async (item) => {
        setOrdenSeleccionada(item);

        // Traer estado de la orden
        let estado = {};
        try {
            const response = await getEstadoOrden(item.id);
            if (response && response.success && response.data) {
                estado = response.data;
            }
        } catch (err) {
            console.error("Error obteniendo estado orden:", err);
        }

        setMetrosRealesPorOrden(prev => ({
            ...prev,
            [item.id]: estado.metros_por_rollo ? JSON.parse(estado.metros_por_rollo) : {}
        }));
        setChecksUsadosPorOrden(prev => ({
            ...prev,
            [item.id]: estado.metros_por_rollo
                ? Object.keys(JSON.parse(estado.metros_por_rollo)).reduce((acc, r) => ({ ...acc, [r]: true }), {})
                : {}
        }));

        setEstadoOrden(estado.estado_orden || "sin iniciar");
        setHoraInicioReal(estado.hora_inicio_real ? dayjs(estado.hora_inicio_real) : null);
        setHoraFinReal(estado.hora_fin_real ? dayjs(estado.hora_fin_real) : null);

        await GetDatosProd(item.orden);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setOrdenSeleccionada(null);
        setEstadoOrden("sin iniciar");
        setHoraInicioReal(null);
        setHoraFinReal(null);
    };

    const iniciarOrden = async () => {
        if (!ordenSeleccionada) return;
        const ahora = dayjs();
        setHoraInicioReal(ahora);
        setEstadoOrden("en proceso");

        await guardarEstadoOrden({
            IdOrden: ordenSeleccionada.id,
            NumeroOrden: ordenSeleccionada.orden,
            EstadoOrden: "en proceso",
            HoraInicioReal: ahora.format("YYYY-MM-DD HH:mm:ss"),
            HoraFinReal: null,
            MetrosTotales: 0,
            MetrosPorRollo: {},
        });
    };

    const finalizarOrden = async () => {
        if (!ordenSeleccionada) return;

        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const checks = checksUsadosPorOrden[ordenSeleccionada.id] || {};

        for (let rollo of rollosAsignados) {
            const valor = todosMetros[rollo.rollo];
            const confirmado = checks[rollo.rollo];

            if (!confirmado || !valor || isNaN(valor) || Number(valor) <= 0) {
                return alert(`Debes ingresar y confirmar metros reales para el rollo ${rollo.rollo} antes de finalizar la orden.`);
            }
        }

        const totalMetros = Object.values(todosMetros).reduce((acc, val) => acc + Number(val || 0), 0);

        if (totalMetros <= 0) {
            return alert("No se registraron metros reales. Verificá antes de finalizar la orden.");
        }
        if (ordenSeleccionada.metros && totalMetros > Number(ordenSeleccionada.metros)) {
            setMostrarPassword(true);
            return alert(`Los metros reales (${totalMetros}) exceden a los metros cargados (${ordenSeleccionada.metros}). Verificá los datos.`);
        }

        const ahora = dayjs();
        setHoraFinReal(ahora);
        setEstadoOrden("finalizado");

        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal)) {
            const diffMs = ahora.diff(horaInicioReal);
            duracionHoras = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
            console.log("Duración horas:", duracionHoras, typeof duracionHoras);
        }

        if (metrosTotales)
            try {
                await actualizarDatosReales({
                    IdOrden: ordenSeleccionada.id,
                    MetrosReal: totalMetros,
                    HoraInicioReal: horaInicioReal.format("YYYY-MM-DD HH:mm:ss"),
                    HoraFinReal: ahora.format("YYYY-MM-DD HH:mm:ss"),
                    FechaRegistroReal: ahora.format("YYYY-MM-DD"),
                    MetrosPorRollo: todosMetros,
                    HorasTotalReal: duracionHoras
                });

                await guardarEstadoOrden({
                    IdOrden: ordenSeleccionada.id,
                    NumeroOrden: ordenSeleccionada.orden,
                    EstadoOrden: "finalizado",
                    HoraInicioReal: horaInicioReal.format("YYYY-MM-DD HH:mm:ss"),
                    HoraFinReal: ahora.format("YYYY-MM-DD HH:mm:ss"),
                    MetrosTotales: totalMetros,
                    MetrosPorRollo: todosMetros
                });

                alert("Orden finalizada y datos guardados correctamente.");
            } catch (err) {
                console.error("Error finalizando la orden:", err);
                alert("Ocurrió un error al finalizar la orden. Reintente.");
            }
    };

    const guardarMetrosRollo = async (rollo) => {
        if (!ordenSeleccionada) return;
        const valor = Number(metrosRealesPorOrden[ordenSeleccionada.id][rollo] || 0);
        if (valor <= 0) return alert(`Por favor ingresa un valor válido para el rollo ${rollo}`);

        setChecksUsadosPorOrden(prev => ({
            ...prev,
            [ordenSeleccionada.id]: { ...(prev[ordenSeleccionada.id] || {}), [rollo]: true }
        }));

        try {
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: estadoOrden,
                HoraInicioReal: horaInicioReal ? horaInicioReal.format("YYYY-MM-DD HH:mm:ss") : null,
                HoraFinReal: horaFinReal ? horaFinReal.format("YYYY-MM-DD HH:mm:ss") : null,
                MetrosTotales: Object.values(metrosRealesPorOrden[ordenSeleccionada.id]).reduce((a, b) => a + Number(b || 0), 0),
                MetrosPorRollo: metrosRealesPorOrden[ordenSeleccionada.id],
            });

            alert(`Metros del rollo ${rollo} guardados correctamente.`);
        } catch (err) {
            console.error("Error guardando metros por rollo:", err);
            alert("Ocurrió un error al guardar los datos.");
        }
    };

    const metrosTotales = ordenSeleccionada
        ? Object.values(metrosRealesPorOrden[ordenSeleccionada.id] || {}).reduce((a, b) => a + Number(b || 0), 0)
        : 0;

    return (
        <>
            <Grid container padding={1}>
                {/* Barra de busqueda */}
                <Grid item xs={12} container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item container xs="auto" spacing={2} alignItems="center">
                        <Grid item>
                            <TextField placeholder="Buscar orden" variant="outlined" size="small" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()} />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar}>
                                Buscar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={() => { setBusqueda(""); setResultados(datos); setBusquedaActiva(false);}} >
                                Limpiar
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item container xs="auto" spacing={2} alignItems="center" justifyContent="flex-end">
                        <Grid item>
                            <Button variant={filtroEstado === "sin iniciar" ? "contained" : "outlined"} color="warning" onClick={() => setFiltroEstado("sin iniciar")}>Sin iniciar</Button>
                        </Grid>
                        <Grid item>
                            <Button variant={filtroEstado === "en proceso" ? "contained" : "outlined"} onClick={() => setFiltroEstado("en proceso")}>En proceso</Button>
                        </Grid>
                        <Grid item>
                            <Button variant={filtroEstado === "finalizado" ? "contained" : "outlined"} color="success" onClick={() => setFiltroEstado("finalizado")}>Finalizado</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => setFiltroEstado(null)}>Ver todos</Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* Cards */}
                <Grid item xs={12}>
                    <Card sx={{ width: '100%', borderRadius: '10px', boxShadow: '1px 1px 2px 3px rgba(0,0,0,0.4)', padding: 1, marginTop: '20px' }}>
                        <Grid container spacing={2}>
                            {resultados.length > 0 ? (
                                [...resultados].sort((a, b) => new Date(b.hora_inicio) - new Date(a.hora_inicio))
                                    .map((item, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={item.id || index}>
                                            <Box onClick={() => handleOpenPopup(item)} sx={{
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: '8px',
                                                padding: 2,
                                                boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                                                transition: 'transform 0.2s ease',
                                                cursor: 'pointer',
                                                '&:hover': { transform: 'scale(1.03)', boxShadow: '0px 4px 8px rgba(0,0,0,0.3)' },
                                            }}>

                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Orden #{item.orden}</Typography>
                                                <Typography variant="body2" color="text.secondary">Maquina: {item.maquina}</Typography>
                                                <Typography variant="body2" color="text.secondary">Proceso: {item.proceso}</Typography>
                                                <Typography variant="body2" color="text.secondary">Metros Reales: <b>{parseInt(item.metrosTotales ?? item.metros ,10)}</b></Typography>
                                                <Typography variant="caption" color="text.secondary">Inicio: {new Date(item.hora_inicio_real || item.hora_inicio).toLocaleString('es-AR', { hour12: false })}</Typography><br />
                                                <Typography variant="caption" color="text.secondary">Fin: {new Date(item.hora_fin_real || item.hora_fin).toLocaleString('es-AR', { hour12: false })}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Chip label={(estadosPorOrden[item.id] || 'sin iniciar').toUpperCase()}
                                                        color={(estadosPorOrden[item.id] || 'sin iniciar') === 'sin iniciar' ? 'warning' : (estadosPorOrden[item.id] || '').toLowerCase() === 'en proceso' ? 'primary' : 'success'}
                                                        sx={{ fontWeight: 'bold', fontSize: 10 }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))
                            ) : (
                                <Grid item xs={12} textAlign="center"><Typography>No hay datos disponibles</Typography></Grid>
                            )}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            {/* Popup */}
            <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <IconButton aria-label="close" onClick={handleClosePopup} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}><Typography variant="h4"><b>Orden #{ordenSeleccionada?.orden}</b></Typography></Grid>
                        <Grid item xs={12} sm={12} md={6}><Typography variant="h6" textAlign="center">Estado: <b>{estadoOrden.toUpperCase()}</b></Typography></Grid>
                    </Grid>
                    <hr />
                    <Box sx={{ marginBottom: 2 }}>
                        <Grid container spacing={2} marginBottom={1}>
                            <Grid item xs={12} sm={12} md={6}><Typography variant="h6">Metros Cargados: <b>{ordenSeleccionada ? parseInt(ordenSeleccionada.metros, 10) : 0}</b></Typography></Grid>
                            <Grid item xs={12} sm={12} md={6}><Typography variant="h6">Metros Reales: <b>{metrosTotales}</b></Typography></Grid>
                        </Grid>

                        <Grid container spacing={2} marginBottom={3}>
                            {horaInicioReal && (
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DateTimePicker label="Inicio Real" value={horaInicioReal} format="DD/MM/YYYY HH:mm" onChange={setHoraInicioReal} renderInput={(params) => <TextField {...params} fullWidth />} />
                                    </LocalizationProvider>
                                </Grid>
                            )}
                            {horaFinReal && (
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DateTimePicker label="Finalizacion Real" value={horaFinReal} format="DD/MM/YYYY HH:mm" onChange={setHoraFinReal} renderInput={(params) => <TextField {...params} fullWidth />} disabled={estadoOrden === "finalizado"} />
                                    </LocalizationProvider>
                                </Grid>
                            )}
                        </Grid>
                        <hr />

                        {/* Rollos */}
                        {(estadoOrden === "en proceso" || estadoOrden === "finalizado") && (
                            rollosAsignados.length > 0 ? (
                                <Box marginTop={2}>
                                    <Typography variant="h5"><b>Rollos asignados</b></Typography>
                                    <Grid container spacing={2}>
                                        {rollosAsignados.slice()
                                            .sort((a, b) => {
                                                const seqA = Number(a.secuencia_lr) || 0;
                                                const seqB = Number(b.secuencia_lr) || 0;
                                                return seqA - seqB;
                                            }).map((r, idx) => (
                                                <Grid item xs={12} sm={6} key={r.rollo || idx}>
                                                    <Typography variant="body1">Rollo: <b>{r.rollo}</b> Sec: <b>{r.secuencia_lr || 'N/A'}</b></Typography>
                                                    <Box display="flex" alignItems="center" gap="1">
                                                        <TextField type="text" label="Metros Reales" variant="outlined" size="small" fullWidth
                                                            inputProps={{ maxLength: 4, max: 9999 }}
                                                            value={metrosRealesPorOrden[ordenSeleccionada.id]?.[r.rollo] || ""}
                                                            onChange={(e) => {
                                                                const valor = e.target.value;
                                                                if (valor.length <= 4) {
                                                                    setMetrosRealesPorOrden(prev => ({
                                                                        ...prev,
                                                                        [ordenSeleccionada.id]: {
                                                                            ...prev[ordenSeleccionada.id],
                                                                            [r.rollo]: valor
                                                                        }
                                                                    }));
                                                                }
                                                            }}
                                                            disabled={(estadoOrden === "finalizado" && !usuarioAutorizado) || (checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] && !usuarioAutorizado)}
                                                        />
                                                        <IconButton color="primary" size="small" sx={{ mt: 1, marginLeft: 1, borderRadius: "8px", backgroundColor: "#e3f2fd", "&:hover": { backgroundColor: "#bbdefb" } }} onClick={() => guardarMetrosRollo(r.rollo)}
                                                            disabled={checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] && !usuarioAutorizado}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            ))}
                                    </Grid>
                                </Box>
                            ) : <Typography variant="body2" color="text.secondary" marginTop={2}>No hay rollos asignados</Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, marginTop: 3 }}>
                            <Typography variant="h6">Metros Totales: <b>{metrosTotales}</b></Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 3 }}>
                                <Button variant="outlined" startIcon={<CloseIcon />} color="error" onClick={handleClosePopup}>Cerrar</Button>
                                {estadoOrden === "sin iniciar" && <Button variant="contained" onClick={iniciarOrden}>Iniciar Orden</Button>}
                                {estadoOrden === "en proceso" && <Button variant="contained" onClick={finalizarOrden} color="error">Finalizar Orden</Button>}
                                {estadoOrden === "finalizado" && <Button variant="contained" disabled>Orden Finalizada</Button>}
                            </Box>
                        </Box>
                    </Box>
                    {/* Popup contraseña editar */}
                    <Dialog open={mostrarPassword} onClose={() => setMostrarPassword(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Autorización requerida</DialogTitle>
                        <DialogContent>
                            <TextField label="Contraseña" type="password" value={passwordIngresada} onChange={(e) => setPasswordIngresada(e.target.value)} size="small" fullWidth />
                            <Button variant="contained" sx={{ marginTop: 2 }} fullWidth
                                onClick={() => {
                                    if (passwordIngresada === PASSWORD_SUPERUSER) {
                                        setMostrarPassword(false);
                                        setPasswordIngresada("");
                                        setUsuarioAutorizado(true);
                                        alert("Autorización correcta. Ahora podés editar los metros.");
                                    } else {
                                        alert("Contraseña incorrecta.");
                                    }
                                }}>
                                Autorizar
                            </Button>
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </>
    );
}