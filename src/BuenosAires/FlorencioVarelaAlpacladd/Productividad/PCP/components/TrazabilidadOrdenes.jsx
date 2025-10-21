import React, { useState } from "react";
import {
  TextField, Button, Grid, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { getOrdenPorRollo, getResponsables } from "../API/APIFunctions";

const TrazabilidadOrdenes = () => {
  const [rollo, setRollo] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [responsablesSeleccionados, setResponsablesSeleccionados] = useState([]);

  const formatDate = (value) =>
    value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "";

  const handleBuscar = async () => {
    if (!rollo) return;
    setLoading(true);
    try {
      const response = await getOrdenPorRollo(rollo);
      console.log("RESPUESTA", response);
      if (response.success) {
        const withIds = response.data.map((item, index) => ({
          ...item,
          uid: `${item.id}-${index}`,
          id_orden: item.id_orden,
          responsable:
            typeof item.responsable === "string"
              ? JSON.parse(item.responsable)
              : item.responsable,
        }));
        setOrdenes(withIds);
      } else {
        setOrdenes([]);
        alert(response.message || "No se encontraron datos");
      }
    } catch (error) {
      console.error("Error al buscar rollo:", error);
      alert("Error al buscar rollo");
      setOrdenes([]);
    }
    setLoading(false);
  };

  const handleLimpiar = () => {
    setRollo("");
    setOrdenes([]);
  };

 const handleVerResponsables = async (idOrden) => {
  try {
    const response = await getResponsables(idOrden);

    if (response.success && response.data?.responsable) {
      const parsed = Array.isArray(response.data.responsable)
        ? response.data.responsable
        : JSON.parse(response.data.responsable);

      setResponsablesSeleccionados(parsed || []);
    } else {
      setResponsablesSeleccionados([]);
    }

    setOpenModal(true);
  } catch (error) {
    console.error("Error al obtener responsables:", error);
    setResponsablesSeleccionados([]);
    setOpenModal(true);
  }
};


  const columns = [
    { field: "rollo", headerName: "Rollo", flex: 0.8 },
    { field: "orden", headerName: "Orden", flex: 0.6 },
    { field: "hora_inicio_real", headerName: "Inicio Real", flex: 1,
      valueFormatter: ({ value }) => formatDate(value),
    },
    { field: "hora_fin_real", headerName: "Fin Real", flex: 1,
      valueFormatter: ({ value }) => formatDate(value),
    },
    { field: "fecha_registro_real", headerName: "Fecha Registro", flex: 0.8,
      valueFormatter: ({ value }) =>
        value ? dayjs(value).format("DD/MM/YYYY") : "",
    },
    { field: "metros_por_rollo", headerName: "Metros", flex: 0.6,
      valueFormatter: (params) =>
        params.value ? parseInt(params.value, 10) : "",
    },
    { field: "horas_total_real", headerName: "Hs.Total", flex: 0.6 },
    { field: "maquina_proceso", headerName: "Maq.Proc.", flex: 1 },
    { field: "proceso", headerName: "Proceso", flex: 1 },
    { field: "color", headerName: "Color", flex: 0.8 },
    { field: "articulo", headerName: "Articulo", flex: 0.8 },
    { field: "maquina", headerName: "Máquina", flex: 0.8 },
    { field: "responsables", headerName: "Responsables", flex: 0.8,
      renderCell: (params) => (
        <Button variant="outlined" size="small"
          onClick={() => handleVerResponsables(params.row.id_orden)} >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <Paper sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={7} sm={9}>
          <TextField label="Número de Rollo" variant="outlined" fullWidth value={rollo}
            onChange={(e) => setRollo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          />
        </Grid>

        <Grid item xs={2.5} sm={1.5}>
          <Button variant="contained" color="primary" onClick={handleBuscar} fullWidth disabled={loading} >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </Grid>

        <Grid item xs={2.5} sm={1.5}>
          <Button variant="outlined" color="primary" onClick={handleLimpiar} fullWidth >
            Limpiar
          </Button>
        </Grid>
      </Grid>

      <div style={{ height: 420, width: "100%", marginTop: 20 }}>
        <DataGrid rows={ordenes || []} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.uid} disableColumnMenu autoHeight={false}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem", fontWeight: "bold" },
            "& .MuiDataGrid-cell": { fontSize: "0.8rem", whiteSpace: "normal", wordWrap: "break-word" },
            "& .MuiDataGrid-virtualScroller": { overflowX: "hidden !important" },
          }}
        />
      </div>

      {/* Pop up responsables*/}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Responsables de la Orden</DialogTitle>
        <DialogContent dividers>
          {responsablesSeleccionados.length > 0 ? (
            responsablesSeleccionados.map((r, i) => (
              <Paper key={i} sx={{ p: 1.5, mb: 1, backgroundColor: "#f9f9f9" }}>
                <Typography><b>Legajo:</b> {r.operario}</Typography>
                <Typography><b>Nombre:</b> {r.nombre}</Typography>
                <Typography><b>Turno:</b> {r.turno}</Typography>
                <Typography><b>Fecha:</b> {dayjs(r.fecha).format("DD/MM/YYYY")}</Typography>
              </Paper>
            ))
          ) : (
            <Typography>No hay responsables registrados.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TrazabilidadOrdenes;
