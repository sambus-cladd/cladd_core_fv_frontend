import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, Card, Typography, CircularProgress, Box, Tabs, Tab, Button } from "@mui/material";
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
    const [value, setValue] = useState(1);
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const cargarDatos = async () => {
        try {
            const respuesta = await getMonitoreoMaquinas();
            const ordenDeseado = ["108", "123", "124", "146", "12", "160", "10"];
            const agrupado = {};

            if (respuesta?.success && Array.isArray(respuesta.data)) {
                // Agrupar por maquina y suma metros restantes
                respuesta.data.forEach((item) => {
                    const maquina = item.maquina || "SIN MÁQUINA";
                    const metrosRestantes = Math.max(0, Number(item.metros_restantes) || 0);
                    if (!agrupado[maquina]) agrupado[maquina] = 0;
                    agrupado[maquina] += metrosRestantes;
                });
            }

            // Array de maquinas en orden deseado
            const resultado = ordenDeseado.map((maquina) => ({
                maquina,
                totalKm: (agrupado[maquina] || 0) / 1000,
            }));

            setDatos(resultado);
        } catch (err) {
            console.error("Error al cargar monitoreo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "CladdCore FV - Monitoreo Maquinas";
        cargarDatos();
    
        const intervalo = setInterval(() => {
            cargarDatos();
        }, 60000);
        return () => clearInterval(intervalo);
    }, []);

    if (loading) return <CircularProgress />;


    return (
        <div
            className="CladdHome"
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            <Navbar Titulo="MONITOREO" color="alpacladd" />

            <Box sx={{ width: "100%", bgcolor: "#d3d3d3", display: "flex", overflow: "auto", justifyContent: "center", alignItems: "center", }}>
                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="on" allowScrollButtonsMobile >
                    <Tab label="Home" icon={<HomeIcon />} sx={{ minWidth: "120px", padding: "4px 6px", fontSize: "0.75rem" }} />
                    <Tab label="Monitoreo Máquinas" icon={<DvrIcon />} sx={{ minWidth: "160px", padding: "4px 6px", fontSize: "0.75rem" }} />
                </Tabs>
            </Box>

            <Box sx={{ width: "100%" }}>
                <CustomTabPanel value={value} index={0}>
                    <Navigate to="/BuenosAires/FlorencioVarela/Productividad" />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <Box sx={{ flexGrow: 1, p: 2 }}>
                        <Grid container spacing={2}>
                            {datos.map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item.maquina}>
                                    <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#1A4862", color: "white",
                                        borderRadius: "16px", boxShadow: "0px 4px 12px rgba(0,0,0,0.2)", 
                                        width: 250, height: 180 }}>
                                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                            MAQUINA {item.maquina}
                                        </Typography>
                                        <Typography variant="body3" sx={{ mt: 1, fontWeight: "bold" }}>
                                            [PRODUCCION]
                                        </Typography>
                                        <hr />
                                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fffff", mt: 1 }} >
                                            {item.totalKm.toFixed(2)} Km
                                        </Typography>
                                        <hr />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }} >
                                            <Button size="small" variant="contained" sx={{ backgroundColor: "#ffff",
                                                color: "#00334E", fontWeight: "bold",
                                                textTransform: "none", borderRadius: "8px",
                                                "&:hover": { backgroundColor: "#dfdbdbff", }, }}>REPORTE</Button>

                                            <Button size="small" variant="contained" sx={{ backgroundColor: "#ffff",
                                                color: "#00334E", fontWeight: "bold",
                                                textTransform: "none", borderRadius: "8px",
                                                "&:hover": { backgroundColor: "#dfdbdbff", }, }}>DIA</Button>

                                            <Button size="small" variant="contained" sx={{ backgroundColor: "#ffff", 
                                                color: "#00334E", fontWeight: "bold",
                                                textTransform: "none", borderRadius: "8px", 
                                                "&:hover": { backgroundColor: "#dfdbdbff", }, }}>MES</Button>
                                        </Box>

                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CustomTabPanel>
            </Box>

            <Box display="flex" flexDirection="column" 
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
