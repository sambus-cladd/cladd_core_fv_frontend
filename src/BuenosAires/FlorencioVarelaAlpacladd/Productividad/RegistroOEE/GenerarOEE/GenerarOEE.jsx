import React, { useEffect, useState } from "react";
import { Grid, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const GenerarOEE = () => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [datos] = useState([]); // mock: deberías traerlos de backend
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState(null);

  useEffect(() => {
    document.title = "CladdCore FV - Generar OEE";
  }, []);

  const handleBuscar = () => {
    if (!busqueda.trim()) return;
    setBusquedaActiva(true);
    // Ejemplo: filtrar datos
    const filtrados = datos.filter((d) =>
      d.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setResultados(filtrados);
  };

  return (
    <Grid container padding={1}>
      <Grid item xs={12} container spacing={2} alignItems="center" justifyContent="space-between" >
        <Grid item container xs="auto" spacing={2} alignItems="center">
          <Grid item>
            <TextField placeholder="Buscar orden" variant="outlined" size="small" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        {/* Filtros de estado */}
        <Grid
          item
          container
          xs="auto"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GenerarOEE;
