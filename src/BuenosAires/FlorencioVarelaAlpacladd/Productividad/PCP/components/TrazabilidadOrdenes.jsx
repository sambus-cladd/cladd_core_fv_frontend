import React, { useState } from "react";
import {
  TextField, Button, Grid, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Box
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { getOrdenPorRollo, getResponsables } from "../API/APIFunctions";
import {
  primaryBtnSx, secondaryBtnSx, fieldSx, sectionTitleSx, sectionMutedSx,
  filterBarSx, tableWrapSx, dialogTitleSx, dataGridHeaderSx, colors
} from "./pcpUiStyles";

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
    {
      field: "hora_inicio_real",
      headerName: "Inicio Real",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "hora_fin_real",
      headerName: "Fin Real",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "maquina", headerName: "Máquina", flex: 0.7 },
    { field: "proceso", headerName: "Proceso", flex: 0.9 },
    { field: "articulo", headerName: "Artículo", flex: 0.9 },
    {
      field: "acciones",
      headerName: "Responsables",
      flex: 0.9,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleVerResponsables(params.row.id_orden)}
          sx={{ ...secondaryBtnSx, py: 0.25 }}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
      <Typography sx={sectionTitleSx}>Trazabilidad de órdenes</Typography>
      <Typography sx={sectionMutedSx}>
        Buscá por número de rollo para ver el historial de producción
      </Typography>

      <Box sx={filterBarSx}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              label="Número de rollo"
              variant="outlined"
              fullWidth
              size="small"
              value={rollo}
              onChange={(e) => setRollo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={6} sm={2} md={1.5}>
            <Button
              variant="contained"
              onClick={handleBuscar}
              fullWidth
              disabled={loading}
              sx={primaryBtnSx}
            >
              {loading ? "…" : "Buscar"}
            </Button>
          </Grid>
          <Grid item xs={6} sm={2} md={1.5}>
            <Button variant="outlined" onClick={handleLimpiar} fullWidth sx={secondaryBtnSx}>
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ ...tableWrapSx, height: 440 }}>
        <DataGrid
          rows={ordenes || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.uid}
          disableColumnMenu
          sx={{
            border: "none",
            ...dataGridHeaderSx,
            "& .MuiDataGrid-cell": {
              fontFamily: "Poppins",
              fontSize: "0.8rem",
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
          }}
        />
      </Box>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle sx={dialogTitleSx}>Responsables de la orden</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {responsablesSeleccionados.length > 0 ? (
            responsablesSeleccionados.map((r, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "10px",
                  border: "1px solid rgba(26,72,98,0.08)",
                  backgroundColor: "rgba(26,72,98,0.03)",
                }}
              >
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.9rem" }}>
                  <b style={{ color: colors.brand }}>Legajo:</b> {r.operario}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.9rem" }}>
                  <b style={{ color: colors.brand }}>Nombre:</b> {r.nombre}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.9rem" }}>
                  <b style={{ color: colors.brand }}>Turno:</b> {r.turno}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.9rem" }}>
                  <b style={{ color: colors.brand }}>Fecha:</b> {dayjs(r.fecha).format("DD/MM/YYYY")}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography sx={{ fontFamily: "Poppins", color: colors.textMuted }}>
              No hay responsables registrados.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={primaryBtnSx} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrazabilidadOrdenes;
