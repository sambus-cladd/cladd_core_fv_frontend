import React, { useState, useEffect } from 'react';
import { GetAlarmas } from '../API/APIFunctions';
import styles from "../css/MachineDatos.module.css";

// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Card from "@mui/material/Card";
import { Box } from '@mui/system';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function ReporteAlarmasTabla() {

  const [alarmas, setAlarmas] = useState([]);
  const [cargar, setCargar] = useState(true); //Declaro variables para recargar la API
  let formattedData=[];
  let auxData,DataRaw=0;

  // INICIO - Obtener los datos de la API al cargar el componente
  useEffect(() => {
    
    const AlarmasOnline = async () => {
      try {
            DataRaw= await GetAlarmas();
            if(DataRaw.length>0)
            {
              console.log("Datos",DataRaw.length)
              formattedData=[]; 
              DataRaw.map(function(alarma) 
              {
              auxData={    
                      ...alarma,             
                      FECHA: alarma.FECHA.split('T')[0],
                        HORA: alarma.HORA.slice(11, 16),
                      };
                formattedData.push(auxData);    
          })
          console.log("Datos",formattedData)
          setAlarmas(formattedData);
          formattedData=[];
        
        }
        else 
          setCargar(false);
      } catch (error) {
        console.log(error);
      }
    };
  // FIN - Obtener los datos de la API al cargar el componente

  // Llamar a la función AlarmasOnline al cargar el componente
    AlarmasOnline();
  // Actualizar los datos cada 5 segundos (5000 milisegundos)
    const interval = setInterval(AlarmasOnline, 1000);
  // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
}, []);


  return (
    <>
    
    <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <NotificationsActiveIcon></NotificationsActiveIcon>
                    <span style={{ marginLeft: '5px' }}> <strong>Alarmas en tiempo real </strong></span>
                </p>
            </Card>
      </Grid>

      <br />

    <div style={{ display: 'flex', alignItems: 'center' }}>
    <Grid width={'100%'} sx={{ boxSizing: 'content-box', margin: 'auto' }}>

      <Grid container spacing={5} sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        
        <table>
            <thead>
              <tr>
                <th className={`${styles.encabezadotabla}`}>#</th>
                <th className={`${styles.encabezadotabla}`}>Fecha</th>
                <th className={`${styles.encabezadotabla}`}>Hora</th>
                <th className={`${styles.encabezadotabla}`}>Máquina</th>
                {/* <th>Id Alarma</th> */}
                <th className={`${styles.encabezadotabla}`}>Alarmas</th>
                {/* <th>Id Paro</th> */}
                <th className={`${styles.encabezadotabla}`}>Paros</th>
                <th className={`${styles.encabezadotabla}`}>Barcada</th>
              </tr>
            </thead>
            <tbody>
              {alarmas.map((alarma, index) => (
                <tr key={alarma.IDALARMA + alarma.MAQUINA + alarma.IDPAROP + alarma.IDBARCADA}>
                  <td style={{ padding: '0 30px' }}><strong>{index + 1}</strong></td>
                  <td style={{ padding: '0 30px' }}>{alarma.FECHA}</td>
                  <td style={{ padding: '0 30px' }}><strong>{alarma.HORA}</strong></td>
                  <div><td style={{ padding: '0 30px' }} className={`${styles.estadomaquina}`}><strong>{alarma.MAQUINA}</strong></td></div>
                  {/* <td style={{ padding: '0 10px' }}>{alarma.IDALARMA}</td> */}
                  <td style={{ padding: '0 30px' }} className={`${styles.estadoamarillo}`}><strong className={styles["alarma"]}>{alarma.DESCRIPCIONALAR}</strong></td>
                  {/* <td style={{ padding: '0 10px' }}>{alarma.IDPAROP}</td> */}
                  <td style={{ padding: '0 30px' }} className={`${styles.estadorojoalarma}`}><strong>{alarma.DESCRIPCION}</strong></td>
                  <td style={{ padding: '0 30px' }}>{alarma.IDBARCADA}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </Grid>

    </Grid>
    </div>

    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </>

  );

}

export default ReporteAlarmasTabla;
