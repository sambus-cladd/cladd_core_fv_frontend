import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext,
  Today,
  FilterList,
} from "@mui/icons-material";
import { GetDatosGantFV, GetTABLACOLORES } from "../API/APIFunctions";
import HeaderYFooter from "../../../../../components/Plantilla/HeaderYFooter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const ZOOM_LEVELS = [
  { label: "1 día", hours: 24 },
  { label: "3 días", hours: 72 },
  { label: "1 semana", hours: 168 },
  { label: "2 semanas", hours: 336 },
  { label: "1 mes", hours: 720 },
];

const MACHINE_COLORS = {
  "LINEA DIFERENCIADO": "#9b00fb",
  "LINEA TER. DIRECTA": "#0d47a1",
  "LINEA NEGRO": "#0d0d0d",
  "LINEA APTO": "#fc9403",
  "LINEA APTO ESTAMPAR": "#66fcff",
  MANTENIMIENTO: "#f50a12",
  LIMPIEZA: "#bf9021",
};

const cardSx = {
  borderRadius: "12px",
  border: "1px solid rgba(26,72,98,0.06)",
  boxShadow: "0 2px 8px rgba(26,72,98,0.08)",
  backgroundColor: "#fff",
};

const GANTT_CACHE_KEY = "pcp-gantt-produccion-cache-v1";
const BACKGROUND_REFRESH_MS = 60000;
const DIAS_RANGO = 30;
const ZOOM_INICIAL = 1; // 3 días
const HORAS_VISTA_INICIAL = ZOOM_LEVELS[ZOOM_INICIAL].hours;

function seleccionarOrdenesUltimosDias(data) {
  const desde = dayjs().subtract(DIAS_RANGO, "day").startOf("day");
  const hasta = dayjs().endOf("day");

  return [...data]
    .filter((item) => {
      const inicio = dayjs(item.hora_inicio);
      const fin = dayjs(item.hora_fin);
      if (!inicio.isValid() || !fin.isValid()) return false;
      return fin.isSameOrAfter(desde) && inicio.isSameOrBefore(hasta);
    })
    .sort((a, b) => dayjs(b.hora_inicio).valueOf() - dayjs(a.hora_inicio).valueOf());
}

function normalizarDatosGant(dato) {
  if (!dato) return [];
  if (Array.isArray(dato)) {
    return dato.flat().filter((item) => item && typeof item === "object" && !Array.isArray(item));
  }
  return [];
}

function crearFirmaDatos(datos) {
  return JSON.stringify(
    datos
      .map((item) => ({
        orden: item.orden,
        articulo: item.articulo,
        maquina: item.maquina,
        proceso: item.proceso,
        maquina_proceso: item.maquina_proceso,
        metros: item.metros,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
      }))
      .sort((a, b) =>
        `${a.orden}-${a.maquina}-${a.hora_inicio}`.localeCompare(
          `${b.orden}-${b.maquina}-${b.hora_inicio}`
        )
      )
  );
}

function leerCacheGantt() {
  try {
    const cache = JSON.parse(localStorage.getItem(GANTT_CACHE_KEY));
    if (!Array.isArray(cache?.datos)) return null;
    return cache;
  } catch {
    return null;
  }
}

function guardarCacheGantt(cache) {
  try {
    localStorage.setItem(GANTT_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("No se pudo guardar la caché local del Gantt:", error);
  }
}

function obtenerColor(item, colores) {
  if (item.proceso === "LINEA COLOR") {
    return colores.find((c) => c.color === item.color)?.color_hex || "#546e7a";
  }
  return MACHINE_COLORS[item.proceso] || "#546e7a";
}

export const GraficosGant = () => {
  const cacheInicialRef = useRef(leerCacheGantt());
  const datosCacheInicial = cacheInicialRef.current?.datos || [];
  const [ordenes, setOrdenes] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [loading, setLoading] = useState(datosCacheInicial.length === 0);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(
    cacheInicialRef.current?.actualizadoEn || null
  );
  const [timeOffset, setTimeOffset] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(ZOOM_INICIAL);
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedProceso, setSelectedProceso] = useState("all");
  const ganttContainerRef = useRef(null);
  const datosRawRef = useRef(datosCacheInicial);
  const firmaDatosRef = useRef(
    cacheInicialRef.current?.firma ||
      (datosCacheInicial.length > 0 ? crearFirmaDatos(datosCacheInicial) : "")
  );
  const coloresRef = useRef([]);

  const visibleHours = useMemo(() => ZOOM_LEVELS[zoomLevel].hours, [zoomLevel]);

  const visibleStartDate = useMemo(() => {
    return minDate ? minDate.add(timeOffset, "hour") : null;
  }, [minDate, timeOffset]);

  const visibleEndDate = useMemo(() => {
    return visibleStartDate ? visibleStartDate.add(visibleHours, "hour") : null;
  }, [visibleStartDate, visibleHours]);

  const machines = useMemo(() => {
    return [...new Set(ordenes.map((o) => o.machine).filter(Boolean))].sort();
  }, [ordenes]);

  const procesos = useMemo(() => {
    return [...new Set(ordenes.map((o) => o.proceso).filter(Boolean))].sort();
  }, [ordenes]);

  const filteredOrders = useMemo(() => {
    return ordenes.filter((orden) => {
      const machineMatch = selectedMachine === "all" || orden.machine === selectedMachine;
      const procesoMatch = selectedProceso === "all" || orden.proceso === selectedProceso;
      return machineMatch && procesoMatch;
    });
  }, [ordenes, selectedMachine, selectedProceso]);

  const aplicarDatos = useCallback((datos, ajustarVista = false) => {
      const data = seleccionarOrdenesUltimosDias(
        datos.filter((item) => item.maquina && item.maquina !== "GIRO LENTO")
      );

      if (!data.length) {
        setOrdenes([]);
        setMinDate(null);
        setMaxDate(null);
        return;
      }

      let minDateValue = dayjs(data[0].hora_inicio);
      let maxDateValue = dayjs(data[0].hora_fin);

      data.forEach((item) => {
        const inicio = dayjs(item.hora_inicio);
        const fin = dayjs(item.hora_fin);
        if (inicio.isValid() && inicio.isBefore(minDateValue)) minDateValue = inicio;
        if (fin.isValid() && fin.isAfter(maxDateValue)) maxDateValue = fin;
      });

      const minDateAjustada = minDateValue.startOf("hour");
      const maxDateAjustada = maxDateValue.endOf("hour");

      setMinDate(minDateAjustada);
      setMaxDate(maxDateAjustada);

      const transformadas = data.map((item) => {
          const inicio = dayjs(item.hora_inicio);
          const fin = dayjs(item.hora_fin);
          const startHour = inicio.diff(minDateValue, "hour", true);
          const duration = fin.diff(inicio, "hour", true);

          return {
            norden: item.orden || "Sin orden",
            articulo: item.articulo || "Sin artículo",
            machine: item.maquina,
            proceso: item.proceso || "Sin proceso",
            maquina_proceso: item.maquina_proceso || "",
            metros: item.metros || 0,
            startTime: startHour,
            duration,
            color: obtenerColor(item, coloresRef.current),
            fecha_inicio: item.hora_inicio,
            fecha_fin: item.hora_fin,
          };
        });

      setOrdenes(transformadas);

      if (ajustarVista) {
        const totalHoras = maxDateAjustada.diff(minDateAjustada, "hour", true);
        setZoomLevel(ZOOM_INICIAL);
        setTimeOffset(Math.max(0, totalHoras - HORAS_VISTA_INICIAL));
      }
  }, []);

  const fetchData = useCallback(async () => {
    const habiaDatos = firmaDatosRef.current.length > 0;

    try {
      if (!habiaDatos) setLoading(true);

      const response = await GetDatosGantFV();
      const nuevosDatos = normalizarDatosGant(response?.Dato);
      const nuevaFirma = crearFirmaDatos(nuevosDatos);

      // La consulta es silenciosa: React solo recibe nuevos datos si algo cambió.
      if (nuevaFirma !== firmaDatosRef.current) {
        const actualizadoEn = new Date().toISOString();
        firmaDatosRef.current = nuevaFirma;
        datosRawRef.current = nuevosDatos;

        guardarCacheGantt({
          datos: nuevosDatos,
          firma: nuevaFirma,
          actualizadoEn,
        });

        aplicarDatos(nuevosDatos, true);
        setUltimaActualizacion(actualizadoEn);
      }

      setError(null);
    } catch (err) {
      console.error("Error al obtener los datos de gantt:", err);
      // Si existe caché, se mantiene visible y un fallo temporal no vacía el gráfico.
      if (!firmaDatosRef.current) {
        setError("No se pudieron cargar los datos del Gantt. Verificá que el backend esté activo.");
      }
    } finally {
      setLoading(false);
    }
  }, [aplicarDatos]);

  useEffect(() => {
    document.title = "CladdCore FV";
  }, []);

  useEffect(() => {
    const cargarColores = async () => {
      try {
        const response = await GetTABLACOLORES();
        const lista = Array.isArray(response?.Dato)
          ? response.Dato.flat().filter((c) => c && typeof c === "object")
          : [];
        coloresRef.current = lista;
        if (datosRawRef.current.length > 0) {
          aplicarDatos(datosRawRef.current);
        }
      } catch (err) {
        console.error("Error al obtener colores:", err);
      }
    };
    cargarColores();
  }, [aplicarDatos]);

  useEffect(() => {
    if (datosRawRef.current.length > 0) {
      aplicarDatos(datosRawRef.current, true);
    }

    fetchData();
    const interval = setInterval(fetchData, BACKGROUND_REFRESH_MS);
    return () => clearInterval(interval);
  }, [aplicarDatos, fetchData]);

  const timeMarks = useMemo(() => {
    if (!visibleStartDate || !visibleEndDate) return [];

    const marks = [];
    const totalVisibleHours = visibleEndDate.diff(visibleStartDate, "hour", true);
    const startDay = visibleStartDate.startOf("day");
    const endDay = visibleEndDate.startOf("day");
    const days = endDay.diff(startDay, "day") + 1;

    for (let i = 0; i < days; i++) {
      const date = visibleStartDate.startOf("day").add(i, "day");
      if (date.isAfter(visibleEndDate)) break;

      const hoursFromStart = date.diff(visibleStartDate, "hour", true);
      const position = Math.max(0, (hoursFromStart / totalVisibleHours) * 100);

      marks.push({
        date,
        position,
        label: date.format("DD/MM/YY"),
        isDay: true,
      });
    }

    return marks.sort((a, b) => a.position - b.position);
  }, [visibleStartDate, visibleEndDate]);

  const handlePrevious = () => setTimeOffset((prev) => prev - visibleHours / 2);
  const handleNext = () => setTimeOffset((prev) => prev + visibleHours / 2);
  const handleZoomIn = () => setZoomLevel((prev) => Math.max(0, prev - 1));
  const handleZoomOut = () => setZoomLevel((prev) => Math.min(ZOOM_LEVELS.length - 1, prev + 1));

  const handleToday = () => {
    const now = dayjs();
    if (minDate && maxDate && now.isBetween(minDate, maxDate)) {
      const offset = now.diff(minDate, "hour", true);
      setTimeOffset(offset - visibleHours / 2);
    } else {
      setTimeOffset(0);
    }
  };

  const calculateOrderPosition = (orden) => {
    if (!visibleStartDate || !visibleEndDate) {
      return { left: 0, width: 0, isVisible: false, showLabel: false };
    }

    const ordenStart = dayjs(orden.fecha_inicio);
    const ordenEnd = dayjs(orden.fecha_fin);

    if (!ordenStart.isValid() || !ordenEnd.isValid() || !ordenEnd.isAfter(ordenStart)) {
      return { left: 0, width: 0, isVisible: false, showLabel: false };
    }

    if (ordenEnd.isBefore(visibleStartDate) || ordenStart.isAfter(visibleEndDate)) {
      return { left: 0, width: 0, isVisible: false, showLabel: false };
    }

    const visibleStartMillis = visibleStartDate.valueOf();
    const visibleEndMillis = visibleEndDate.valueOf();
    const ordenStartMillis = ordenStart.valueOf();
    const ordenEndMillis = ordenEnd.valueOf();

    const visibleOrdenStart = Math.max(ordenStartMillis, visibleStartMillis);
    const visibleOrdenEnd = Math.min(ordenEndMillis, visibleEndMillis);
    const totalVisibleRange = visibleEndMillis - visibleStartMillis;

    if (totalVisibleRange <= 0) {
      return { left: 0, width: 0, isVisible: false, showLabel: false };
    }

    const left = ((visibleOrdenStart - visibleStartMillis) / totalVisibleRange) * 100;
    const width = ((visibleOrdenEnd - visibleOrdenStart) / totalVisibleRange) * 100;

    return {
      left: Math.max(0, left),
      width: Math.max(0, width),
      isVisible: width > 0,
      showLabel: width >= 4,
    };
  };

  const ordenesTabla = useMemo(() => {
    return [...filteredOrders].sort(
      (a, b) => dayjs(b.fecha_inicio).valueOf() - dayjs(a.fecha_inicio).valueOf()
    );
  }, [filteredOrders]);

  const ordenesPorMaquina = useMemo(() => {
    const agrupadas = {};

    filteredOrders.forEach((orden) => {
      if (!agrupadas[orden.machine]) agrupadas[orden.machine] = [];
      agrupadas[orden.machine].push(orden);
    });

    Object.keys(agrupadas).forEach((machine) => {
      agrupadas[machine].sort(
        (a, b) => dayjs(a.fecha_inicio).valueOf() - dayjs(b.fecha_inicio).valueOf()
      );
    });

    return agrupadas;
  }, [filteredOrders]);

  const displayMachines = selectedMachine === "all" ? machines : [selectedMachine];

  return (
    <HeaderYFooter titulo="Gantt Ordenes" color="alpacladd" showMainMenu={false}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1700,
            mx: "auto",
            boxSizing: "border-box",
            px: { xs: 1.6, md: 2.8, lg: 3.4 },
            py: { xs: 1.2, md: 1.8 },
          }}
        >
          <Card sx={{ ...cardSx, mb: 1.8, p: { xs: 1.4, md: 1.8 } }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#1A4862', fontSize: '1rem', mb: 1 }}>
              Gráfico Producción
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <IconButton onClick={handlePrevious} title="Desplazar hacia atrás">
                <NavigateBefore />
              </IconButton>
              <IconButton onClick={handleNext} title="Desplazar hacia adelante">
                <NavigateNext />
              </IconButton>
              <IconButton onClick={handleToday} title="Ir a hoy">
                <Today />
              </IconButton>
              <IconButton onClick={handleZoomIn} disabled={zoomLevel === 0} title="Acercar">
                <ZoomIn />
              </IconButton>
              <IconButton onClick={handleZoomOut} disabled={zoomLevel === ZOOM_LEVELS.length - 1} title="Alejar">
                <ZoomOut />
              </IconButton>

              <Typography variant="body2" sx={{ mx: 1 }}>
                Vista: {ZOOM_LEVELS[zoomLevel].label}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                <FormControl size="small" sx={{ minWidth: 160, mr: 1 }}>
                  <InputLabel>Máquina</InputLabel>
                  <Select
                    value={selectedMachine}
                    label="Máquina"
                    onChange={(e) => setSelectedMachine(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {machines.map((machine) => (
                      <MenuItem key={machine} value={machine}>
                        {machine}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Proceso</InputLabel>
                  <Select
                    value={selectedProceso}
                    label="Proceso"
                    onChange={(e) => setSelectedProceso(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {procesos.map((proceso) => (
                      <MenuItem key={proceso} value={proceso}>
                        {proceso}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {visibleStartDate?.format("DD/MM/YYYY HH:mm")} - {visibleEndDate?.format("DD/MM/YYYY HH:mm")}
            </Typography>
            {minDate && maxDate && (
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary">
                  Rango total de datos: {minDate.format("DD/MM/YYYY HH:mm")} - {maxDate.format("DD/MM/YYYY HH:mm")}
                </Typography>
                {ultimaActualizacion && (
                  <Typography variant="caption" color="text.secondary">
                    Caché actualizada: {dayjs(ultimaActualizacion).format("DD/MM/YYYY HH:mm:ss")}
                  </Typography>
                )}
              </Box>
            )}
          </Card>

          <Card sx={{ ...cardSx, mb: 2.2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#1A4862' }}>
                Gráfico de Gantt - Últimos {DIAS_RANGO} días
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Órdenes con actividad en los últimos {DIAS_RANGO} días. Vista inicial de 3 días.
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, gap: 2 }}>
                  <CircularProgress size={28} />
                  <Typography>Cargando datos...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : ordenes.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No hay datos de producción programada para mostrar.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ width: 150 }} />
                    <Box sx={{ flex: 1, position: "relative" }} ref={ganttContainerRef}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          position: "relative",
                          height: "40px",
                        }}
                      >
                        {timeMarks.map((mark, i) => (
                          <Box
                            key={i}
                            sx={{
                              position: "absolute",
                              left: `${mark.position}%`,
                              transform: "translateX(-50%)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                              }}
                            >
                              {mark.label}
                            </Typography>
                            <Box sx={{ height: "8px", width: "1px", bgcolor: "divider", mt: "2px" }} />
                          </Box>
                        ))}

                        {minDate && visibleStartDate && visibleEndDate && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: `${(dayjs().diff(visibleStartDate, "hour", true) / visibleHours) * 100}%`,
                              top: 0,
                              bottom: 0,
                              width: "2px",
                              bgcolor: "error.main",
                              zIndex: 10,
                              display: dayjs().isBetween(visibleStartDate, visibleEndDate) ? "block" : "none",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: "-4px",
                                width: 0,
                                height: 0,
                                borderLeft: "5px solid transparent",
                                borderRight: "5px solid transparent",
                                borderTop: "5px solid",
                                borderTopColor: "error.main",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                position: "absolute",
                                top: -20,
                                left: -15,
                                bgcolor: "error.main",
                                color: "white",
                                px: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              Ahora
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ height: "1px", bgcolor: "divider" }} />
                    </Box>
                  </Box>

                  {displayMachines.map((machine) => (
                    <Box key={machine} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ width: 150, pr: 2 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {machine}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          position: "relative",
                          height: 48,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          overflow: "hidden",
                        }}
                      >
                        {timeMarks.map((mark, i) => (
                          <Box
                            key={i}
                            sx={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              width: "1px",
                              bgcolor: "grey.600",
                              left: `${mark.position}%`,
                              opacity: 0.8,
                            }}
                          />
                        ))}

                        {(ordenesPorMaquina[machine] || []).map((o, index) => {
                            const { left, width, isVisible, showLabel } = calculateOrderPosition(o);
                            if (!isVisible) return null;

                            return (
                              <Tooltip
                                key={`${o.norden}-${o.fecha_inicio}-${o.fecha_fin}-${index}`}
                                title={
                                  <Box>
                                    <Typography variant="subtitle2">Orden: {o.norden}</Typography>
                                    <Typography variant="body2">Artículo: {o.articulo}</Typography>
                                    <Typography variant="body2">Proceso: {o.proceso}</Typography>
                                    <Typography variant="body2">Metros: {o.metros}</Typography>
                                    <Typography variant="body2">
                                      Inicio: {dayjs(o.fecha_inicio).format("DD/MM/YYYY HH:mm")}
                                    </Typography>
                                    <Typography variant="body2">Duración: {o.duration.toFixed(1)}h</Typography>
                                    <Typography variant="body2">
                                      Fin: {dayjs(o.fecha_fin).format("DD/MM/YYYY HH:mm")}
                                    </Typography>
                                  </Box>
                                }
                              >
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    bottom: 4,
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    bgcolor: o.color,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 1,
                                    boxSizing: "border-box",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    px: showLabel ? 0.5 : 0,
                                    fontWeight: "bold",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    borderRight: "1px solid rgba(255,255,255,0.35)",
                                    "&:hover": {
                                      boxShadow: 2,
                                      zIndex: 2,
                                    },
                                  }}
                                >
                                  {showLabel ? o.norden : ""}
                                </Box>
                              </Tooltip>
                            );
                          })}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">
                  Resumen - Últimos {DIAS_RANGO} días ({filteredOrders.length})
                </Typography>
                <Chip
                  icon={<FilterList />}
                  label={`Filtros: ${selectedMachine === "all" ? "Todas máquinas" : selectedMachine}, ${selectedProceso === "all" ? "Todos procesos" : selectedProceso}`}
                  variant="outlined"
                />
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Orden</TableCell>
                      <TableCell>Artículo</TableCell>
                      <TableCell>Máquina</TableCell>
                      <TableCell>Proceso</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Duración (h)</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Metros</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordenesTabla.length > 0 ? (
                      ordenesTabla.map((o, index) => (
                        <TableRow key={`${o.norden}-${o.fecha_inicio}-${index}`} hover>
                          <TableCell>{o.norden}</TableCell>
                          <TableCell>{o.articulo}</TableCell>
                          <TableCell>{o.machine}</TableCell>
                          <TableCell>
                            <Chip label={o.proceso} size="small" sx={{ bgcolor: o.color, color: "#fff" }} />
                          </TableCell>
                          <TableCell>{dayjs(o.fecha_inicio).format("DD/MM/YYYY HH:mm")}</TableCell>
                          <TableCell>{o.duration.toFixed(1)}</TableCell>
                          <TableCell>{dayjs(o.fecha_fin).format("DD/MM/YYYY HH:mm")}</TableCell>
                          <TableCell>{o.metros}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                          {loading ? "Cargando..." : "No hay órdenes para mostrar con los filtros actuales"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
    </HeaderYFooter>
  );
};

export default GraficosGant;
