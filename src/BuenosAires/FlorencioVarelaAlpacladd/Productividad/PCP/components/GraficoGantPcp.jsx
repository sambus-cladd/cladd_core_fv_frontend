import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Navbar } from '../../../../../components'
import AlpaLogo from '../../../../../assets/Images/alpaLogo.png';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DvrIcon from '@mui/icons-material/Dvr';
import GraficoRangeBarFV from './GraficoRangeBarFV';
import { GetDatosGantFV } from '../API/APIFunctions'
import GraficoGiroLento from './GraficoGiroLento';

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
        <Box sx={{ p: 0 }}>
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

export const GraficosGant = () => {
  const [DatosGant, setDatosGant] = useState([]);
  const [value, setValue] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetDatosGantFV();
        console.log("respuesta", response);
        setDatosGant(response.Dato);
      } catch (error) {
        console.error("Error al obtener los datos de gantt", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleChange = (event, newValue) => {
    if (newValue === 2) {
      const win = window.open("/BuenosAires/FlorencioVarela/Productividad/PCP/GraficoGiroLento", "_blank");
      if (win) win.focus();
    } else {
      setValue(newValue);
    }
  };

  const containerStyle = {
    minHeight: '100vh', // Establece el contenedor principal para ocupar al menos el 100% del alto de la pantalla
    display: 'flex',
    flexDirection: 'column',
    margin: '0'
  };

  const contentStyle = {
    flexGrow: 1, // Permite que el contenido se expanda y llene el espacio disponible
  };
  // Fin - Estructura para usar toda la pantalla sin que se corte al haber pocos elementos

  const footerStyle = {
    backgroundColor: '#1A4862',
    padding: '5px',
    textAlign: 'center',
    color: 'white',
    fontSize: '15px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  };


  return (
    <>
      <div style={containerStyle}> {/* Contenedor principal */}
        <div style={contentStyle}> {/* Contenido de la página */}

          <div style={{ margin: 0, padding: 0 }}>
            <Navbar Titulo="DIAGRAMA GANTT" color="alpacladd" plantaLogo={AlpaLogo} />
            <Box sx={{ bgcolor: " #d3d3d3", display: 'flex', overflow: '', justifyContent: 'center', alignItems: 'center' }}>
              <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons="on" allowScrollButtonsMobile>
                <Tab label="Home" icon={<HomeIcon />} />
                <Tab label="Grafico Producción" icon={<DvrIcon />} />
                <Tab label="Grafico Giro Lento" icon={<DvrIcon />} />
              </Tabs>
            </Box>
            <Box sx={{ width: '100%' }}>
              <CustomTabPanel value={value} index={0}>
                <Navigate to='/BuenosAires/FlorencioVarela/Productividad'></Navigate>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <></>
              </CustomTabPanel>

            </Box>
          </div>

          <Grid container justifyContent="center">
            <Grid item xs={12} ml={12} lg={12}>
              <GraficoRangeBarFV Serie={DatosGant} />
            </Grid>
          </Grid>
        </div>

        {/* FOOTER */}
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "4px 8px",
            borderRadius: "4px"
          }}
        >
          <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
          <Typography variant="caption" color="white">IT - Depto. Aplicaciones</Typography>
        </Box>
      </div>
    </>
  );
};

export default GraficosGant;