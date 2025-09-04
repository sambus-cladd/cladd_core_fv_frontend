import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import DataGridTable from '../../../../../components/DataGrid/DataGridTable';
import { GetHISTORICOGANTT } from '../API/APIFunctions';
import { getStockRollosXOrden } from "../../../API/APIFunctions";
import { getSecuenciaRollo } from "../API/APIFunctions";
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, DialogActions } from "@mui/material";

const TablaGantt = ({ handleChange }) => {
  const [DatosGantt, setDatosGantt] = useState([]);
  const [RollosPorOrden, setRollosPorOrden] = useState({});

  useEffect(() => {
    const CargaGantt = async () => {
      try {
        const response = await GetHISTORICOGANTT();
        const datos = response.Dato || [];
        setDatosGantt(datos);

        const rollosTemp = {};
        for (let elemento of datos) {
          const orden = elemento.orden;
          const resRollos = await getStockRollosXOrden(orden);
          console.log("Rollos para orden", orden, resRollos.data);
          rollosTemp[orden] = resRollos.data || [];
        }
        setRollosPorOrden(rollosTemp);

      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    }
    CargaGantt();
  }, []);

  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'center', width: "100vw" }} columnSpacing={1} rowSpacing={1} columns={12}>
      <Grid item xs={12}>
        <TablaHistoricoGantt Serie={DatosGantt} RollosPorOrden={RollosPorOrden} handleChange={handleChange} />
      </Grid>
    </Grid>
  );
}

function getDatosValidos(serie) {
  if (Array.isArray(serie)) {
    if (Array.isArray(serie[0])) return serie[0];
    return serie;
  }
  return [];
}

function TablaHistoricoGantt({ Serie, RollosPorOrden, handleChange }) {
  const [openRollos, setOpenRollos] = useState(false);
  const [rollosActuales, setRollosActuales] = useState([]);
  const [ordenActual, setOrdenActual] = useState("");

  const datos = getDatosValidos(Serie);
  const filas = datos.map((elemento, index) => ({
    id: index,
    Orden: elemento.orden,
    Maquina: elemento.maquina,
    MaquinaProceso: elemento.maquina_proceso,
    Proceso: elemento.proceso,
    Color: elemento.color,
    Articulo: elemento.articulo,
    Metros: elemento.metros_real,
    HorasT: elemento.horas_total_real,
    HoraInicio: dayjs(elemento.hora_inicio_real).format('DD-MM-YYYY HH:mm'),
    HoraFin: dayjs(elemento.hora_fin_real).format('DD-MM-YYYY HH:mm'),
    RollosBtn: elemento.orden
  }));

  const handleAbrirRollos = async (orden) => {
    setOrdenActual(orden);

    try {
      const dataRAW = await getStockRollosXOrden(orden);
      const rollos = dataRAW.data || [];

      const rollosConSecuencia = await Promise.all(
        rollos.map(async (r) => {
          if (!r.rollo) return r;
          try {
            const res = await getSecuenciaRollo(r.rollo);
            return { ...r, secuencia_lr: res.success ? res.data.secuencia_lr : "N/A" };
          } catch {
            return { ...r, secuencia_lr: "N/A" };
          }
        })
      );

      setRollosActuales(rollosConSecuencia);
      setOpenRollos(true);

    } catch (err) {
      console.error("Error cargando rollos de la orden", orden, err);
      setRollosActuales([]);
      setOpenRollos(true);
    }
  };

  const columns = [
    {
      field: 'Orden', headerName: 'Orden', flex: 1, minWidth: 100, renderCell: (params) => (
        <div style={{ cursor: 'pointer' }} onClick={() => handleChange(null, 7, params.row.Orden, params.row.Articulo, params.row.Maquina)}>
          {params.row.Orden}
        </div>
      )
    },
    { field: 'Maquina', headerName: 'Maquina', flex: 1, minWidth: 100 },
    { field: 'MaquinaProceso', headerName: 'Maquina Proceso', flex: 1, minWidth: 100 },
    { field: 'Proceso', headerName: 'Proceso', flex: 1, minWidth: 100 },
    { field: 'Color', headerName: 'Color', flex: 1, minWidth: 100 },
    { field: 'Articulo', headerName: 'Articulo', flex: 1, minWidth: 100 },
    { field: 'Metros', headerName: 'Metros', flex: 1, minWidth: 100 },
    { field: 'HorasT', headerName: 'Horas Total', flex: 1, minWidth: 100 },
    { field: 'HoraInicio', headerName: 'Hora Inicio', flex: 1, minWidth: 100 },
    { field: 'HoraFin', headerName: 'Hora Fin', flex: 1, minWidth: 100 },
    {
      field: 'RollosBtn', headerName: 'Rollos Asignados', flex: 1, minWidth: 150,
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleAbrirRollos(params.row.RollosBtn)}>
          Ver Rollos
        </Button>
      )
    }
  ];

  return (
    <>
      <Grid container sx={{ width: "97vw", height: "90%" }} columnSpacing={1} rowSpacing={1} columns={12}>
        <Grid item xs={12}>
          <DataGridTable rows={filas} columns={columns} filename={"- HISTORICO GANTT "} RowCellsBg={'rgba(25, 118, 210,0.1)'} HeadCellsBg={'rgba(25, 118, 210,0.3)'} />
        </Grid>
      </Grid>

      {/* Pop up de rollos */}
      <Dialog open={openRollos} onClose={() => setOpenRollos(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: "1px solid #ddd", fontWeight: "bold", fontSize: 20, color: "#1976d2", mb: 1 }}>
          Rollos de la Orden <b>#{ordenActual}</b>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto', paddingY: 1 }}>
          <List>
            {rollosActuales.length > 0 ? rollosActuales.map((r, idx) => (
              <ListItem key={idx} sx={{
                backgroundColor: "#f5f5f5", borderRadius: 1, marginBottom: 1, boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
              }}>
                <ListItemText
                  primary={<>
                    Rollo: <b>{r.rollo}</b> {r.secuencia_lr ? <> (Sec: <b>{r.secuencia_lr}</b>)</> : ''}
                  </>}
                  primaryTypographyProps={{ fontWeight: "medium", fontSize: 16 }}
                />
              </ListItem>
            )) : (
              <ListItem>
                <ListItemText primary="No hay rollos asignados" />
              </ListItem>
            )}
          </List>
        </DialogContent>

        <DialogActions sx={{ padding: 2, borderTop: "1px solid #ddd" }}>
          <Button variant="contained" color="primary" onClick={() => setOpenRollos(false)} sx={{ fontWeight: "bold", textTransform: "none" }} >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default TablaGantt;
