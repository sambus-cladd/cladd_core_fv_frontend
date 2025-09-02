import React, { useState } from "react";
import { TextField, Button, Grid, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { getOrdenPorRollo } from "../API/APIFunctions";

const TrazabilidadOrdenes = () => {
    const [rollo, setRollo] = useState("");
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const formatDate = (value) => value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "";


    const handleBuscar = async () => {
        if (!rollo) return;
        setLoading(true);
        try {
            const response = await getOrdenPorRollo(rollo);
            if (response.success) {
                const withIds = response.data.map((item, index) => ({
                    ...item,
                    uid: `${item.id}-${index}`, // id único
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

    const columns = [
        // { field: "id", headerName: "ID", width: 70 },
        { field: "rollo", headerName: "Rollo", width: 100 },
        { field: "orden", headerName: "Orden", width: 80 },
        { field: "hora_inicio_real", headerName: "Inicio Real", width: 130, valueFormatter: ({ value }) => formatDate(value)},
        { field: "hora_fin_real", headerName: "Fin Real", width: 130, valueFormatter: ({ value }) => formatDate(value)},
        { field: "fecha_registro", headerName: "Fecha Registro", width: 130, valueFormatter: ({ value }) => formatDate(value)},
        { field: "metros_real", headerName: "Metros", width: 80, valueFormatter: (params) => { return params.value ? parseInt(params.value, 10) : ""; }, },
        { field: "horas_total_real", headerName: "Hs.Total", width: 80 },
        { field: "maquina_proceso", headerName: "Maq.Proc.", width: 120 },
        { field: "proceso", headerName: "Proceso", width: 100 },
        { field: "color", headerName: "Color", width: 80 },
        { field: "articulo", headerName: "Articulo", width: 80 },
        { field: "maquina", headerName: "Maquina", width: 80 },
    ];

    return (
        <Paper sx={{ padding: 2, }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={7} sm={9}>
                    <TextField label="Número de Rollo" variant="outlined" fullWidth
                        value={rollo} onChange={(e) => setRollo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
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


            <div style={{ height: 400, width: "100%", marginTop: 20 }}>
                <DataGrid rows={ordenes || []} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} getRowId={(row) => row.uid}
                    sx={{
                        "& .MuiDataGrid-cell": { fontSize: "0.8rem" }, // tamaño de celdas
                        "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" }, // encabezados
                    }}
                />
            </div>
        </Paper>
    );
};

export default TrazabilidadOrdenes;
