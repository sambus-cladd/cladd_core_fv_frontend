import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Navbar }                     from '../../../../../components'
import AlpaLogo                       from '../../../../../assets/Images/alpaLogo.png';

// import { GetDatosGant } from "../API/APIFunctions"
import GraficoRangeBarFV from './GraficoRangeBarFV';

import { GetDatosGantFV } from '../API/APIFunctions'

export const GraficosGant = () => {
  const [DatosGant, setDatosGant] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetDatosGantFV();
        // console.log("respuesta", response);
        setDatosGant(response.Dato);
      } catch (error) {
        console.error("Error al obtener los datos de gantt", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

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
            <Navbar Titulo="DIAGRAMA GANTT" color="alpacladd" plantaLogo={AlpaLogo}/> 
          </div>

          <br /><br />
          <Grid container justifyContent="center">
            <Grid item xs={12} ml={12} lg={12}>
              <GraficoRangeBarFV Serie={DatosGant} />
            </Grid>
          </Grid>
        </div>

        {/* Footer */}
        <footer style={footerStyle}> 
          CopyRight © Alpacladd La Rioja (Argentina) - Desarrollado por Equipo de Automatización
        </footer>

      </div>
    </>
  );
};

export default GraficosGant;