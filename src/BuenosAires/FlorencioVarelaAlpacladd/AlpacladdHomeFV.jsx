import React, { useEffect, useState } from 'react';
import routes from './routesFValpa';
import HeaderYFooter from '../../components/Plantilla/HeaderYFooter';
import InventarioSeccionCard from "./components/InventarioSeccionCard";
import FabricInventoryChart from "./components/FabricInventoryChart";
import StockDepositosChart from "./components/StockDepositosChart";
import FabricLinesChart from "./components/FabricLinesChart";
import { Typography, Grid, Box, Paper } from '@mui/material';

import { getEstadoRollos } from './API/APIFunctions';
import { getStockTerminadoFV } from './API/APIFunctions';
import { colors, gradients, shadows, typography, formatKmEntero } from '../../styles/alpacladdFvDesignTokens';

const INVENTARIO_TELA_CRUDA_URL = "http://192.168.40.95:4005/LaRioja/Alpacladd/Productividad/InventarioTelaCruda";

const AlpacladdHomeFV = () => {

  const [stockDepositos, setStockDepositos] = useState([]);
  const [grupoArticuloData, setGrupoArticuloData] = useState([]);


  const [deposito, setDeposito] = useState({
    largoTotal: 0,
    largoCrudo: 0,
    largoDenim: 0,
  })
  const [produccion, setProduccion] = useState({
    largoTotal: 0,
    largoCrudo: 0,
    largoDenim: 0,
  })
  const [calidad, setCalidad] = useState({
    largoTotal: 0,
    largoCrudo: 0,
    largoDenim: 0,
  })
  const [ventas, setVentas] = useState({
    largoTotal: 0,
    largoCrudo: 0,
    largoDenim: 0,
  });

  useEffect(() => {
    document.title = "Florencio Varela";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟢 Obtener datos de Stock Rollos
        const responseRollos = await getEstadoRollos();

        if (!responseRollos || !responseRollos.data || !Array.isArray(responseRollos.data) || responseRollos.data.length < 4) {
          console.error("Datos no válidos recibidos de Stock Rollos:", responseRollos);
          return;
        }

        const dataRollos = responseRollos.data;

        const parseNumber = (value) => {
          if (typeof value === "number") return Math.trunc(value); // Si ya es número, redondea
          if (!value) return 0;
          return Math.trunc(Number(value.replace(/\./g, "").replace(",", ".")));
        };

        setDeposito({
          largoTotal: parseNumber(dataRollos[0][0]?.largo_rollos_crudo_km || 0),
          largoCrudo: parseNumber(dataRollos[0][0]?.largo_crudo_detalle || 0),
          largoDenim: parseNumber(dataRollos[0][0]?.largo_denim_detalle || 0),
        });

        setProduccion({
          largoTotal: parseNumber(dataRollos[1][0]?.largo_rollos_produccion_km || 0),
          largoCrudo: parseNumber(dataRollos[1][0]?.largo_crudo_detalle || 0),
          largoDenim: parseNumber(dataRollos[1][0]?.largo_denim_detalle || 0),
        });

        setCalidad({
          largoTotal: parseNumber(dataRollos[2][0]?.largo_rollos_calidad_km || 0),
          largoCrudo: parseNumber(dataRollos[2][0]?.largo_crudo_detalle || 0),
          largoDenim: parseNumber(dataRollos[2][0]?.largo_denim_detalle || 0),
        });

        setVentas({
          largoTotal: parseNumber(dataRollos[3][0]?.largo_rollos_venta_km || 0),
          largoCrudo: parseNumber(dataRollos[3][0]?.largo_crudo_detalle || 0),
          largoDenim: parseNumber(dataRollos[3][0]?.largo_denim_detalle || 0),
        });

        // 🟢 Obtener datos de Inventario Terminado (Stock_Terminado_FV)
        const responseStockTerminado = await getStockTerminadoFV();

        if (!responseStockTerminado || !responseStockTerminado.resultSet2 || !Array.isArray(responseStockTerminado.resultSet2) || responseStockTerminado.resultSet2.length === 0) {
          console.error("Datos no válidos recibidos de Stock Terminado:", responseStockTerminado);
          return;
        }

        const dataStockTerminado = responseStockTerminado.resultSet2[0]; // Tomamos la primera fila

        console.log("✅ Datos de Inventario Terminado:", dataStockTerminado); // Debug

        setVentas({
          largoTotal: parseNumber(dataStockTerminado.largo_rollos_venta_km || 0),
          largoCrudo: parseNumber(dataStockTerminado.largo_crudo_detalle || 0),
          largoDenim: parseNumber(dataStockTerminado.largo_denim_detalle || 0),
        });

        // 🟢 Obtener datos de Stock por Depósitos (resultSet1)
        if (responseStockTerminado.resultSet1 && Array.isArray(responseStockTerminado.resultSet1)) {
          setStockDepositos(responseStockTerminado.resultSet1);
          console.log("✅ Datos de Stock por Depósitos:", responseStockTerminado.resultSet1); // Debug
        }

        // 🟢 Obtener datos de Grupo de Artículos
        if (dataRollos[3] && Array.isArray(dataRollos[3])) {
          const grupoArticulos = dataRollos[3]
            .filter(item => item.grupo_articulo_final && item.suma_de_metros)
            .map(item => ({
              grupo_articulo_final: item.grupo_articulo_final,
              suma_de_metros: parseNumber(item.suma_de_metros)
            }));

          setGrupoArticuloData(grupoArticulos);
          console.log("✅ Datos de Grupo de Artículos:", grupoArticulos); // Debug
        }

      } catch (error) {
        console.error("❌ Error en fetchData:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refrescar cada 60 segundos

    return () => clearInterval(interval);
  }, []);


  const chartData = [
    { name: "Tela Cruda", value: deposito.largoTotal },
    { name: "Producción", value: produccion.largoTotal },
    { name: "Calidad", value: calidad.largoTotal },
    { name: "Terminado", value: ventas.largoTotal },
  ];

   const TotalGeneral = deposito.largoTotal + produccion.largoTotal + calidad.largoTotal + ventas.largoTotal;
  //const TotalGeneral = deposito.largoTotal + calidad.largoTotal + ventas.largoTotal;

  return (
    <>
      <HeaderYFooter titulo="ALPACLADD" routes={routes} color="alpacladd">
        <Box
          sx={{
            flex: 1,
            width: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
        <Box sx={{ px: 1.25, pt: { xs: 1.75, sm: 2.25, md: 2.5 }, pb: 0.35, flexShrink: 0 }}>
          <Grid container spacing={1.35} alignItems="flex-start">
            <Grid item xs={12} sm={6} md={3}>
              <Box
                onClick={() => window.open(INVENTARIO_TELA_CRUDA_URL, "_blank", "noopener,noreferrer")}
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
                  title="Inventario tela cruda"
                  largoTotal={deposito?.largoTotal || 0}
                  largoCrudo={deposito?.largoCrudo || 0}
                  largoDenim={deposito?.largoDenim || 0}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InventarioSeccionCard
                variant="produccion"
                title="Inventario producción"
                largoTotal={produccion?.largoTotal || 0}
                largoCrudo={produccion?.largoCrudo || 0}
                largoDenim={produccion?.largoDenim || 0}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <InventarioSeccionCard
                variant="calidad"
                title="Inventario calidad"
                largoTotal={calidad?.largoTotal || 0}
                largoCrudo={calidad?.largoCrudo || 0}
                largoDenim={calidad?.largoDenim || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InventarioSeccionCard
                variant="terminado"
                title="Inventario terminado"
                largoTotal={ventas?.largoTotal || 0}
                largoCrudo={ventas?.largoCrudo || 0}
                largoDenim={ventas?.largoDenim || 0}
              />
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              mt: { xs: 1.75, sm: 2, md: 2.25 },
              width: "100%",
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "stretch",
              boxShadow: shadows.dashboardLg,
              border: `1px solid ${colors.borderSlate08}`,
            }}
          >
            <Box
              sx={{
                background: gradients.kpiHeader,
                px: 2,
                py: { xs: 0.75, sm: 0.9 },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                minWidth: { sm: 200 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: typography.fontFamily,
                  fontWeight: 700,
                  color: "#fafbfa",
                  fontSize: { xs: "0.82rem", sm: "0.92rem" },
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Total inventario
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                backgroundColor: colors.white,
                py: { xs: 0.95, sm: 1.1 },
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  ...typography.kpiValue,
                  fontSize: { xs: "1.95rem", sm: "2.35rem", md: "2.65rem" },
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                }}
              >
                {!isNaN(TotalGeneral) ? formatKmEntero(TotalGeneral) : "0"} km
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        <Grid
          container
          spacing={0.85}
          alignItems="stretch"
          sx={{
            flex: "0 1 auto",
            minHeight: 0,
            px: 0.35,
            pb: 0.35,
            mt: { xs: 1.75, sm: 2, md: 2.25 },
          }}
          justifyContent="center"
          textAlign="center"
        >
          <Grid item xs={12} md={4} sx={{ display: "flex", minHeight: 0 }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, width: "100%", p: 0.35 }}>
              <FabricInventoryChart data={chartData} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", minHeight: 0 }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, width: "100%", p: 0.35 }}>
              <FabricLinesChart data={grupoArticuloData} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", minHeight: 0 }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, width: "100%", p: 0.35 }}>
              <StockDepositosChart data={stockDepositos} />
            </Box>
          </Grid>
        </Grid>

        </Box>
      </HeaderYFooter>

    </>
  );
}

export default AlpacladdHomeFV;