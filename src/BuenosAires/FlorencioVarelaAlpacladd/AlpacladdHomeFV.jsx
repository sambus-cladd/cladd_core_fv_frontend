import React, { useEffect, useState } from 'react';
import routes from './routesFValpa';
import HeaderYFooter from '../../components/Plantilla/HeaderYFooter';
import CustomCard from "./components/CustomCard";
import FabricProgress from "./components/FabricProgress";
import FabricInventoryChart from "./components/FabricInventoryChart";
import StockDepositosChart from "./components/StockDepositosChart";
import FabricLinesChart from "./components/FabricLinesChart";

import { Grid, Box } from '@mui/material';

import { getEstadoRollos } from './API/APIFunctions';
import { getStockTerminadoFV } from './API/APIFunctions';


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

  return (
    <>
      <HeaderYFooter titulo='ALPACLADD FLORENCIO VARELA' routes={routes}>

        <Box sx={{ padding: 3 }}>

        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              width: "100%",
              background: "linear-gradient(145deg, #2c4356, #1e2c3a)",
              color: "#E2F1E7",
              borderRadius: "16px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              textAlign: "center",
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
              fontWeight: "bold",
              padding: "2px 0",
              marginBottom: "0px", // Espacio entre la línea y las tarjetas
            }}
          >
            {!isNaN(TotalGeneral) ? TotalGeneral.toLocaleString("es-ES") : "0"} km

          </Box>
          </Grid>

          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Inventario Tela Cruda" cantidadCrudo={deposito?.largoTotal || 0} />
              <FabricProgress
                crudoValue={deposito?.largoTotal ? (deposito.largoCrudo / deposito.largoTotal) * 100 : 0}
                denimValue={deposito?.largoTotal ? (deposito.largoDenim / deposito.largoTotal) * 100 : 0}
                totalCrudo={deposito?.largoCrudo || 0}
                totalDenim={deposito?.largoDenim || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Inventario Produccion" cantidadCrudo={produccion?.largoTotal || 0} />
              <FabricProgress
                crudoValue={produccion?.largoTotal ? (produccion.largoCrudo / produccion.largoTotal) * 100 : 0}
                denimValue={produccion?.largoTotal ? (produccion.largoDenim / produccion.largoTotal) * 100 : 0}
                totalCrudo={produccion?.largoCrudo || 0}
                totalDenim={produccion?.largoDenim || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Inventario Calidad" cantidadCrudo={calidad?.largoTotal || 0} />
              <FabricProgress
                crudoValue={calidad?.largoTotal ? (calidad.largoCrudo / calidad.largoTotal) * 100 : 0}
                denimValue={calidad?.largoTotal ? (calidad.largoDenim / calidad.largoTotal) * 100 : 0}
                totalCrudo={calidad?.largoCrudo || 0}
                totalDenim={calidad?.largoDenim || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Inventario Terminado" cantidadCrudo={ventas?.largoTotal || 0} />
              <FabricProgress
                crudoValue={ventas?.largoTotal ? (ventas.largoCrudo / ventas.largoTotal) * 100 : 0}
                denimValue={ventas?.largoTotal ? (ventas.largoDenim / ventas.largoTotal) * 100 : 0}
                totalCrudo={ventas?.largoCrudo || 0}
                totalDenim={ventas?.largoDenim || 0}
              />
            </Grid>

          </Grid>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Box sx={{
              width: "100%",
              maxWidth: { xs: "90%", md: "100%" },
              height: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: { md: "2px solid #ccc", xs: "none" },
              padding: 1
            }}>
              <FabricInventoryChart data={chartData} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Box sx={{
              width: "100%",
              maxWidth: { xs: "90%", md: "100%" },
              height: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: { md: "2px solid #ccc", xs: "none" },
              padding: 1
            }}>
              <FabricLinesChart data={grupoArticuloData} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Box sx={{
              width: "100%",
              maxWidth: { xs: "90%", md: "100%" },
              height: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 1
            }}>
              <StockDepositosChart data={stockDepositos} />
            </Box>
          </Grid>
        </Grid>




      </HeaderYFooter>

    </>
  );
}

export default AlpacladdHomeFV;