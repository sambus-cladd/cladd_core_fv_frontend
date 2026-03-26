import React, { useEffect, useState } from 'react';
import {
    Grid, Card, Typography, Box, TextField, Button, Dialog,
    DialogTitle, DialogContent, IconButton, Pagination,
    FormControl, InputLabel, Select, MenuItem, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
    actualizarDatosReales, guardarEstadoOrden, getEstadoOrden,
    getSecuenciaRollo, getDatosOrdenes, getOrdenesGantt, validarLegajo
} from '../API/APIFunctions';
import { getStockRollosXOrden } from '../../../API/APIFunctions';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chip } from '@mui/material';
import 'dayjs/locale/es';
import dayjs from 'dayjs';

const obtenerTurnoActual = () => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 14) return "Mañana";
    if (hora >= 14 && hora < 22) return "Tarde";
    return "Noche";
};


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
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(12);
    const [turnoActual, setTurnoActual] = useState(obtenerTurnoActual());
    const [operario, setOperario] = useState("");
    const [mostrarDialogTurno, setMostrarDialogTurno] = useState(false);
    const [responsablesPorOrden, setResponsablesPorOrden] = useState({});
    const [turnoSeleccionado, setTurnoSeleccionado] = useState("");
    const [legajoOperario, setLegajoOperario] = useState("");
    const [abrirModalTurno, setAbrirModalTurno] = useState(false);

    const PASSWORD_SUPERUSER = "AdminProd";
    const PASSWORD_FORZAR = "ForzarFin";

    useEffect(() => {
        const fetchData = async () => {
            if (busquedaActiva) return;
            try {
                const response = await getOrdenesGantt();
                const datosPlanos = response.data.flat();

                // Para cada orden, traigo los datos de metros usando getDatosOrdenes
                const datosConMetros = await Promise.all(
                    datosPlanos.map(async (item) => {
                        try {
                            const res = await getDatosOrdenes(item.id);
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
            const dataRAW = await getStockRollosXOrden(Orden);
            const rollosPorOrden = dataRAW.data || [];
            const rollosConSecuencia = await Promise.all(
                rollosPorOrden.map(async (rollo) => {
                    const res = await getSecuenciaRollo(rollo.rollo);
                    const secuencia = res.success ? res.data.secuencia_lr : "N/A";
                    return { ...rollo, secuencia_lr: secuencia };
                })
            );

            setRollosAsignados(rollosConSecuencia);
        } catch (err) {
            console.error("Error obteniendo rollos con secuencia:", err);
            setRollosAsignados([]);
        }
    };

    const handleOpenPopup = async (item) => {
        setOrdenSeleccionada(item);
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
        setTurnoSeleccionado("");
        setLegajoOperario("");
        setResponsablesPorOrden(prev => ({
            ...prev,
            [item.id]: estado.responsable ? JSON.parse(estado.responsable) : []
        }));


        await GetDatosProd(item.orden);
        setOpenPopup(true);
        setMostrarDialogTurno(false);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setOrdenSeleccionada(null);
        setEstadoOrden("sin iniciar");
        setHoraInicioReal(null);
        setHoraFinReal(null);
        setUsuarioAutorizado(false);
        setPasswordIngresada("");
    };

    const iniciarOrden = async () => {
        if (!ordenSeleccionada) return;

        const listaExistente = responsablesPorOrden[ordenSeleccionada.id] || [];
        const ahora = dayjs();
        const nuevaFecha = ahora.format("YYYY-MM-DD");

        if (listaExistente.length === 0) {
            alert("Debe registrar el operario antes de iniciar una orden.");
            setMostrarDialogTurno(true);
            return;
        }

        const ultimoResponsable = listaExistente[listaExistente.length - 1];
        const mismoDiaYTurno =
            ultimoResponsable.turno === turnoActual &&
            ultimoResponsable.fecha === nuevaFecha;

        if (!mismoDiaYTurno) {
            alert("Debe registrar nuevamente el responsable para el turno o fecha actual.");
            setMostrarDialogTurno(true);
            return;
        }

        setHoraInicioReal(ahora);
        setEstadoOrden("en proceso");

        const nuevaLista = [...listaExistente];

        setResponsablesPorOrden((prev) => ({
            ...prev,
            [ordenSeleccionada.id]: nuevaLista,
        }));

        await guardarEstadoOrden({
            IdOrden: ordenSeleccionada.id,
            NumeroOrden: ordenSeleccionada.orden,
            EstadoOrden: "en proceso",
            HoraInicioReal: ahora.format("YYYY-MM-DD HH:mm:ss"),
            HoraFinReal: null,
            MetrosTotales: 0,
            MetrosPorRollo: {},
            Responsables: nuevaLista,
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
        const metrosCargados = Number(ordenSeleccionada.metros);
        const minPermitido = metrosCargados * 0.92; // 8% menos
        const maxPermitido = metrosCargados * 1.08; // 8% más

        if (totalMetros < minPermitido || totalMetros > maxPermitido) {
            return alert(
                `Los metros reales (${totalMetros}) deben estar dentro del rango permitido: 
             entre ${minPermitido.toFixed(2)} y ${maxPermitido.toFixed(2)}.`
            );
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
                    MetrosPorRollo: todosMetros,
                    Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
                });

                alert("Orden finalizada y datos guardados correctamente.");
            } catch (err) {
                console.error("Error finalizando la orden:", err);
                alert("Ocurrió un error al finalizar la orden. Reintente.");
            }
    };

    const finalizarOrdenForzado = async () => {
        if (!ordenSeleccionada) return;

        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const checks = checksUsadosPorOrden[ordenSeleccionada.id] || {};

        for (let rollo of rollosAsignados) {
            const valor = todosMetros[rollo.rollo];
            const confirmado = checks[rollo.rollo];
            if (!confirmado || !valor || isNaN(valor) || Number(valor) <= 0) {
                return alert(`Debes ingresar y confirmar metros reales para el rollo ${rollo.rollo}.`);
            }
        }

        const totalMetros = Object.values(todosMetros).reduce((acc, val) => acc + Number(val || 0), 0);
        if (totalMetros <= 0) {
            return alert("No se registraron metros reales.");
        }

        const ahora = dayjs();
        setHoraFinReal(ahora);
        setEstadoOrden("finalizado");

        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal)) {
            const diffMs = ahora.diff(horaInicioReal);
            duracionHoras = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
        }
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
                MetrosPorRollo: todosMetros,
                Operario: operario || "No definido",
                Turno: turnoActual || "No definido",
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
                Forzado: true,
            });

            alert("Orden finalizada FORZADA correctamente.");
        } catch (err) {
            console.error("Error finalizando la orden forzada:", err);
            alert("Ocurrió un error al finalizar la orden.");
        }
    };
    const handleAutorizar = () => {
        if (mostrarPassword === "editar") {
            if (passwordIngresada === PASSWORD_SUPERUSER) {
                setUsuarioAutorizado(true);
                alert("Autorización correcta. Ahora podés editar los metros.");
                setMostrarPassword(false);
                setPasswordIngresada("");
            } else {
                alert("Contraseña incorrecta.");
            }
        }
        if (mostrarPassword === "forzar") {
            if (passwordIngresada === PASSWORD_FORZAR) {
                alert("Autorización correcta. Se forzará la finalización.");
                setMostrarPassword(false);
                setPasswordIngresada("");
                finalizarOrdenForzado();
            } else {
                alert("Contraseña incorrecta.");
            }
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

        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const totalMetros = Object.values(todosMetros).reduce((a, b) => a + Number(b || 0), 0);
        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal) && horaFinReal && dayjs.isDayjs(horaFinReal)) {
            const diffMs = horaFinReal.diff(horaInicioReal);
            duracionHoras = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
        }
        try {
            await actualizarDatosReales({
                IdOrden: ordenSeleccionada.id,
                MetrosReal: totalMetros,
                HoraInicioReal: horaInicioReal ? horaInicioReal.format("YYYY-MM-DD HH:mm:ss") : null,
                HoraFinReal: horaFinReal ? horaFinReal.format("YYYY-MM-DD HH:mm:ss") : null,
                FechaRegistroReal: dayjs().format("YYYY-MM-DD"),
                MetrosPorRollo: todosMetros,
                HorasTotalReal: duracionHoras,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: estadoOrden,
                HoraInicioReal: horaInicioReal ? horaInicioReal.format("YYYY-MM-DD HH:mm:ss") : null,
                HoraFinReal: horaFinReal ? horaFinReal.format("YYYY-MM-DD HH:mm:ss") : null,
                MetrosTotales: totalMetros,
                MetrosPorRollo: todosMetros,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });

            alert(`Metros del rollo ${rollo} guardados correctamente.`);
        } catch (err) {
            console.error("Error guardando metros por rollo:", err);
            alert("Ocurrió un error al guardar los datos.");
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // calcula los datos de la paginacion
    const ordenMaquinas = [108, 123, 124, 146, 12, 160, 10];
    const sortedResults = [...resultados].sort((a, b) => {
        const indexA = ordenMaquinas.indexOf(Number(a.maquina));
        const indexB = ordenMaquinas.indexOf(Number(b.maquina));

        if (indexA !== indexB) {
            return indexA - indexB;
        }
        const fechaA = new Date(a.hora_inicio_real || a.hora_inicio || a.hora_fin_real || a.hora_fin);
        const fechaB = new Date(b.hora_inicio_real || b.hora_inicio || b.hora_fin_real || b.hora_fin);
        return fechaB - fechaA;
    });

    const paginatedResults = sortedResults.slice(
        (page - 1) * rowsPerPage,
        (page - 1) * rowsPerPage + rowsPerPage
    );

    const metrosTotales = ordenSeleccionada
        ? Object.values(metrosRealesPorOrden[ordenSeleccionada.id] || {}).reduce((a, b) => a + Number(b || 0), 0)
        : 0;

    useEffect(() => {
        const legajoGuardado = localStorage.getItem("operario_legajo");
        const turnoGuardado = localStorage.getItem("turno_legajo");
        const turnoAhora = obtenerTurnoActual();

        if (!legajoGuardado || turnoGuardado !== turnoAhora) {
            localStorage.removeItem("operario_legajo");
            localStorage.removeItem("turno_legajo");
            setOperario("");
            setMostrarDialogTurno(true);
        } else {
            setOperario(legajoGuardado);
            setTurnoActual(turnoGuardado);
        }
    }, []);

    useEffect(() => {
        const intervalo = setInterval(() => {
            const nuevoTurno = obtenerTurnoActual();

            if (nuevoTurno !== turnoActual) {
                localStorage.removeItem("operario_legajo");
                localStorage.removeItem("turno_legajo");
                setOperario("");
                setTurnoActual(nuevoTurno);
                setMostrarDialogTurno(true);
            }
        }, 60000);

        return () => clearInterval(intervalo);
    }, [turnoActual]);

    const confirmarOperario = async () => {
        if (!operario) {
            alert("Debe ingresar el legajo del operario.");
            return;
        }

        try {
            const resultadoValidacion = await validarLegajo(operario);
            console.log("📦 Respuesta validarLegajo:", resultadoValidacion);

            const operarioValido = Array.isArray(resultadoValidacion)
                ? resultadoValidacion[0]
                : resultadoValidacion?.data
                    ? resultadoValidacion.data
                    : resultadoValidacion;

            if (!operarioValido || !operarioValido.legajo) {
                alert("El legajo ingresado no es válido.");
                return;
            }

            const listaExistente = responsablesPorOrden[ordenSeleccionada?.id] || [];
            const nuevaFecha = dayjs().format("YYYY-MM-DD");

            const yaExiste = listaExistente.some(
                (r) =>
                    r.operario === operarioValido.legajo &&
                    r.turno === turnoActual &&
                    r.fecha === nuevaFecha
            );

            const nuevaLista = yaExiste
                ? listaExistente
                : [
                    ...listaExistente,
                    {
                        operario: operarioValido.legajo,
                        nombre: operarioValido.nombre,
                        turno: turnoActual,
                        fecha: nuevaFecha,
                    },
                ];

            setResponsablesPorOrden((prev) => ({
                ...prev,
                [ordenSeleccionada?.id]: nuevaLista,
            }));

            setMostrarDialogTurno(false);

            localStorage.setItem("operario_legajo", operarioValido.legajo);
            localStorage.setItem("turno_legajo", turnoActual);

            if (ordenSeleccionada) {
                await guardarEstadoOrden({
                    IdOrden: ordenSeleccionada.id,
                    NumeroOrden: ordenSeleccionada.orden,
                    EstadoOrden: estadoOrden,
                    HoraInicioReal: horaInicioReal ? horaInicioReal.format("YYYY-MM-DD HH:mm:ss") : null,
                    HoraFinReal: horaFinReal ? horaFinReal.format("YYYY-MM-DD HH:mm:ss") : null,
                    MetrosTotales: metrosTotales,
                    MetrosPorRollo: metrosRealesPorOrden[ordenSeleccionada.id] || {},
                    Responsables: nuevaLista,
                });
            }

        } catch (error) {
            console.error("Error al validar o guardar:", error);
            alert("Ocurrió un error al validar el legajo.");
        }
    };

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
                            <Button variant="outlined" color="primary" onClick={() => { setBusqueda(""); setResultados(datos); setBusquedaActiva(false); }} >
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
                            {paginatedResults.length > 0 ? (
                                paginatedResults.map((item, index) => (
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

                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>Orden #{item.orden}</Typography>
                                            <hr />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Maquina: {item.maquina}</Typography>
                                            <Typography variant="body1" color="text.secondary">Articulo: {item.articulo}</Typography>
                                            {/* <Typography variant="body2" color="text.secondary"><b>Maquina: {item.maquina}</b></Typography> */}
                                            <Typography variant="body1" color="text.secondary">Proceso: {item.proceso}</Typography>
                                            <Typography variant="body1" color="text.secondary">Metros Reales: <b>{parseInt(item.metrosTotales ?? item.metros, 10)}</b></Typography>
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

                    {/* Paginacion */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, }}>
                        <Pagination count={Math.ceil(resultados.length / rowsPerPage)}
                            page={page} onChange={handleChangePage} color="primary"
                        />
                    </Box>
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
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", justifyContent: "center" }}><b>MAQUINA {ordenSeleccionada?.maquina} </b></Typography>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}><Typography variant="h4"><b>Orden #{ordenSeleccionada?.orden}</b></Typography></Grid>
                        <Grid item xs={12} sm={12} md={6}><Typography variant="h6" textAlign="center" mt={0.5}>Estado: <b>{estadoOrden.toUpperCase()}</b></Typography></Grid>
                    </Grid>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={3}>
                            <Typography sx={{ fontSize: 18 }}><b>Responsables:</b></Typography>
                        </Grid>
                        {/* Mostrar todos los responsables registrados */}
                        <Grid item xs={12} sm={12} md={9}>
                            {responsablesPorOrden[ordenSeleccionada?.id]?.length > 0 ? (
                                responsablesPorOrden[ordenSeleccionada.id].map((r, idx) => (
                                    <Typography key={idx} variant="body1">
                                        🔹Operario: <b>{r.nombre || "Sin nombre"}</b> - Turno: <b>{r.turno}</b>
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body1">Sin responsables registrados</Typography>
                            )}
                        </Grid>
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
                                            })
                                            .map((r, idx) => {

                                                const numeroRollo = idx + 1;
                                                return (
                                                    <Grid item xs={12} sm={6} key={r.rollo || idx}>
                                                        <Typography variant="body1">
                                                            <b>R{numeroRollo}</b> - Rollo: <b>{r.rollo}</b> - Sec: <b>{r.secuencia_lr || 'N/A'}</b>
                                                        </Typography>

                                                        <Box display="flex" alignItems="center" gap="1">
                                                            <TextField
                                                                type="text"
                                                                label="Metros Reales"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
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
                                                                disabled={(estadoOrden === "finalizado" && !usuarioAutorizado)
                                                                    || (checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] && !usuarioAutorizado)}
                                                            />

                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                sx={{
                                                                    mt: 1,
                                                                    marginLeft: 1,
                                                                    borderRadius: "8px",
                                                                    backgroundColor: "#e3f2fd",
                                                                    "&:hover": { backgroundColor: "#bbdefb" }
                                                                }}
                                                                onClick={() => guardarMetrosRollo(r.rollo)}
                                                                disabled={checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] && !usuarioAutorizado}
                                                            >
                                                                <CheckIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                );
                                            })}

                                    </Grid>
                                </Box>
                            ) : <Typography variant="body2" color="text.secondary" marginTop={2}>No hay rollos asignados</Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, marginTop: 2 }}>
                            <Typography variant="h6">Metros Totales: <b>{metrosTotales}</b></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
                            {!usuarioAutorizado && (
                                <Button variant="outlined" color="primary" onClick={() => setMostrarPassword("editar")} >
                                    Editar Metros
                                </Button>
                            )}
                            <Button variant="outlined" startIcon={<CloseIcon />} color="error" onClick={handleClosePopup}>Cerrar</Button>
                            {estadoOrden === "sin iniciar" && <Button variant="contained" onClick={iniciarOrden}>Iniciar Orden</Button>}
                            {/* {estadoOrden === "en proceso" && <Button variant="contained" onClick={finalizarOrden} color="error">Finalizar Orden</Button>} */}
                            {estadoOrden === "en proceso" && (
                                <>
                                    {metrosTotales >= ordenSeleccionada.metros * 0.92 && metrosTotales <= ordenSeleccionada.metros * 1.08 && (
                                        <Button variant="contained" color="error" onClick={finalizarOrden}>
                                            Finalizar Orden
                                        </Button>
                                    )}
                                    {(metrosTotales < ordenSeleccionada.metros * 0.92 || metrosTotales > ordenSeleccionada.metros * 1.08) && (
                                        <Button variant="outlined" color="warning" onClick={() => setMostrarPassword("forzar")}>
                                            Forzar Finalización
                                        </Button>
                                    )}
                                </>
                            )}
                            {estadoOrden === "finalizado" && <Button variant="contained" disabled>Orden Finalizada</Button>}
                        </Box>
                    </Box>

                    {/* Popup contraseña editar */}
                    <Dialog open={!!mostrarPassword} onClose={() => setMostrarPassword(false)} maxWidth="xs" fullWidth >
                        <DialogTitle>
                            {mostrarPassword === "forzar" ? "Autorización para Forzar Finalización" : "Autorización requerida"}
                        </DialogTitle>
                        <DialogContent>
                            <TextField label="Contraseña" type="password" value={passwordIngresada}
                                onChange={(e) => setPasswordIngresada(e.target.value)} size="small" fullWidth
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAutorizar();
                                }}
                            />
                            <Button variant="contained" sx={{ marginTop: 2 }} fullWidth onClick={handleAutorizar} >
                                Autorizar
                            </Button>
                        </DialogContent>
                    </Dialog>

                    {/* Popup ingresar legajo y turno */}
                    <Dialog open={mostrarDialogTurno}>
                        <DialogTitle>Registrar Turno y Operario</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ mb: 2 }}>
                                Turno actual: <b>{turnoActual}</b>
                            </Typography>
                            <TextField
                                label="Legajo Operario"
                                fullWidth
                                value={operario}
                                onChange={(e) => setOperario(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && confirmarOperario()}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="error" variant="outlined" onClick={() => { setMostrarDialogTurno(false); handleClosePopup(); }} >
                                Cancelar
                            </Button>
                            <Button variant="outlined" onClick={confirmarOperario}>
                                Confirmar
                            </Button>

                        </DialogActions>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </>
    );
}