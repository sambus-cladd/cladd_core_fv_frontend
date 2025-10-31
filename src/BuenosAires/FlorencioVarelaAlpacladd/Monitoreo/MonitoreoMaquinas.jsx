import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  Typography,
  CircularProgress,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DvrIcon from "@mui/icons-material/Dvr";
import { getMonitoreoMaquinas } from "../API/APIFunctions";
import { Navbar } from "../../../components";
import { Navigate } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const MonitoreoMaquinas = () => {
  const [value, setValue] = useState(1); // 🔹 Arranca en "Monitoreo Máquinas"
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    document.title = "CladdCore FV - Monitoreo Máquinas";

    const cargarDatos = async () => {
      try {
        const respuesta = await getMonitoreoMaquinas();
        if (respuesta?.success && Array.isArray(respuesta.data)) {
          // Agrupar por máquina y sumar metros
          const agrupado = respuesta.data.reduce((acc, item) => {
            const maquina = item.maquina || "SIN MÁQUINA";
            const largo = item.largo_rollo ? Number(item.largo_rollo) : 0;
            if (!acc[maquina]) acc[maquina] = 0;
            acc[maquina] += largo;
            return acc;
          }, {});

          // Convertir en array (en km)
          const resultado = Object.entries(agrupado).map(([maquina, total]) => ({
            maquina,
            totalKm: total / 1000,
          }));

          setDatos(resultado);
        }
      } catch (err) {
        console.error("❌ Error al cargar monitoreo:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div
      className="CladdHome"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* 🔹 Navbar principal */}
      <Navbar Titulo="MONITOREO" color="alpacladd" />

      {/* 🔹 Tabs navegación */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#d3d3d3",
          display: "flex",
          overflow: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          allowScrollButtonsMobile
        >
          <Tab
            label="Home"
            icon={<HomeIcon />}
            sx={{ minWidth: "120px", padding: "4px 6px", fontSize: "0.75rem" }}
          />
          <Tab
            label="Monitoreo Máquinas"
            icon={<DvrIcon />}
            sx={{ minWidth: "160px", padding: "4px 6px", fontSize: "0.75rem" }}
          />
        </Tabs>
      </Box>

      {/* 🔹 Paneles */}
      <Box sx={{ width: "100%" }}>
        {/* Home redirige al Productividad */}
        <CustomTabPanel value={value} index={0}>
          <Navigate to="/BuenosAires/FlorencioVarela/Productividad" />
        </CustomTabPanel>

        {/* Monitoreo Máquinas */}
        <CustomTabPanel value={value} index={1}>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={2}>
              {datos.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.maquina}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: "#0D3F5E",
                      color: "white",
                      borderRadius: "16px",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Máquina {item.maquina}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Tela en producción:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#4FC3F7", mt: 1 }}
                    >
                      {item.totalKm.toFixed(2)} km
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CustomTabPanel>
      </Box>

      {/* 🔹 Footer */}
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <Typography variant="caption" color="white">
          © Automatización - La Rioja
        </Typography>
        <Typography variant="caption" color="white">
          Dirección Industrial
        </Typography>
      </Box>
    </div>
  );
};

export default MonitoreoMaquinas;
