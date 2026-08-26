import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Paper } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FactoryIcon from "@mui/icons-material/Factory";
import RecyclingIcon from "@mui/icons-material/Recycling";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import HeaderYFooter from "../../../components/Plantilla/HeaderYFooter";
import InventarioSeccionCard from "../components/InventarioSeccionCard";
import ProductividadAccesoCard from "./components/ProductividadAccesoCard";
import { getEstadoRollos } from "../API/APIFunctions";
import routes from "./routesFVProductividad.js";
import LogoFinal from "./assets/Images/alpaLogoHOME.png";
import {
  colors,
  gradients,
  shadows,
  typography,
} from "../../../styles/alpacladdFvDesignTokens";

const INVENTARIO_TELA_CRUDA_URL =
  "http://192.168.40.95:4005/LaRioja/Alpacladd/Productividad/InventarioTelaCruda";

const MODULOS = [
  {
    title: "PCP",
    description: "Programación, Gantt y planificación de producción.",
    icon: CalendarMonthIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/PCP",
  },
  {
    title: "Stock de rollos",
    description: "Consulta y seguimiento del stock en depósito.",
    icon: InventoryIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/StockDeRollos",
  },
  {
    title: "Agregar rollo",
    description: "Registro de rollos al stock de planta.",
    icon: AddCircleOutlineIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/AgregarRolloFV",
  },
  {
    title: "Producción",
    description: "Seguimiento y registro de producción.",
    icon: FactoryIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/Produccion",
  },
  {
    title: "Subproducto",
    description: "Gestión y reportes de subproductos.",
    icon: RecyclingIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/Subproducto",
  },
  {
    title: "Reportes",
    description: "Reportes e indicadores de productividad.",
    icon: AssessmentIcon,
    route: "/BuenosAires/FlorencioVarela/Productividad/ReportesProductividad",
  },
  {
    title: "Monitoreo máquinas",
    description: "Estado y monitoreo de equipos en planta.",
    icon: MonitorHeartIcon,
    route: "/BuenosAires/FlorencioVarelaAlpacladd/Monitoreo/MonitoreoMaquinas",
  },
];

function abrirEnNuevaVentana(url) {
  const ventana = window.open(url, "_blank", "noopener,noreferrer");
  if (ventana) ventana.focus();
}

function Productividad() {
  const navigate = useNavigate();
  const [deposito, setDeposito] = useState({
    largoTotal: 0,
    largoCrudo: 0,
    largoDenim: 0,
  });

  useEffect(() => {
    document.title = "Productividad - Florencio Varela";
  }, []);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getEstadoRollos();
        const dataRollos = response?.data;

        if (!Array.isArray(dataRollos) || dataRollos.length < 1 || !Array.isArray(dataRollos[0])) {
          return;
        }

        const parseNumber = (value) => {
          if (typeof value === "number") return Math.trunc(value);
          if (!value) return 0;
          return Math.trunc(Number(String(value).replace(/\./g, "").replace(",", ".")));
        };

        const filaDeposito = dataRollos[0][0] || {};

        setDeposito({
          largoTotal: parseNumber(filaDeposito.largo_rollos_crudo_km || 0),
          largoCrudo: parseNumber(filaDeposito.largo_crudo_detalle || 0),
          largoDenim: parseNumber(filaDeposito.largo_denim_detalle || 0),
        });
      } catch (error) {
        console.error("Error al cargar stock de tela cruda:", error);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 60000);
    return () => clearInterval(interval);
  }, []);

  const navegar = (route) => {
    navigate(route);
  };

  return (
    <HeaderYFooter titulo="PRODUCTIVIDAD" routes={routes} color="alpacladd">
      <Box
        sx={{
          width: "100%",
          maxWidth: 1700,
          mx: "auto",
          boxSizing: "border-box",
          px: { xs: 1.6, md: 2.8, lg: 3.4 },
          py: { xs: 1.6, md: 2.2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            overflow: "hidden",
            border: `1px solid ${colors.borderSlate08}`,
            boxShadow: shadows.dashboardLg,
            mb: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              background: gradients.kpiHeader,
              px: { xs: 2, md: 3 },
              py: { xs: 1.4, md: 1.8 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                sx={{
                  ...typography.titleApp,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: colors.white,
                }}
              >
                Panel de Productividad
              </Typography>
              <Typography
                sx={{
                  fontFamily: typography.fontFamily,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.78rem", md: "0.88rem" },
                  mt: 0.5,
                }}
              >
                Accesos rápidos, inventario y módulos operativos
              </Typography>
            </Box>
            <Box
              component="img"
              src={LogoFinal}
              alt="Alpacladd"
              sx={{ width: { xs: 120, sm: 150, md: 180 }, height: "auto" }}
            />
          </Box>
        </Paper>

        <Grid container spacing={1.75}>
          <Grid item xs={12} md={4}>
            <Box
              onClick={() => abrirEnNuevaVentana(INVENTARIO_TELA_CRUDA_URL)}
              sx={{
                cursor: "pointer",
                height: "100%",
                borderRadius: "14px",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: shadows.statusHover,
                },
              }}
            >
              <InventarioSeccionCard
                variant="cruda"
                title="Inventario PDG"
                largoTotal={deposito.largoTotal}
                largoCrudo={deposito.largoCrudo}
                largoDenim={deposito.largoDenim}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 0.8,
                  color: colors.brand,
                  fontFamily: typography.fontFamily,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 16 }} />
                Clic para abrir inventario en La Rioja
              </Box>
            </Box>
          </Grid>

          {MODULOS.map((modulo) => (
            <Grid item xs={12} sm={6} md={4} key={modulo.route}>
              <ProductividadAccesoCard
                title={modulo.title}
                description={modulo.description}
                icon={modulo.icon}
                onClick={() => navegar(modulo.route)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </HeaderYFooter>
  );
}

export default Productividad;
