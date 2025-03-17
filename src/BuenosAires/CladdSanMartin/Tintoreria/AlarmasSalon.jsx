import React, { useState, useEffect } from 'react';
import { GetAlarmas } from './API/APIFunctions';

// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function AlarmasSalon() {

  const [alarmas, setAlarmas] = useState([]);
  const [cargar, setCargar] = useState(true);
  let formattedData = [];
  let auxData, DataRaw = 0;

  useEffect(() => {
    const AlarmasOnline = async () => {
      try {
        DataRaw = await GetAlarmas();
        if (DataRaw.length > 0) {
          formattedData = DataRaw.map(alarma => ({
            ...alarma,
            FECHA: alarma.FECHA.split('T')[0],
            HORA: alarma.HORA.slice(11, 16),
          }));
          setAlarmas(formattedData);
        } else {
          setCargar(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    AlarmasOnline();
    const interval = setInterval(AlarmasOnline, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <br />

      <Grid container spacing={1.5} justifyContent="center">
        {alarmas.map(alarma => (
          <Grid item key={alarma.IDALARMA + alarma.MAQUINA + alarma.IDPAROP + alarma.IDBARCADA} xs={12} sm={6} md={4} lg={2} sx={{ marginLeft: "-2rem" }}>
            <Card sx={{ borderRadius: "5px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", padding: '0 0', width: '80%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {alarma.MAQUINA}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Fecha: {alarma.FECHA}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Hora: {alarma.HORA}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Id Alarma: {alarma.IDALARMA}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {alarma.DESCRIPCIONALAR}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Id Paro: {alarma.IDPAROP}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {alarma.DESCRIPCION}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Barcada: {alarma.IDBARCADA}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default AlarmasSalon;
