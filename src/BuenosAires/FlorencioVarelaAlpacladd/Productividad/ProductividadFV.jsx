import { useEffect, useState, React } from 'react';
import { Navbar } from '../../../components';
import { Box, Grid, Typography } from '@mui/material';

import AlpaLogo from '../../../assets/Images/alpaLogo.png';
import LogoFinal from './assets/Images/alpaLogoHOME.png';

import routes from './routesFVProductividad.js'



function Productividad() {

  // Iicio - Estructura para usar toda la pantalla sin que se corte al haber pocos elementos
  const containerStyle = {
    minHeight: '100vh', // Establece el contenedor principal para ocupar al menos el 100% del alto de la pantalla
    display: 'flex',
    flexDirection: 'column',
  };

  const contentStyle = {
    flexGrow: 1, // Permite que el contenido se expanda y llene el espacio disponible
  };
  // Fin - Estructura para usar toda la pantalla sin que se corte al haber pocos elementos

  


  return (

    <>
      <div style={containerStyle}> {/* Contenedor principal */}
        <div style={contentStyle}> {/* Contenido de la página */}

          <div className="CladdHome">
            <Navbar Titulo="PRODUCTIVIDAD" color={"alpacladd"} Routes={routes} plantaLogo={AlpaLogo} />
          </div>

          <br /><br />
          <Grid container justifyContent="center" alignItems="center">

            <Grid item xs={12} sm={12} md={12} style={{ display: 'flex', justifyContent: 'center' }}>

              <img src={LogoFinal} style={{ width: '35%', height: 'auto'}} />

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
  )

}

export default Productividad