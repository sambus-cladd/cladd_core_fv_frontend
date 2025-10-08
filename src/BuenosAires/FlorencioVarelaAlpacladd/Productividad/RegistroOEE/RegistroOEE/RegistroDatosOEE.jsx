import React, { useEffect, useState, useRef } from "react";
import { FormControl, InputLabel, Select, Card, Grid, MenuItem, Button, Typography, TextField, } from "@mui/material/";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from '@mui/icons-material/Search';
import MensajeDialog from "../../../../components/Plantilla/MensajeDialog.jsx";
import { maquinasDisponibles, turnosDisponibles, paradaTipo } from "./ConstantesRegistroDatos.jsx"
import { UseConstantesRegistroDatos } from "./UseConstantesRegistroDatos.js";
import { getDataPCP } from "../../PCP/API/APIFunctions.js";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { columnasRegistro } from "./ConstantesRegistroDatos.jsx";


function RegistroDatosOEE() {
  const { state, dispatch } = UseConstantesRegistroDatos();
  const columnas = columnasRegistro;
  const [ordenInput, setOrdenInput] = React.useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [ordenElegida, setOrdenElegida] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);




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

  const buscarOrden = async () => {
    if (!ordenInput) {
      console.warn("Ingrese un número de orden");
      return;
    }

    try {
      const resultado = await getDataPCP(ordenInput);
      console.log("Datos de la orden:", resultado);

      if (resultado.success && Array.isArray(resultado.data)) {
        setResultadosBusqueda(resultado.data);
      } else {
        setResultadosBusqueda([]);
      }

      setOpenPopup(true);
    } catch (error) {
      console.error("Error al buscar orden:", error);
      setResultadosBusqueda([]);
      setOpenPopup(true);
    }
  };

const seleccionarOrden = () => {
  const ordenSeleccionada = resultadosBusqueda[seleccionado];
  if (!ordenSeleccionada) return;

  columnas.forEach(col =>
    dispatch({ type: "SET_FIELD", field: col.id, value: ordenSeleccionada[col.id] })
  );

  dispatch({ type: "SET_FIELD", field: "maquina", value: ordenSeleccionada.maquina });
  dispatch({ type: "SET_FIELD", field: "articulo", value: ordenSeleccionada.articulo });
  dispatch({ type: "SET_FIELD", field: "metros", value: Math.round(ordenSeleccionada.metros_real) });

  setOrdenElegida(ordenSeleccionada);
  setOpenPopup(false);
  setSeleccionado(null);
};






  return (
    <>

      <Grid container spacing={1} justifyContent={"center"}>
        {/* Buscador */}
        <Grid item>
          <TextField placeholder="Buscar orden" variant="outlined" size="small" value={ordenInput} onChange={(e) => setOrdenInput(e.target.value)}onKeyDown={(e) => {
    if (e.key === "Enter") buscarOrden();
  }} />
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<SearchIcon />} onKeyDown={(e) => {
    if (e.key === "Enter") buscarOrden();
  }}>
            Buscar
          </Button>
        </Grid>

        <Grid item xs={2}>
          <Autocomplete fullWidth options={maquinasDisponibles} value={state.maquina} size="small"
            onChange={(e, newValue) => dispatch({ type: "SET_FIELD", field: "maquina", value: newValue })}
            renderInput={(params) => (
              <TextField {...params} label="Maquina" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField fullWidth label="Maquinista" value={state.operario} size="small"
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "operario", value: e.target.value })} />
        </Grid>
        <Grid item xs={2}>
          <TextField fullWidth label="Supervisor" value={state.supervisor} size="small"
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "supervisor", value: e.target.value })} />
        </Grid>
        <Grid item xs={2}>
          <Autocomplete fullWidth options={turnosDisponibles} value={state.turno} size="small"
            onChange={(e, newValue) => dispatch({ type: "SET_FIELD", field: "turno", value: newValue })}
            renderInput={(params) => (
              <TextField {...params} label="Turno" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} mt={1}>
  <Grid item xs={12}>
    <Card
      sx={{
        minWidth: "90%",
        borderRadius: "10px",
        boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)",
        p: 1,
        ml: 1,
      }}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography
            fontFamily={"Poppins"}
            fontWeight={"bold"}
            fontSize={20}
            color={"#0D3F5E"}
          >
            Orden seleccionada:
          </Typography>
        </Grid>

        {ordenElegida ? (
          <>
            <Grid item ml={2}>
              <Typography component="span">
                <strong>Orden:</strong> {ordenElegida.orden}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>|</Typography>
            </Grid>

            <Grid item>
              <Typography component="span">
                <strong>Artículo:</strong> {ordenElegida.articulo}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>|</Typography>
            </Grid>

            <Grid item>
              <Typography component="span">
                <strong>Máquina:</strong> {ordenElegida.maquina}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>|</Typography>
            </Grid>

            <Grid item>
              <Typography component="span">
                <strong>Metros:</strong>{" "}
                {columnas.find((c) => c.id === "metros_real")?.formato(
                  ordenElegida?.metros_real
                )}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>|</Typography>
            </Grid>

            <Grid item>
              <Typography component="span">
                <strong>Fecha Registro:</strong>{" "}
                {new Date(ordenElegida.fecha_registro_real).toLocaleDateString(
                  "es-AR"
                )}
              </Typography>
            </Grid>
          </>
        ) : (
          <Grid item>
            <Typography color="text.secondary" fontStyle="italic">
              No hay ninguna orden seleccionada
            </Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  </Grid>
</Grid>




      {/* PANEL TIEMPOS PRODUCTIVOS */}
      <Grid container spacing={1} mt={1}>
        <Grid item xs={6}>
          <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, ml: 1 }}
          >
            <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
              Tiempos Productivos
            </Typography>

            {/* PRIMERA FILA */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField fullWidth label="Articulo" value={state.articulo} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "articulo", value: e.target.value })} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Metros" value={state.metros} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "metros", value: e.target.value })} />
              </Grid>
            </Grid>

            {/* SEGUNDA FILA */}
            <Grid container spacing={1} mt={1}>
              {[
                { label: "Tiempo de Produccion", value: state.tiempoProduccion, field: "tiempoProduccion" },
                { label: "Velocidad Operativa", value: state.velocidadOperativa, field: "velocidadOperativa" },
                { label: "Velocidad Estandar", value: state.velocidadEstandar, field: "velocidadEstandar" },
              ].map((item, idx) => (
                <Grid item xs={4} key={idx}>
                  <TextField fullWidth label={item.label} value={item.value} size="small" sx={{ height: 40 }}
                    onChange={(e) =>
                      dispatch({ type: "SET_FIELD", field: item.field, value: e.target.value })
                    }
                  />
                </Grid>
              ))}
            </Grid>

            {/* TERCERA FILA */}
            <Grid container spacing={1} mt={1}>
              {[
                { label: "Metros de Tela Proyectados", value: state.metrosTela, field: "metrosTela" },
                { label: "Rendimiento", value: state.rendimiento, field: "rendimiento" },
              ].map((item, idx) => (
                <Grid item xs={6} key={idx}>
                  <TextField fullWidth label={item.label} value={item.value} size="small" sx={{ height: 40 }}
                    onChange={(e) =>
                      dispatch({ type: "SET_FIELD", field: item.field, value: e.target.value })
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* PANEL TIEMPOS IMPRODUCTIVOS */}
        <Grid item xs={6}>
          <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, ml: 1 }}
          >
            <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
              Tiempos Improductivos
            </Typography>

            {/* PRIMERA FILA */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Autocomplete fullWidth options={paradaTipo} value={state.tipoParada} size="small"
                  onChange={(e, newValue) => dispatch({ type: "SET_FIELD", field: "tipoParada", value: newValue })}
                  renderInput={(params) => <TextField {...params} label="Tipo de Parada" variant="outlined" />} />
              </Grid>
            </Grid>

            {/* SEGUNDA FILA */}
            <Grid container spacing={1} mt={1}>
              <Grid item xs={6}>
                <TextField fullWidth label="Referencia" value={state.referencia1} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "referencia1", value: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Duracion" value={state.duracion1} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "duracion1", value: e.target.value })} />
              </Grid>
            </Grid>
            <Grid container spacing={1} mt={1}>
              <Grid item xs={6}>
                <TextField fullWidth label="Referencia" value={state.referencia2} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "referencia2", value: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Duracion" value={state.duracion2} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "duracion2", value: e.target.value })} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={1} mt={1} mb={2}>
        {/* PANEL DE CALIDAD*/}
        <Grid item xs={12}>
          <Card sx={{ minWidth: "90%", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", p: 1, ml: 1 }}
          >
            <Typography fontFamily={"Poppins"} fontWeight={"bold"} fontSize={20} color={"#0D3F5E"} mb={2}>
              Calidad de Tela
            </Typography>

            {/* PRIMERA FILA */}
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField fullWidth label="Total" value={state.telaTotal} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaTotal", value: e.target.value })} />
              </Grid>

              <Grid item xs={4}>
                <TextField fullWidth label="Con Observaciones" value={state.telaConObservacion} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaConObservacion", value: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="OK" value={state.telaOk} size="small" onChange={(e) => dispatch({ type: "SET_FIELD", field: "telaOk", value: e.target.value })} />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* BOTONES */}
        <Grid item xs="12" sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, ml: 2, mt: 1 }} >
          <Button variant="outlined" color="error" sx={{ height: 40 }}>
            Limpiar Todo
          </Button>
          <LoadingButton variant="contained" loading={state.loading} onClick={handleClick} sx={{ height: 40 }} >
            Guardar Todo
          </LoadingButton>
        </Grid>
      </Grid>

     <Dialog
  open={openPopup}
  onClose={() => {
    setOpenPopup(false);
    setSeleccionado(null);
  }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Resultados de búsqueda</DialogTitle>

  <DialogContent>
    {resultadosBusqueda.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columnas.map((col) => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
              <TableCell align="center">Seleccionar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {resultadosBusqueda.map((item, index) => (
              <TableRow
                key={item.orden ?? index}
                hover
                onClick={() => setSeleccionado(index)} // ✅ guarda índice, no objeto
                selected={seleccionado === index}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    seleccionado === index
                      ? "rgba(13,63,94,0.12)"
                      : "inherit",
                }}
              >
                {columnas.map((col) => (
                  <TableCell key={col.id}>
                    {col.formato
                      ? col.formato(item[col.id])
                      : item[col.id] ?? "-"}
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Radio
                    checked={seleccionado === index} // ✅ usa índice
                    onChange={() => setSeleccionado(index)}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No se encontraron resultados</Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => {
        setOpenPopup(false);
        setSeleccionado(null);
      }}
    >
      Cerrar
    </Button>

    {seleccionado !== null && (
      <Button
        variant="contained"
        onClick={() => {
          const ordenSeleccionada = resultadosBusqueda[seleccionado];
          seleccionarOrden(ordenSeleccionada);
        }}
      >
        Seleccionar Orden
      </Button>
    )}
  </DialogActions>
</Dialog>




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
