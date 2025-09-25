import React, { useEffect, useState, useRef } from "react";
import { FormControl, InputLabel, Select, Card, Grid, MenuItem, Button, Typography, TextField, } from "@mui/material/";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import HeaderYFooter from "../../../../components/Plantilla/HeaderYFooter";
import MensajeDialog from "../../../components/Plantilla/MensajeDialog";
import { maquinasDisponibles, turnosDisponibles, paradaTipo } from "./ConstantesRegistroDatos.jsx"
import { UseConstantesRegistroDatos } from "./UseConstantesRegistroDatos.js";

function RegistroDatosOEE() {
  const { state, dispatch } = UseConstantesRegistroDatos();

  useEffect(() => {
    document.title = "Registro de Datos OEE";
  }, []);

  const validar = () => {
    if (!state.maquina || !state.turno || !state.operario || !state.orden) {
      dispatch({ type: "SET_MENSAJE", mensaje: "Complete todos los campos obligatorios", tipo: "error" });
      return false;
    }
    return true;
  };

  const handleClick = async () => {
    dispatch({ type: "SET_LOADING", value: true });

    if (!validar()) {
      dispatch({ type: "SET_LOADING", value: false });
      return;
    }

    try {
      console.log(state);
      dispatch({ type: "SET_MENSAJE", mensaje: "Datos OEE registrados correctamente", tipo: "success" });
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      dispatch({ type: "SET_MENSAJE", mensaje: "Error al registrar los datos", tipo: "error" });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <>
      <HeaderYFooter titulo={"REGISTRO DE DATOS OEE"}>
        <Grid container spacing={1} justifyContent={"center"} marginTop={0}>
          <Grid item xs={2}>
            <Autocomplete fullWidth options={maquinasDisponibles} value={state.maquina}
              onChange={(e, newValue) => dispatch({ type: "SET_FIELD", field: "maquina", value: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Maquina" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField fullWidth label="Maquinista" value={state.operario}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "operario", value: e.target.value })} />
          </Grid>
          <Grid item xs={2}>
            <TextField fullWidth label="Supervisor" value={state.supervisor}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "supervisor", value: e.target.value })} />
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="turno">Turno</InputLabel>
              <Select labelId="turno" value={state.turno} onChange={(e) => dispatch({ type: "SET_FIELD", field: "turno", value: e.target.value })} label="Turno" >
                {turnosDisponibles.map((t, i) => (
                  <MenuItem key={i} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item mt={1}>
            <Button variant="outlined" color="primary" >
              REPORTES
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={1} mt={1}>
          {/* PANEL TIEMPOS PRODUCTIVOS */}
          <Grid item xs={6}>
            <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, ml: 3 }}
            >
              <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
                Tiempos Productivos
              </Typography>

              {/* PRIMERA FILA */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Articulo" value={state.articulo} onChange={(e) => dispatch({ type: "SET_FIELD", field: "articulo", value: e.target.value })} />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Metros" value={state.metros} onChange={(e) => dispatch({ type: "SET_FIELD", field: "metros", value: e.target.value })} />
                </Grid>
              </Grid>

              {/* SEGUNDA FILA */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={4}>
                  <TextField fullWidth label="T.Produccion" value={state.tiempoProduccion} onChange={(e) => dispatch({ type: "SET_FIELD", field: "tiempoProduccion", value: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Velocidad Operativa" value={state.velocidadOperativa} onChange={(e) => dispatch({ type: "SET_FIELD", field: "velocidadOperativa", value: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Velocidad Estandar" value={state.velocidadEstandar} onChange={(e) => dispatch({ type: "SET_FIELD", field: "velocidadEstandar", value: e.target.value })} />
                </Grid>
              </Grid>

              {/* TERCERA FILA */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Metros de Tela" value={state.metrosTela} onChange={(e) => dispatch({ type: "SET_FIELD", field: "metrosTela", value: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Rendimiento" value={state.rendimiento} onChange={(e) => dispatch({ type: "SET_FIELD", field: "rendimiento", value: e.target.value })} />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* PANEL DE DATOS OEE */}
          <Grid item xs={6}>
            <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, mr: 3 }}
            >
              <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
                OEE
              </Typography>

              {/* PRIMERA FILA */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Duracion del Turno" value={state.duracionTurno} onChange={(e) => dispatch({ type: "SET_FIELD", field: "duracionTurno", value: e.target.value })} />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Tiempo Planificado" value={state.tiempoPlanificado} onChange={(e) => dispatch({ type: "SET_FIELD", field: "tiempoPlanificado", value: e.target.value })} />
                </Grid>
              </Grid>

              {/* SEGUNDA FILA */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Paradas Planificadas" value={state.paradasPlanificadas} onChange={(e) => dispatch({ type: "SET_FIELD", field: "paradasPlanificadas", value: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Paradas NO Planificadas" value={state.paradasNoPlanificadas} onChange={(e) => dispatch({ type: "SET_FIELD", field: "paradasNoPlanificadas", value: e.target.value })} />
                </Grid>
              </Grid>

              {/* TERCERA FILA */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={4}>
                  <TextField fullWidth label="Disponibilidad" value={state.disponibilidad} onChange={(e) => dispatch({ type: "SET_FIELD", field: "disponibilidad", value: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Rendimiento Promedio" value={state.rendimientoPromedio} onChange={(e) => dispatch({ type: "SET_FIELD", field: "rendimientoPromedio", value: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Calidad" value={state.calidad} onChange={(e) => dispatch({ type: "SET_FIELD", field: "calidad", value: e.target.value })} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={1} mt={1} mb={2}>
          {/* PANEL TIEMPOS IMPRODUCTIVOS */}
          <Grid item xs={6}>
            <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, ml: 3 }}
            >
              <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
                Tiempos Improductivos
              </Typography>

              {/* PRIMERA FILA */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Autocomplete fullWidth options={paradaTipo} value={state.tipoParada}
                    onChange={(e, newValue) => dispatch({ type: "SET_FIELD", field: "tipoParada", value: newValue })}
                    renderInput={(params) => <TextField {...params} label="Tipo de Parada" variant="outlined" />} />
                </Grid>
              </Grid>

              {/* SEGUNDA FILA */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={3}>
                  <TextField fullWidth label="Referencia" value={state.referencia1} onChange={(e) => dispatch({ type: "SET_FIELD", field: "referencia1", value: e.target.value })} />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth label="Duracion" value={state.duracion1} onChange={(e) => dispatch({ type: "SET_FIELD", field: "duracion1", value: e.target.value })} />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth label="Referencia" value={state.referencia2} onChange={(e) => dispatch({ type: "SET_FIELD", field: "referencia2", value: e.target.value })} />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth label="Duracion" value={state.duracion2} onChange={(e) => dispatch({ type: "SET_FIELD", field: "duracion2", value: e.target.value })} />
                </Grid>

              </Grid>
            </Card>
          </Grid>

          {/* PANEL DE CALIDAD*/}
          <Grid item xs={6}>
            <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, mr: 3 }}
            >
              <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
                Calidad de Tela
              </Typography>

              {/* PRIMERA FILA */}
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField fullWidth label="Total" value={state.telaTotal} onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaTotal", value: e.target.value })} />
                </Grid>

                <Grid item xs={4}>
                  <TextField fullWidth label="Con Observaciones" value={state.telaConObservacion} onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaConObservacion", value: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="OK" value={state.telaOk} onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaOk", value: e.target.value })} />
                </Grid>
              </Grid>
            </Card>
            {/* BOTONES */}
            <Grid container spacing={1} mt={2}>
              <Grid item ml={20}>
                <Button variant="outlined" color="error" >
                  Limpiar Todo
                </Button>
              </Grid>
              <Grid item>
                <LoadingButton variant="contained" loading={state.loading} onClick={handleClick} >
                  Guardar Todo
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </HeaderYFooter>

      <MensajeDialog
        isOpen={state.isOpen}
        setIsOpen={state.setIsOpen}
        mensaje={state.mensaje}
        tipo={state.tipo}
      />
    </>
  );
}

export default RegistroDatosOEE;
