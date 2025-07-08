import { useEffect, useState, React } from 'react';
import { Navbar } from '../../../../components'
import { Box, Grid } from '@mui/material';

import AlpaLogo from '../../../../assets/Images/alpaLogo.png';
import LogoFinal from '../assets/Images/alpaLogoHOME.png';

import routes from './routesPcp.js'



function pcp() {

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

          <div className="CladdHome">
            <Navbar Titulo="PCP" Routes={routes} color={"alpacladd"} plantaLogo={AlpaLogo} />
          </div>

          <br /><br />
          <Grid container justifyContent="center">

            <Grid item xs={12} sm={12} md={12}>

              <img src={LogoFinal} style={{ width: '30%', height: 'auto' }} />

            </Grid>

          </Grid>

        </div>

        {/* Footer */}
        <footer style={footerStyle}>
          CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
        </footer>

      </div>

    </>
  )

}

export default pcp