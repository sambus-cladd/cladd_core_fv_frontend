import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Typography, Box, TextField, Button, Dialog,
    DialogTitle, DialogContent, IconButton, Pagination,
    DialogActions, Snackbar, Alert, Chip, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
    actualizarDatosReales, guardarEstadoOrden, getEstadoOrden,
    getSecuenciaRollo, getOrdenesGantt, validarLegajo
} from '../API/APIFunctions';
import { getStockRollosXOrden } from '../../../API/APIFunctions';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import {
    colors, typography, statusCard
} from '../../../../../styles/alpacladdFvDesignTokens';
import {
    loadCache, saveCache, fingerprintList, compareFingerprints
} from './confirmarProduccionCache';

const obtenerTurnoActual = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 14) return 'Mañana';
    if (hora >= 14 && hora < 22) return 'Tarde';
    return 'Noche';
};

const primaryBtnSx = {
    background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
    fontFamily: 'Poppins',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '10px',
    boxShadow: 'none',
    '&:hover': { background: '#1A4862' },
};

const filterPillSx = (active) => ({
    fontFamily: 'Poppins',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '999px',
    px: 1.5,
    border: `1px solid ${active ? colors.tabIndicator : 'rgba(26,72,98,0.18)'}`,
    backgroundColor: active ? 'rgba(25,118,210,0.12)' : '#fff',
    color: active ? colors.tabIndicator : colors.textMuted,
    boxShadow: active ? '0 2px 6px rgba(25,118,210,0.18)' : 'none',
    '&:hover': {
        backgroundColor: active ? 'rgba(25,118,210,0.18)' : 'rgba(26,72,98,0.04)',
        borderColor: colors.tabIndicator,
    },
});

const ORDEN_MAQUINAS = [108, 123, 124, 146, 12, 160, 10];

const normalizeEstado = (estado) => {
    if (!estado || typeof estado !== 'string') return 'sin iniciar';
    return estado.trim().toLowerCase() || 'sin iniciar';
};

const chipColor = (estado) => {
    const e = normalizeEstado(estado);
    if (e === 'sin iniciar') return 'warning';
    if (e === 'en proceso') return 'primary';
    return 'success';
};

export default function ConfirmarProduccion() {
    const [datos, setDatos] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [rollosAsignados, setRollosAsignados] = useState([]);
    const [estadoOrden, setEstadoOrden] = useState('sin iniciar');
    const [horaInicioReal, setHoraInicioReal] = useState(null);
    const [horaFinReal, setHoraFinReal] = useState(null);
    const [metrosRealesPorOrden, setMetrosRealesPorOrden] = useState({});
    const [checksUsadosPorOrden, setChecksUsadosPorOrden] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [estadosPorOrden, setEstadosPorOrden] = useState({});
    const [filtroEstado, setFiltroEstado] = useState(null);
    const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [passwordIngresada, setPasswordIngresada] = useState('');
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(12);
    const [turnoActual, setTurnoActual] = useState(obtenerTurnoActual());
    const [operario, setOperario] = useState('');
    const [mostrarDialogTurno, setMostrarDialogTurno] = useState(false);
    const [responsablesPorOrden, setResponsablesPorOrden] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [loadingIniciar, setLoadingIniciar] = useState(false);
    const [loadingFinalizar, setLoadingFinalizar] = useState(false);
    const [loadingLegajo, setLoadingLegajo] = useState(false);
    const [loadingMetrosRollo, setLoadingMetrosRollo] = useState(null);
    const [pendingLegajoAction, setPendingLegajoAction] = useState(null);

    const openPopupRef = useRef(false);
    const filtroEstadoRef = useRef(filtroEstado);
    const busquedaActivaRef = useRef(busquedaActiva);
    const busquedaRef = useRef(busqueda);

    const PASSWORD_SUPERUSER = 'AdminProd';
    const PASSWORD_FORZAR = 'ForzarFin';

    const showSnack = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => { openPopupRef.current = openPopup; }, [openPopup]);
    useEffect(() => { filtroEstadoRef.current = filtroEstado; }, [filtroEstado]);
    useEffect(() => { busquedaActivaRef.current = busquedaActiva; }, [busquedaActiva]);
    useEffect(() => { busquedaRef.current = busqueda; }, [busqueda]);

    const applyClientFilters = useCallback((items, estadosMap, filtro, terminoBusqueda) => {
        let lista = [...(items || [])];
        const term = (terminoBusqueda || '').trim();
        if (term) {
            lista = lista.filter((item) => String(item.orden || '') === term);
        }
        if (filtro) {
            lista = lista.filter(
                (item) => normalizeEstado(estadosMap[item.id] || item.estado_orden) === normalizeEstado(filtro)
            );
        }
        return lista;
    }, []);

    const buildEstadosFromItems = (items, prevEstados = {}) => {
        const estados = { ...prevEstados };
        (items || []).forEach((item) => {
            if (item?.id == null) return;
            if (item.estado_orden != null && String(item.estado_orden).trim() !== '') {
                estados[item.id] = normalizeEstado(item.estado_orden);
            } else if (!estados[item.id]) {
                estados[item.id] = 'sin iniciar';
            }
        });
        return estados;
    };

    const normalizeItems = (rawItems) =>
        (rawItems || []).map((item) => ({
            ...item,
            metrosTotales: Number(
                item.metros_confirmados ?? item.metrosTotales ?? item.metros_totales ?? item.metros_real ?? item.metros ?? 0
            ),
            estado_orden: normalizeEstado(item.estado_orden),
        }));

    const resolveMissingEstados = async (items, estadosSeed) => {
        const estados = { ...estadosSeed };
        const missing = (items || []).filter((it) => {
            const hasJoin = it.estado_orden != null && String(it.estado_orden).trim() !== '';
            return !hasJoin && !estados[it.id];
        });
        if (missing.length === 0) return estados;

        await Promise.allSettled(
            missing.map(async (it) => {
                try {
                    const r = await getEstadoOrden(it.id);
                    estados[it.id] =
                        r?.success && r?.data?.estado_orden
                            ? normalizeEstado(r.data.estado_orden)
                            : 'sin iniciar';
                } catch {
                    estados[it.id] = 'sin iniciar';
                }
            })
        );
        return estados;
    };

    const revalidateList = useCallback(async ({ force = false, silent = false } = {}) => {
        if (!force && openPopupRef.current && silent) return;
        if (busquedaActivaRef.current && !force) return;

        try {
            const response = await getOrdenesGantt();
            const datosPlanos = normalizeItems(
                Array.isArray(response?.data) ? response.data.flat() : []
            );

            const prevCache = loadCache();
            let estados = buildEstadosFromItems(datosPlanos, prevCache?.estados || {});
            estados = await resolveMissingEstados(datosPlanos, estados);

            const prevFp = fingerprintList(prevCache?.items || [], prevCache?.estados || {});
            const nextFp = fingerprintList(datosPlanos, estados);
            const diff = compareFingerprints(prevFp, nextFp);

            if (!diff.changed && prevCache?.items?.length) {
                return;
            }

            setDatos(datosPlanos);
            setEstadosPorOrden(estados);
            setResultados(
                applyClientFilters(
                    datosPlanos,
                    estados,
                    filtroEstadoRef.current,
                    busquedaActivaRef.current ? busquedaRef.current : ''
                )
            );
            saveCache({ items: datosPlanos, estados });
        } catch (error) {
            console.error('Error al obtener los datos de gantt', error);
            if (!silent) showSnack('No se pudieron cargar las órdenes', 'error');
        }
    }, [applyClientFilters]);

    // Hydrate cache instantly, then revalidate
    useEffect(() => {
        const cached = loadCache();
        if (cached?.items?.length) {
            setDatos(cached.items);
            setEstadosPorOrden(cached.estados || {});
            setResultados(cached.items);
        }

        const legajoGuardado = localStorage.getItem('operario_legajo');
        const turnoGuardado = localStorage.getItem('turno_legajo');
        const turnoAhora = obtenerTurnoActual();
        if (legajoGuardado && turnoGuardado === turnoAhora) {
            setOperario(legajoGuardado);
            setTurnoActual(turnoGuardado);
        } else {
            localStorage.removeItem('operario_legajo');
            localStorage.removeItem('turno_legajo');
            setOperario('');
            setTurnoActual(turnoAhora);
        }

        revalidateList({ force: true });
        const interval = setInterval(() => revalidateList({ silent: true }), 60000);
        return () => clearInterval(interval);
    }, [revalidateList]);

    useEffect(() => {
        if (busquedaActiva) return;
        setResultados(applyClientFilters(datos, estadosPorOrden, filtroEstado, ''));
        setPage(1);
    }, [datos, filtroEstado, estadosPorOrden, busquedaActiva, applyClientFilters]);

    useEffect(() => {
        const intervalo = setInterval(() => {
            const nuevoTurno = obtenerTurnoActual();
            if (nuevoTurno !== turnoActual) {
                localStorage.removeItem('operario_legajo');
                localStorage.removeItem('turno_legajo');
                setOperario('');
                setTurnoActual(nuevoTurno);
            }
        }, 60000);
        return () => clearInterval(intervalo);
    }, [turnoActual]);

    const GetDatosProd = async (Orden) => {
        if (!Orden) return;
        try {
            const dataRAW = await getStockRollosXOrden(Orden);
            const rollosPorOrden = dataRAW.data || [];
            const rollosConSecuencia = await Promise.all(
                rollosPorOrden.map(async (rollo) => {
                    const res = await getSecuenciaRollo(rollo.rollo);
                    const secuencia = res.success ? res.data.secuencia_lr : 'N/A';
                    return { ...rollo, secuencia_lr: secuencia };
                })
            );
            setRollosAsignados(rollosConSecuencia);
        } catch (err) {
            console.error('Error obteniendo rollos con secuencia:', err);
            setRollosAsignados([]);
        }
    };

    const syncCacheEstado = (idOrden, nuevoEstado, patchItem = {}) => {
        setEstadosPorOrden((prev) => {
            const nextEstados = { ...prev, [idOrden]: normalizeEstado(nuevoEstado) };
            setDatos((prevDatos) => {
                const nextDatos = prevDatos.map((it) =>
                    it.id === idOrden
                        ? { ...it, ...patchItem, estado_orden: normalizeEstado(nuevoEstado) }
                        : it
                );
                saveCache({ items: nextDatos, estados: nextEstados });
                return nextDatos;
            });
            return nextEstados;
        });
    };

    const handleBuscar = () => {
        const filtro = busqueda.trim();
        if (filtro === '') {
            setBusquedaActiva(false);
            setResultados(applyClientFilters(datos, estadosPorOrden, filtroEstado, ''));
            setPage(1);
            return;
        }
        const candidatos = datos.filter((item) => String(item.orden || '') === filtro);
        const filtrados = applyClientFilters(candidatos, estadosPorOrden, filtroEstado, filtro);
        setResultados(filtrados);
        setBusquedaActiva(true);
        setPage(1);
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
            console.error('Error obteniendo estado orden:', err);
        }

        setMetrosRealesPorOrden((prev) => ({
            ...prev,
            [item.id]: estado.metros_por_rollo ? JSON.parse(estado.metros_por_rollo) : {},
        }));
        setChecksUsadosPorOrden((prev) => ({
            ...prev,
            [item.id]: estado.metros_por_rollo
                ? Object.keys(JSON.parse(estado.metros_por_rollo)).reduce((acc, r) => ({ ...acc, [r]: true }), {})
                : {},
        }));
        const est = normalizeEstado(estado.estado_orden || item.estado_orden || estadosPorOrden[item.id]);
        setEstadoOrden(est);
        setHoraInicioReal(estado.hora_inicio_real ? dayjs(estado.hora_inicio_real) : null);
        setHoraFinReal(estado.hora_fin_real ? dayjs(estado.hora_fin_real) : null);
        setResponsablesPorOrden((prev) => ({
            ...prev,
            [item.id]: estado.responsable ? JSON.parse(estado.responsable) : [],
        }));

        await GetDatosProd(item.orden);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setOrdenSeleccionada(null);
        setEstadoOrden('sin iniciar');
        setHoraInicioReal(null);
        setHoraFinReal(null);
        setUsuarioAutorizado(false);
        setPasswordIngresada('');
        setPendingLegajoAction(null);
    };

    const tieneResponsableTurnoActual = (idOrden) => {
        const lista = responsablesPorOrden[idOrden] || [];
        const fecha = dayjs().format('YYYY-MM-DD');
        return lista.some((r) => r.turno === turnoActual && r.fecha === fecha);
    };

    const pedirLegajoSiFalta = (action) => {
        if (ordenSeleccionada && tieneResponsableTurnoActual(ordenSeleccionada.id)) return false;
        setPendingLegajoAction(action);
        setMostrarDialogTurno(true);
        return true;
    };

    const iniciarOrden = async (responsablesOverride = null) => {
        if (!ordenSeleccionada) return;
        const listaExistente =
            responsablesOverride || responsablesPorOrden[ordenSeleccionada.id] || [];

        if (!responsablesOverride) {
            const fecha = dayjs().format('YYYY-MM-DD');
            const ok = listaExistente.some((r) => r.turno === turnoActual && r.fecha === fecha);
            if (!ok) {
                setPendingLegajoAction('iniciar');
                setMostrarDialogTurno(true);
                return;
            }
        }

        const ahora = dayjs();
        setLoadingIniciar(true);
        try {
            setHoraInicioReal(ahora);
            setEstadoOrden('en proceso');
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: 'en proceso',
                HoraInicioReal: ahora.format('YYYY-MM-DD HH:mm:ss'),
                HoraFinReal: null,
                MetrosTotales: 0,
                MetrosPorRollo: {},
                Responsables: listaExistente,
            });
            syncCacheEstado(ordenSeleccionada.id, 'en proceso');
            showSnack('Orden iniciada correctamente', 'success');
        } catch (err) {
            console.error(err);
            showSnack('Error al iniciar la orden', 'error');
        } finally {
            setLoadingIniciar(false);
        }
    };

    const finalizarOrden = async () => {
        if (!ordenSeleccionada) return;
        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const checks = checksUsadosPorOrden[ordenSeleccionada.id] || {};

        for (const rollo of rollosAsignados) {
            const valor = todosMetros[rollo.rollo];
            const confirmado = checks[rollo.rollo];
            if (!confirmado || !valor || isNaN(valor) || Number(valor) <= 0) {
                return showSnack(`Debés confirmar metros reales para el rollo ${rollo.rollo}`, 'warning');
            }
        }

        const totalMetros = Object.values(todosMetros).reduce((acc, val) => acc + Number(val || 0), 0);
        if (totalMetros <= 0) {
            return showSnack('No se registraron metros reales', 'warning');
        }

        const metrosCargados = Number(ordenSeleccionada.metros);
        const minPermitido = metrosCargados * 0.92;
        const maxPermitido = metrosCargados * 1.08;
        if (totalMetros < minPermitido || totalMetros > maxPermitido) {
            return showSnack(
                `Metros (${totalMetros}) fuera del rango ±8%: ${minPermitido.toFixed(0)} – ${maxPermitido.toFixed(0)}`,
                'warning'
            );
        }

        const ahora = dayjs();
        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal)) {
            duracionHoras = Number((ahora.diff(horaInicioReal) / (1000 * 60 * 60)).toFixed(2));
        }

        setLoadingFinalizar(true);
        try {
            setHoraFinReal(ahora);
            setEstadoOrden('finalizado');
            await actualizarDatosReales({
                IdOrden: ordenSeleccionada.id,
                MetrosReal: totalMetros,
                HoraInicioReal: horaInicioReal.format('YYYY-MM-DD HH:mm:ss'),
                HoraFinReal: ahora.format('YYYY-MM-DD HH:mm:ss'),
                FechaRegistroReal: ahora.format('YYYY-MM-DD'),
                MetrosPorRollo: todosMetros,
                HorasTotalReal: duracionHoras,
            });
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: 'finalizado',
                HoraInicioReal: horaInicioReal.format('YYYY-MM-DD HH:mm:ss'),
                HoraFinReal: ahora.format('YYYY-MM-DD HH:mm:ss'),
                MetrosTotales: totalMetros,
                MetrosPorRollo: todosMetros,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });
            syncCacheEstado(ordenSeleccionada.id, 'finalizado', { metrosTotales: totalMetros, metros_confirmados: totalMetros });
            showSnack('Orden finalizada correctamente', 'success');
        } catch (err) {
            console.error(err);
            showSnack('Error al finalizar la orden', 'error');
        } finally {
            setLoadingFinalizar(false);
        }
    };

    const finalizarOrdenForzado = async () => {
        if (!ordenSeleccionada) return;
        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const checks = checksUsadosPorOrden[ordenSeleccionada.id] || {};

        for (const rollo of rollosAsignados) {
            const valor = todosMetros[rollo.rollo];
            const confirmado = checks[rollo.rollo];
            if (!confirmado || !valor || isNaN(valor) || Number(valor) <= 0) {
                return showSnack(`Debés confirmar metros del rollo ${rollo.rollo}`, 'warning');
            }
        }

        const totalMetros = Object.values(todosMetros).reduce((acc, val) => acc + Number(val || 0), 0);
        if (totalMetros <= 0) return showSnack('No se registraron metros reales', 'warning');

        const ahora = dayjs();
        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal)) {
            duracionHoras = Number((ahora.diff(horaInicioReal) / (1000 * 60 * 60)).toFixed(2));
        }

        setLoadingFinalizar(true);
        try {
            setHoraFinReal(ahora);
            setEstadoOrden('finalizado');
            await actualizarDatosReales({
                IdOrden: ordenSeleccionada.id,
                MetrosReal: totalMetros,
                HoraInicioReal: horaInicioReal.format('YYYY-MM-DD HH:mm:ss'),
                HoraFinReal: ahora.format('YYYY-MM-DD HH:mm:ss'),
                FechaRegistroReal: ahora.format('YYYY-MM-DD'),
                MetrosPorRollo: todosMetros,
                HorasTotalReal: duracionHoras,
            });
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: 'finalizado',
                HoraInicioReal: horaInicioReal.format('YYYY-MM-DD HH:mm:ss'),
                HoraFinReal: ahora.format('YYYY-MM-DD HH:mm:ss'),
                MetrosTotales: totalMetros,
                MetrosPorRollo: todosMetros,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });
            syncCacheEstado(ordenSeleccionada.id, 'finalizado', { metrosTotales: totalMetros, metros_confirmados: totalMetros });
            showSnack('Orden finalizada (forzada)', 'success');
        } catch (err) {
            console.error(err);
            showSnack('Error al forzar finalización', 'error');
        } finally {
            setLoadingFinalizar(false);
        }
    };

    const handleAutorizar = () => {
        if (mostrarPassword === 'editar') {
            if (passwordIngresada === PASSWORD_SUPERUSER) {
                setUsuarioAutorizado(true);
                showSnack('Autorización correcta. Podés editar metros.', 'success');
                setMostrarPassword(false);
                setPasswordIngresada('');
            } else {
                showSnack('Contraseña incorrecta', 'error');
            }
        }
        if (mostrarPassword === 'forzar') {
            if (passwordIngresada === PASSWORD_FORZAR) {
                setMostrarPassword(false);
                setPasswordIngresada('');
                finalizarOrdenForzado();
            } else {
                showSnack('Contraseña incorrecta', 'error');
            }
        }
    };

    const guardarMetrosRollo = async (rollo) => {
        if (!ordenSeleccionada) return;
        if (pedirLegajoSiFalta(`metros:${rollo}`)) return;

        const valor = Number(metrosRealesPorOrden[ordenSeleccionada.id]?.[rollo] || 0);
        if (valor <= 0) return showSnack(`Valor inválido para el rollo ${rollo}`, 'warning');

        setLoadingMetrosRollo(rollo);
        setChecksUsadosPorOrden((prev) => ({
            ...prev,
            [ordenSeleccionada.id]: { ...(prev[ordenSeleccionada.id] || {}), [rollo]: true },
        }));

        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
        const totalMetros = Object.values(todosMetros).reduce((a, b) => a + Number(b || 0), 0);
        let duracionHoras = 0;
        if (horaInicioReal && dayjs.isDayjs(horaInicioReal) && horaFinReal && dayjs.isDayjs(horaFinReal)) {
            duracionHoras = Number((horaFinReal.diff(horaInicioReal) / (1000 * 60 * 60)).toFixed(2));
        }

        try {
            await actualizarDatosReales({
                IdOrden: ordenSeleccionada.id,
                MetrosReal: totalMetros,
                HoraInicioReal: horaInicioReal ? horaInicioReal.format('YYYY-MM-DD HH:mm:ss') : null,
                HoraFinReal: horaFinReal ? horaFinReal.format('YYYY-MM-DD HH:mm:ss') : null,
                FechaRegistroReal: dayjs().format('YYYY-MM-DD'),
                MetrosPorRollo: todosMetros,
                HorasTotalReal: duracionHoras,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });
            await guardarEstadoOrden({
                IdOrden: ordenSeleccionada.id,
                NumeroOrden: ordenSeleccionada.orden,
                EstadoOrden: estadoOrden,
                HoraInicioReal: horaInicioReal ? horaInicioReal.format('YYYY-MM-DD HH:mm:ss') : null,
                HoraFinReal: horaFinReal ? horaFinReal.format('YYYY-MM-DD HH:mm:ss') : null,
                MetrosTotales: totalMetros,
                MetrosPorRollo: todosMetros,
                Responsables: responsablesPorOrden[ordenSeleccionada.id] || [],
            });
            syncCacheEstado(ordenSeleccionada.id, estadoOrden, { metrosTotales: totalMetros, metros_confirmados: totalMetros });
            showSnack(`Metros del rollo ${rollo} guardados`, 'success');
        } catch (err) {
            console.error(err);
            showSnack('Error al guardar metros', 'error');
        } finally {
            setLoadingMetrosRollo(null);
        }
    };

    const confirmarOperario = async () => {
        if (!operario) {
            showSnack('Ingresá el legajo del operario', 'warning');
            return;
        }
        setLoadingLegajo(true);
        try {
            const resultadoValidacion = await validarLegajo(operario);
            const operarioValido = Array.isArray(resultadoValidacion)
                ? resultadoValidacion[0]
                : resultadoValidacion?.data
                    ? resultadoValidacion.data
                    : resultadoValidacion;

            if (!operarioValido || !operarioValido.legajo) {
                showSnack('Legajo no válido', 'error');
                return;
            }

            const listaExistente = responsablesPorOrden[ordenSeleccionada?.id] || [];
            const nuevaFecha = dayjs().format('YYYY-MM-DD');
            const yaExiste = listaExistente.some(
                (r) => r.operario === operarioValido.legajo && r.turno === turnoActual && r.fecha === nuevaFecha
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

            if (ordenSeleccionada) {
                setResponsablesPorOrden((prev) => ({
                    ...prev,
                    [ordenSeleccionada.id]: nuevaLista,
                }));
            }

            setMostrarDialogTurno(false);
            localStorage.setItem('operario_legajo', operarioValido.legajo);
            localStorage.setItem('turno_legajo', turnoActual);
            setOperario(operarioValido.legajo);

            if (ordenSeleccionada) {
                await guardarEstadoOrden({
                    IdOrden: ordenSeleccionada.id,
                    NumeroOrden: ordenSeleccionada.orden,
                    EstadoOrden: estadoOrden,
                    HoraInicioReal: horaInicioReal ? horaInicioReal.format('YYYY-MM-DD HH:mm:ss') : null,
                    HoraFinReal: horaFinReal ? horaFinReal.format('YYYY-MM-DD HH:mm:ss') : null,
                    MetrosTotales: Object.values(metrosRealesPorOrden[ordenSeleccionada.id] || {}).reduce(
                        (a, b) => a + Number(b || 0),
                        0
                    ),
                    MetrosPorRollo: metrosRealesPorOrden[ordenSeleccionada.id] || {},
                    Responsables: nuevaLista,
                });
            }

            const action = pendingLegajoAction;
            setPendingLegajoAction(null);
            if (action === 'iniciar') {
                await iniciarOrden(nuevaLista);
            } else if (action && String(action).startsWith('metros:')) {
                const rollo = String(action).slice(7);
                // responsables already set above; small delay not needed if we skip pedirLegajo with override path
                setResponsablesPorOrden((prev) => ({
                    ...prev,
                    [ordenSeleccionada.id]: nuevaLista,
                }));
                // Direct save path after legajo — re-check happens with updated state on next click if needed
                await (async () => {
                    const valor = Number(metrosRealesPorOrden[ordenSeleccionada.id]?.[rollo] || 0);
                    if (valor <= 0) {
                        showSnack(`Valor inválido para el rollo ${rollo}`, 'warning');
                        return;
                    }
                    setLoadingMetrosRollo(rollo);
                    try {
                        const todosMetros = metrosRealesPorOrden[ordenSeleccionada.id] || {};
                        const totalMetros = Object.values(todosMetros).reduce((a, b) => a + Number(b || 0), 0);
                        setChecksUsadosPorOrden((prev) => ({
                            ...prev,
                            [ordenSeleccionada.id]: { ...(prev[ordenSeleccionada.id] || {}), [rollo]: true },
                        }));
                        await actualizarDatosReales({
                            IdOrden: ordenSeleccionada.id,
                            MetrosReal: totalMetros,
                            HoraInicioReal: horaInicioReal ? horaInicioReal.format('YYYY-MM-DD HH:mm:ss') : null,
                            HoraFinReal: horaFinReal ? horaFinReal.format('YYYY-MM-DD HH:mm:ss') : null,
                            FechaRegistroReal: dayjs().format('YYYY-MM-DD'),
                            MetrosPorRollo: todosMetros,
                            HorasTotalReal: 0,
                            Responsables: nuevaLista,
                        });
                        await guardarEstadoOrden({
                            IdOrden: ordenSeleccionada.id,
                            NumeroOrden: ordenSeleccionada.orden,
                            EstadoOrden: estadoOrden,
                            HoraInicioReal: horaInicioReal ? horaInicioReal.format('YYYY-MM-DD HH:mm:ss') : null,
                            HoraFinReal: horaFinReal ? horaFinReal.format('YYYY-MM-DD HH:mm:ss') : null,
                            MetrosTotales: totalMetros,
                            MetrosPorRollo: todosMetros,
                            Responsables: nuevaLista,
                        });
                        syncCacheEstado(ordenSeleccionada.id, estadoOrden, {
                            metrosTotales: totalMetros,
                            metros_confirmados: totalMetros,
                        });
                        showSnack(`Metros del rollo ${rollo} guardados`, 'success');
                    } catch (e) {
                        console.error(e);
                        showSnack('Error al guardar metros', 'error');
                    } finally {
                        setLoadingMetrosRollo(null);
                    }
                })();
            }
        } catch (error) {
            console.error(error);
            showSnack('Error al validar el legajo', 'error');
        } finally {
            setLoadingLegajo(false);
        }
    };

    const sortedResults = [...resultados].sort((a, b) => {
        const indexA = ORDEN_MAQUINAS.indexOf(Number(a.maquina));
        const indexB = ORDEN_MAQUINAS.indexOf(Number(b.maquina));
        if (indexA !== indexB) return indexA - indexB;
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

    const metrosCargadosPopup = ordenSeleccionada ? Number(ordenSeleccionada.metros) || 0 : 0;
    const minMetros = metrosCargadosPopup * 0.92;
    const maxMetros = metrosCargadosPopup * 1.08;

    return (
        <>
            <Box sx={{ px: { xs: 1, md: 2 }, py: 1.5, fontFamily: typography.fontFamily }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                        <TextField
                            placeholder="Buscar orden"
                            variant="outlined"
                            size="small"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                            sx={{ minWidth: 160, backgroundColor: '#fff', borderRadius: '10px' }}
                        />
                        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar} sx={primaryBtnSx}>
                            Buscar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setBusqueda('');
                                setBusquedaActiva(false);
                                setResultados(applyClientFilters(datos, estadosPorOrden, filtroEstado, ''));
                            }}
                            sx={{ fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px' }}
                        >
                            Limpiar
                        </Button>
                        {operario ? (
                            <Chip
                                label={`Operario ${operario} · ${turnoActual}`}
                                size="small"
                                sx={{ fontFamily: 'Poppins', fontWeight: 600 }}
                            />
                        ) : (
                            <Chip
                                label={`Turno ${turnoActual} · sin legajo`}
                                size="small"
                                variant="outlined"
                                onClick={() => setMostrarDialogTurno(true)}
                                sx={{ fontFamily: 'Poppins', cursor: 'pointer' }}
                            />
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.75,
                            p: 0.75,
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid rgba(26,72,98,0.06)',
                            boxShadow: '0 2px 8px rgba(26,72,98,0.08)',
                        }}
                    >
                        {[
                            { key: 'sin iniciar', label: 'Sin iniciar' },
                            { key: 'en proceso', label: 'En proceso' },
                            { key: 'finalizado', label: 'Finalizado' },
                            { key: null, label: 'Ver todos' },
                        ].map((f) => (
                            <Button
                                key={String(f.key)}
                                size="small"
                                onClick={() => {
                                    setFiltroEstado(f.key);
                                    setBusquedaActiva(false);
                                }}
                                sx={filterPillSx(filtroEstado === f.key)}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        columnGap: 16,
                        rowGap: 20,
                    }}
                >
                    {paginatedResults.length > 0 ? (
                        paginatedResults.map((item) => {
                            const est = normalizeEstado(estadosPorOrden[item.id] || item.estado_orden);
                            return (
                                <Box
                                    key={item.id}
                                    onClick={() => handleOpenPopup(item)}
                                    sx={{
                                        ...statusCard,
                                        backgroundColor: '#fff',
                                        p: 2,
                                        cursor: 'pointer',
                                        fontFamily: typography.fontFamily,
                                    }}
                                >
                                    <Typography sx={{ ...typography.cardTitle, fontSize: '1.1rem' }}>
                                        Orden #{item.orden}
                                    </Typography>
                                    <Box sx={{ borderBottom: '1px solid rgba(26,72,98,0.1)', my: 1 }} />
                                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: colors.brand }}>
                                        Máquina: {item.maquina}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.textMuted, fontFamily: 'Poppins' }}>
                                        Artículo: {item.articulo}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.textMuted, fontFamily: 'Poppins' }}>
                                        Proceso: {item.proceso}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.textMuted, fontFamily: 'Poppins' }}>
                                        Metros: <b>{parseInt(item.metrosTotales ?? item.metros, 10)}</b>
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block' }}>
                                        Inicio:{' '}
                                        {new Date(item.hora_inicio_real || item.hora_inicio).toLocaleString('es-AR', {
                                            hour12: false,
                                        })}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block' }}>
                                        Fin:{' '}
                                        {new Date(item.hora_fin_real || item.hora_fin).toLocaleString('es-AR', {
                                            hour12: false,
                                        })}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Chip
                                            label={est.toUpperCase()}
                                            color={chipColor(est)}
                                            size="small"
                                            sx={{ fontWeight: 700, fontSize: 10, fontFamily: 'Poppins' }}
                                        />
                                    </Box>
                                </Box>
                            );
                        })
                    ) : (
                        <Typography sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4, color: colors.textMuted }}>
                            No hay datos disponibles
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={Math.max(1, Math.ceil(resultados.length / rowsPerPage))}
                        page={page}
                        onChange={(_e, newPage) => setPage(newPage)}
                        color="primary"
                    />
                </Box>
            </Box>

            <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
                        color: '#fff',
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        pr: 6,
                    }}
                >
                    Máquina {ordenSeleccionada?.maquina} · Orden #{ordenSeleccionada?.orden}
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePopup}
                        sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip label={estadoOrden.toUpperCase()} color={chipColor(estadoOrden)} sx={{ fontWeight: 700 }} />
                        {operario && (
                            <Chip size="small" label={`${operario} · ${turnoActual}`} variant="outlined" />
                        )}
                    </Box>

                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 0.5 }}>Responsables</Typography>
                    {(responsablesPorOrden[ordenSeleccionada?.id] || []).length > 0 ? (
                        responsablesPorOrden[ordenSeleccionada.id].map((r, idx) => (
                            <Typography key={idx} variant="body2">
                                {r.nombre || 'Sin nombre'} — Turno {r.turno}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">Sin responsables registrados</Typography>
                    )}

                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1">
                            Metros cargados: <b>{parseInt(metrosCargadosPopup, 10)}</b>
                        </Typography>
                        <Typography variant="body1">
                            Metros reales: <b>{metrosTotales}</b>
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textMuted }}>
                            Rango permitido ±8%: {minMetros.toFixed(0)} – {maxMetros.toFixed(0)} m
                        </Typography>
                    </Box>

                    <GridDateTimes
                        horaInicioReal={horaInicioReal}
                        setHoraInicioReal={setHoraInicioReal}
                        horaFinReal={horaFinReal}
                        setHoraFinReal={setHoraFinReal}
                        estadoOrden={estadoOrden}
                    />

                    {(estadoOrden === 'en proceso' || estadoOrden === 'finalizado') && (
                        rollosAsignados.length > 0 ? (
                            <Box mt={2}>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 1 }}>
                                    Rollos asignados
                                </Typography>
                                <Box
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                        columnGap: 12,
                                        rowGap: 12,
                                    }}
                                >
                                    {rollosAsignados
                                        .slice()
                                        .sort((a, b) => (Number(a.secuencia_lr) || 0) - (Number(b.secuencia_lr) || 0))
                                        .map((r, idx) => (
                                            <Box key={r.rollo || idx}>
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                    <b>R{idx + 1}</b> · {r.rollo} · Sec {r.secuencia_lr || 'N/A'}
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <TextField
                                                        type="text"
                                                        label="Metros"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        inputProps={{ maxLength: 4 }}
                                                        value={metrosRealesPorOrden[ordenSeleccionada.id]?.[r.rollo] || ''}
                                                        onChange={(e) => {
                                                            const valor = e.target.value;
                                                            if (valor.length <= 4) {
                                                                setMetrosRealesPorOrden((prev) => ({
                                                                    ...prev,
                                                                    [ordenSeleccionada.id]: {
                                                                        ...prev[ordenSeleccionada.id],
                                                                        [r.rollo]: valor,
                                                                    },
                                                                }));
                                                            }
                                                        }}
                                                        disabled={
                                                            (estadoOrden === 'finalizado' && !usuarioAutorizado) ||
                                                            (checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] &&
                                                                !usuarioAutorizado)
                                                        }
                                                    />
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => guardarMetrosRollo(r.rollo)}
                                                        disabled={
                                                            loadingMetrosRollo === r.rollo ||
                                                            (checksUsadosPorOrden[ordenSeleccionada.id]?.[r.rollo] &&
                                                                !usuarioAutorizado)
                                                        }
                                                    >
                                                        {loadingMetrosRollo === r.rollo ? (
                                                            <CircularProgress size={18} />
                                                        ) : (
                                                            <CheckIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" mt={2}>
                                No hay rollos asignados
                            </Typography>
                        )
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
                        {!usuarioAutorizado && (
                            <Button
                                variant="outlined"
                                onClick={() => setMostrarPassword('editar')}
                                sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
                            >
                                Editar metros
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={handleClosePopup}
                            sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
                        >
                            Cerrar
                        </Button>
                        {estadoOrden === 'sin iniciar' && (
                            <Button
                                variant="contained"
                                onClick={iniciarOrden}
                                disabled={loadingIniciar}
                                sx={primaryBtnSx}
                            >
                                {loadingIniciar ? <CircularProgress size={22} color="inherit" /> : 'Iniciar orden'}
                            </Button>
                        )}
                        {estadoOrden === 'en proceso' && (
                            <>
                                {metrosTotales >= minMetros && metrosTotales <= maxMetros && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={finalizarOrden}
                                        disabled={loadingFinalizar}
                                        sx={{ fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px' }}
                                    >
                                        {loadingFinalizar ? <CircularProgress size={22} color="inherit" /> : 'Finalizar'}
                                    </Button>
                                )}
                                {(metrosTotales < minMetros || metrosTotales > maxMetros) && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={() => setMostrarPassword('forzar')}
                                        sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
                                    >
                                        Forzar finalización
                                    </Button>
                                )}
                            </>
                        )}
                        {estadoOrden === 'finalizado' && (
                            <Button variant="contained" disabled sx={{ fontFamily: 'Poppins' }}>
                                Orden finalizada
                            </Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={!!mostrarPassword} onClose={() => setMostrarPassword(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Poppins' }}>
                    {mostrarPassword === 'forzar' ? 'Autorización para forzar' : 'Autorización requerida'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={passwordIngresada}
                        onChange={(e) => setPasswordIngresada(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{ mt: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleAutorizar()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMostrarPassword(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleAutorizar} sx={primaryBtnSx}>
                        Autorizar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={mostrarDialogTurno}
                onClose={() => {
                    setMostrarDialogTurno(false);
                    setPendingLegajoAction(null);
                }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontFamily: 'Poppins' }}>Registrar operario</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Turno actual: <b>{turnoActual}</b>
                    </Typography>
                    <TextField
                        label="Legajo operario"
                        fullWidth
                        value={operario}
                        onChange={(e) => setOperario(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmarOperario()}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={() => {
                            setMostrarDialogTurno(false);
                            setPendingLegajoAction(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={confirmarOperario} disabled={loadingLegajo} sx={primaryBtnSx}>
                        {loadingLegajo ? <CircularProgress size={22} color="inherit" /> : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

function GridDateTimes({ horaInicioReal, setHoraInicioReal, horaFinReal, setHoraFinReal, estadoOrden }) {
    if (!horaInicioReal && !horaFinReal) return null;
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    columnGap: 12,
                    rowGap: 12,
                    marginBottom: 12,
                }}
            >
                {horaInicioReal && (
                    <DateTimePicker
                        label="Inicio real"
                        value={horaInicioReal}
                        format="DD/MM/YYYY HH:mm"
                        onChange={setHoraInicioReal}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    />
                )}
                {horaFinReal && (
                    <DateTimePicker
                        label="Finalización real"
                        value={horaFinReal}
                        format="DD/MM/YYYY HH:mm"
                        onChange={setHoraFinReal}
                        disabled={estadoOrden === 'finalizado'}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    />
                )}
            </Box>
        </LocalizationProvider>
    );
}
