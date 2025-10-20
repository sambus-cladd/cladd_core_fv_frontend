import React, { useState, useEffect } from "react";
import {
  Grid, Card, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

import {
  columnasTiemposProductivos, columnasTiemposImproductivos, columnasOEE, columnasCalidad, MAQUINISTAS,
  TURNOS, SUPERVISORES, MAQUINAS
} from "./ConstantesOEE";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RegistroDatosOEE = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // === ESTADOS INICIALES ===
  const filasIniciales = Array.from({ length: 18 }, () => ({
    articulo: "",
    metros: "",
    tiempoProd: "",
    vOperativa: 0,
    vEstandar: "",
    mProyectados: "",
    rendimiento: 0,
  }));

  const filasImproductivasIniciales = Array.from({ length: 6 }, () => ({
    tipoParada: "",
    referencia: "",
    duracion: "",
  }));
  const filasImproductivasIniciales1 = Array.from({ length: 6 }, () => ({
    tipoParada: "",
    referencia: "",
    duracion: "",
  }));

  const oeeInicial = {
    duracionTurno: 480,
    paradasPlanificadas: 0,
    paradasNoPlanificadas: 0,
    tPlanificado: 0,
    disponibilidad: 0,
    rendimientoPromedio: 0,
    calidad: 0,
    oee: 0,
  };

  const calidadInicial = {
    telaTotal: 0,
    telaConObservacion: 0,
    telaOk: 0,
  };

  // === USE STATE ===
  const [datosTiemposProductivos, setdatosTiemposProductivos] = useState(filasIniciales);
  const [datosTiemposImproductivos, setdatosTiemposImproductivos] = useState(filasImproductivasIniciales);
  const [datosTiemposImproductivos1, setdatosTiemposImproductivos1] = useState(filasImproductivasIniciales1);
  const [oeeData, setOeeData] = useState(oeeInicial);
  const [calidadData, setCalidadData] = useState(calidadInicial);
  const [datosProduccion, setDatosProduccion] = useState({
    maquinista: "",
    turno: "",
    supervisor: "",
    maquinas: "",
  });

  // === HANDLERS ===
  const handleFilaChange = (index, field, value) => {
    const nuevas = [...datosTiemposProductivos];
    nuevas[index][field] = value;

    const fila = nuevas[index];

    // Convertimos a numeros para evitar NaN
    const metros = parseFloat(fila.metros) || 0;
    const tiempoProd = parseFloat(fila.tiempoProd) || 0;
    const vEstandar = parseFloat(fila.vEstandar) || 0;

    // Calculo de velocidad operativa
    fila.vOperativa = tiempoProd > 0 ? metros / tiempoProd : 0;
    // Calculo de metros proyectados
    fila.mProyectados = tiempoProd * vEstandar;
    // Calculo de rendimiento
    fila.rendimiento = fila.mProyectados > 0 ? metros / fila.mProyectados : 0;

    setdatosTiemposProductivos(nuevas);

    setCalidadData(prev => {
      const totalMetros = nuevas.reduce((acc, f) => acc + (parseFloat(f.metros) || 0), 0);
      const telaConObs = parseFloat(prev.telaConObservacion) || 0;
      const telaOk = Math.max(0, totalMetros - telaConObs);

      setOeeData(oeePrev => ({
        ...oeePrev,
        calidad: totalMetros > 0 ? telaOk / totalMetros : 0
      }));
      return {
        ...prev,
        telaTotal: totalMetros,
        telaOk: telaOk,
      };
    });
  };

  const handleTelaConObservacionChange = (value) => {
    const nuevaObs = parseFloat(value) || 0;
    setCalidadData(prev => ({
      ...prev,
      telaConObservacion: nuevaObs,
      telaOk: Math.max(0, prev.telaTotal - nuevaObs)
    }));
  };

  useEffect(() => {
    const { telaTotal, telaOk } = calidadData;
    setOeeData(prev => ({
      ...prev,
      calidad: telaTotal > 0 ? telaOk / telaTotal : 0
    }));
  }, [calidadData]);

  // === HANDLER ACTUALIZADO ===
  const handleFilaImproductivaChangeGlobal = (tabla, index, campo, valor) => {
    let nuevasA = [...datosTiemposImproductivos];
    let nuevasB = [...datosTiemposImproductivos1];

    if (tabla === "A") {
      nuevasA[index][campo] = valor;
      setdatosTiemposImproductivos(nuevasA);
    } else {
      nuevasB[index][campo] = valor;
      setdatosTiemposImproductivos1(nuevasB);
    }

    // Unimos tablas de tiempos improductivos para obtener el total
    const todas = [...nuevasA, ...nuevasB];

    // Convertimos a numeero para evitar prblemas
    const totalPlanificado = todas
      .filter(f => f.tipoParada === "PLANIFICADO")
      .reduce((acc, f) => acc + (parseFloat(f.duracion) || 0), 0);

    const totalNoPlanificado = todas
      .filter(f => f.tipoParada === "NO PLANIFICADO")
      .reduce((acc, f) => acc + (parseFloat(f.duracion) || 0), 0);

    // Calculo del tiempo planificado
    const duracionTurno = parseFloat(oeeData.duracionTurno) || 0;
    const tPlanificado = duracionTurno - totalPlanificado;

    // Calculo de disponibilidad
    let disponibilidad = "";
    if (tPlanificado > 0) {
      disponibilidad = (tPlanificado - totalNoPlanificado) / tPlanificado;
    }

    setOeeData(prev => ({
      ...prev,
      paradasPlanificadas: totalPlanificado,
      paradasNoPlanificadas: totalNoPlanificado,
      tPlanificado: tPlanificado > 0 ? tPlanificado : 0,
      disponibilidad: disponibilidad ? disponibilidad.toFixed(2) : "0",
    }));
  };

  // === CALCULO RENDIMIENTO PROMEDIO ===
  useEffect(() => {
    if (!datosTiemposProductivos || datosTiemposProductivos.length === 0) return;

    // Filtramos solo filas con metros y tiempoProd válidos
    const rendimientosValidos = datosTiemposProductivos
      .filter(f => parseFloat(f.metros) > 0 && parseFloat(f.mProyectados) > 0)
      .map(f => parseFloat(f.rendimiento));

    const promedio = rendimientosValidos.length > 0
      ? rendimientosValidos.reduce((acc, r) => acc + r, 0) / rendimientosValidos.length
      : 0;

    setOeeData(prev => ({
      ...prev,
      rendimientoPromedio: promedio
    }));
  }, [datosTiemposProductivos]);

  // Calculo del OEE 
  useEffect(() => {
    const disponibilidad = parseFloat(oeeData.disponibilidad) || 0;
    const rendimiento = parseFloat(oeeData.rendimientoPromedio) || 0;
    const calidad = parseFloat(oeeData.calidad) || 0;

    const oeeCalculado = disponibilidad * rendimiento * calidad;
    const oeeRedondeado = Math.round(oeeCalculado * 100) / 100;

    setOeeData(prev => ({
      ...prev,
      oee: oeeRedondeado
    }));
  }, [oeeData.disponibilidad, oeeData.rendimientoPromedio, oeeData.calidad]);

  const datosTotales = {
    produccion: datosProduccion,
    tiemposProductivos: datosTiemposProductivos,
    calidad: calidadData,
    oee: oeeData,
    tiemposImproductivos: {
      grupoA: datosTiemposImproductivos,
      grupoB: datosTiemposImproductivos1,
    },
  };


  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        {/* DATOS DE PRODUCCION */}
        <Grid item xs={12}>
          <Card sx={{ p: 1, borderRadius: 2, boxShadow: 3, mb: 1 }}>
            <Grid container spacing={1}>
              {/* Fecha */}
              <Grid item xs={2.9}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha"
                    value={datosProduccion.fecha || null}
                    onChange={(newValue) =>
                      setDatosProduccion({ ...datosProduccion, fecha: newValue })
                    }sx={{'& .MuiSvgIcon-root': { fontSize: 22 },}}
                    inputFormat="DD/MM/YYYY"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Turno */}
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Turno</InputLabel>
                  <Select value={datosProduccion.turno || ""} label="Turno"
                    onChange={(e) =>
                      setDatosProduccion({ ...datosProduccion, turno: e.target.value })
                    }
                  >
                    {TURNOS.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Maquina */}
              <Grid item xs={2.3}>
                <FormControl fullWidth>
                  <InputLabel>Máquina</InputLabel>
                  <Select value={datosProduccion.maquinas || ""} label="Máquina"
                    onChange={(e) =>
                      setDatosProduccion({
                        ...datosProduccion,
                        maquinas: e.target.value,
                      })
                    }
                  >
                    {MAQUINAS.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Maquinista */}
              <Grid item xs={2.4}>
                <TextField label="Maquinista"
                  value={datosProduccion.maquinista || ""}
                  onChange={(e) =>
                    setDatosProduccion({
                      ...datosProduccion,
                      maquinista: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Supervisor (input text) */}
              <Grid item xs={2.4}>
                <TextField label="Supervisor"
                  value={datosProduccion.supervisor || ""}
                  onChange={(e) =>
                    setDatosProduccion({
                      ...datosProduccion,
                      supervisor: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* TIEMPOS PRODUCTIVOS */}
        <Card sx={{
          p: 1, borderRadius: 2, boxShadow: 3, mb: 1, height: 335, display: "flex", flexDirection: "column",
        }}>
          <Typography fontWeight="bold" color="#0D3F5E" mb={1}>Tiempos Productivos</Typography>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columnasTiemposProductivos.map(col => (
                    <TableCell key={col.id}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        textAlign: "center",
                        p: 0.5,
                        backgroundColor: "#E0E0E0 !important",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datosTiemposProductivos.map((fila, i) => (
                  <TableRow key={i}>
                    {columnasTiemposProductivos.map(col => (
                      <TableCell
                        key={col.id}
                        sx={{
                          textAlign: "center",
                          p: 0.5,
                          ...(col.id === "rendimiento" ? { backgroundColor: "#FFF59D" } : {}),
                        }}
                      >
                        {["vOperativa", "rendimiento"].includes(col.id) ? (
                          fila[col.id].toFixed(2)
                        ) : (
                          <TextField
                            type={
                              ["metros", "tiempoProd", "vEstandar", "mProyectados"].includes(col.id)
                                ? "number"
                                : "text"
                            }
                            variant="standard"
                            value={col.id === "mProyectados" ? fila[col.id] > 0 ? fila[col.id] : "" : fila[col.id]}
                            onChange={(e) => handleFilaChange(i, col.id, e.target.value)}
                            inputProps={{
                              style: { fontSize: 14, textAlign: "center", padding: 1 },
                            }}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </Card>

        {/* CALIDAD */}
        <Card sx={{ p: 1, borderRadius: 2, boxShadow: 3 }}>
          <Typography fontWeight="bold" color="#0D3F5E" mb={1}>Calidad de Tela</Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#E0E0E0" }}>
                {columnasCalidad.map(col => (
                  <TableCell
                    key={col.id}
                    sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center", p: 0.5 }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  {calidadData.telaTotal ?? 0}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <TextField type="number" variant="standard"
                    value={
                      calidadData.telaConObservacion === undefined ||
                        calidadData.telaConObservacion === null ||
                        calidadData.telaConObservacion === 0
                        ? ""
                        : calidadData.telaConObservacion
                    }
                    placeholder="0"
                    onChange={(e) => {
                      const valor = e.target.value === "" ? 0 : Number(e.target.value);
                      handleTelaConObservacionChange(valor);
                    }}
                    inputProps={{ style: { fontSize: 14, textAlign: "center", padding: 1 } }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  {calidadData.telaOk ?? 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Grid>

      {/* PANEL OEE Y TIEMPOS IMPRODUCTIVOS */}
      <Grid item xs={6}>
        {/* OEE */}
        <Card sx={{ p: 1, borderRadius: 2, boxShadow: 3, mb: 1 }}>
          <Typography fontWeight="bold" color="#0D3F5E" mb={1} sx={{ fontSize: 16 }}>OEE</Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#E0E0E0" }}>
                {columnasOEE.map(col => (
                  <TableCell key={col.id} sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center", p: 0.5 }}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>{oeeData.duracionTurno}</TableCell>
                <TableCell sx={{ textAlign: "center", backgroundColor: "#BBDEFB" }}>
                  {oeeData.paradasPlanificadas ?? 0}
                </TableCell>
                <TableCell sx={{ textAlign: "center", backgroundColor: "#FFCDD2" }}>
                  {oeeData.paradasNoPlanificadas ?? 0}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{oeeData.tPlanificado ?? 0}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{oeeData.disponibilidad}</TableCell>
                <TableCell sx={{ textAlign: "center", backgroundColor: "#FFF59D" }}>
                  {oeeData.rendimientoPromedio.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{oeeData.calidad.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>

          </Table>
          <Typography sx={{ backgroundColor: "#0D3F5E", color: "white", fontWeight: "bold", textAlign: "center", py: 0.5, mt: 1, borderRadius: 1, fontSize: 20 }}>
            OEE {oeeData.oee.toFixed(2)}%
          </Typography>
        </Card>

        {/* TIEMPOS IMPRODUCTIVOS */}
        <Card sx={{ p: 1, borderRadius: 2, boxShadow: 3 }}>
          <Typography fontWeight="bold" color="#0D3F5E" mb={0.2}>Tiempos Improductivos</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#E0E0E0" }}>
                    {columnasTiemposImproductivos.map(col => (
                      <TableCell key={col.id} sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center", p: 0.5 }}>{col.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosTiemposImproductivos.map((fila, i) => {
                    const colorFondo = fila.tipoParada === "PLANIFICADO" ? "#BBDEFB" : fila.tipoParada === "NO PLANIFICADO" ? "#FFCDD2" : "transparent";
                    return (
                      <TableRow key={i} sx={{ backgroundColor: colorFondo }}>
                        {columnasTiemposImproductivos.map(col => (
                          <TableCell key={col.id} sx={{ p: 0.5, textAlign: "center" }}>
                            {col.id === "tipoParada" ? (
                              <FormControl fullWidth size="small" variant="standard">
                                <Select value={fila.tipoParada || ""} onChange={(e) =>
                                  handleFilaImproductivaChangeGlobal("A", i, "tipoParada", e.target.value)
                                } displayEmpty >
                                  <MenuItem value="">Seleccionar</MenuItem>
                                  <MenuItem value="PLANIFICADO">Planificado</MenuItem>
                                  <MenuItem value="NO PLANIFICADO">No planificado</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <TextField
                                type={col.id === "duracion" ? "number" : "text"}
                                variant="standard"
                                value={fila[col.id] || ""}
                                onChange={(e) =>
                                  handleFilaImproductivaChangeGlobal("A", i, col.id, e.target.value)
                                }
                                inputProps={{ style: { fontSize: 14, textAlign: "center", padding: 1 } }}
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </Grid>
            <Grid item xs={6}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#E0E0E0" }}>
                    {columnasTiemposImproductivos.map(col => (
                      <TableCell key={col.id} sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center", p: 0.5 }}>{col.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosTiemposImproductivos1.map((fila, i) => {
                    const colorFondo = fila.tipoParada === "PLANIFICADO" ? "#BBDEFB" : fila.tipoParada === "NO PLANIFICADO" ? "#FFCDD2" : "transparent";
                    return (
                      <TableRow key={i} sx={{ backgroundColor: colorFondo }}>
                        {columnasTiemposImproductivos.map(col => (
                          <TableCell key={col.id} sx={{ p: 0.5, textAlign: "center" }}>
                            {col.id === "tipoParada" ? (
                              <FormControl fullWidth size="small" variant="standard">
                                <Select value={fila.tipoParada || ""}
                                  onChange={(e) =>
                                    handleFilaImproductivaChangeGlobal("B", i, "tipoParada", e.target.value)
                                  } displayEmpty >
                                  <MenuItem value="">Seleccionar</MenuItem>
                                  <MenuItem value="PLANIFICADO">Planificado</MenuItem>
                                  <MenuItem value="NO PLANIFICADO">No planificado</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <TextField type={col.id === "duracion" ? "number" : "text"} variant="standard" value={fila[col.id] || ""}
                                onChange={(e) =>
                                  handleFilaImproductivaChangeGlobal("B", i, col.id, e.target.value)
                                }
                                inputProps={{ style: { fontSize: 14, textAlign: "center", padding: 1 } }}
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* BOTONES */}
      <Grid item xs={12} sx={{ textAlign: "center", mt: 1 }}>
        <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={() => window.location.reload()}>Agregrar comentarios</Button>
        <Button variant="outlined" color="error" sx={{ mr: 2 }} onClick={() => window.location.reload()}>Limpiar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("Datos generales:", datosTotales);
            alert("Datos en consola");
          }}
        >
          Guardar
        </Button>

      </Grid>
    </Grid>
  );
};

export default RegistroDatosOEE;
