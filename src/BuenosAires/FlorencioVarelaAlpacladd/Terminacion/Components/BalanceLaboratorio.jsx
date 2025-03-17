import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import { getResumenRutinas } from '../../API/APIFunctions';
const CustomCard = ({ title, number, estado }) => (
  <Card sx={{
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '1px 1px 2px 3px rgba(0, 0, 0, 0.4)',
    paddingTop: 0,
    marginTop: '20px',
    height: estado ? '150px' : '200px',
    width: estado ? '100px' : '250px',
  }}>
    <CardContent>
      <Typography variant={estado ? "h2" : "h1"} sx={{ color: '#008FFB' }}>{number}</Typography>
      <Typography variant="h5" fontFamily='Poppins' fontStyle='italic'>{title}</Typography>
    </CardContent>
  </Card>
);

const BalanceLaboratorio = () => {
  const [balance, setBalance] = useState({});
  const [finalizadas, setFinalizadas] = useState({});
  const [estado, setEstado] = useState({});

  async function fetchResumenRutinas() {
    try {
      const response = await getResumenRutinas();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setBalance(response.data[0][0]);
        setFinalizadas(response.data[1][0]);
        setEstado(response.data[2][0]);
      }

    } catch (error) {
      console.error(error);
    }

  }
  useEffect(() => {
    fetchResumenRutinas();
    const intervalId = setInterval(() => {
      fetchResumenRutinas();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const displayNumber = (value) => {
    return value !== null && value !== undefined ? value : "?";
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={0}>
      {/* Creadas 100 */}
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={0} paddingTop={1}>
          <Grid item>
            <CustomCard title="RUTINAS CREADAS" number={balance.rutinas_finalizadas ? (balance.rutinas_finalizadas + balance.rutinas_en_proceso) : "?"} />
          </Grid>
        </Grid>
      </Grid>

      {/* Finalizadas 40 y Proceso 60 */}
      <Grid item xs={12}>
        <Grid container justifyContent="space-around" spacing={0} >
          <Grid item>
            <CustomCard title="FINALIZADAS" number={displayNumber(balance.rutinas_finalizadas)} />
          </Grid>
          <Grid item>
            <CustomCard title="EN PROCESO" number={displayNumber(balance.rutinas_en_proceso)} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} marginBottom={2}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <CustomCard title="CONFORME" number={displayNumber(finalizadas.finalizadas_conforme)} />
          </Grid>
          <Grid item>
            <CustomCard title="NO CONFORME" number={displayNumber(finalizadas.finalizadas_no_conforme)} />
          </Grid>
        </Grid>
      </Grid>

      {/* Ing, Ent, Lav, etc. bajo Proceso */}
      <Grid item xs={6} marginBottom={2}>
        <Grid container >
          <Grid item xs={12}>
            <Grid container direction={"row"} columnSpacing={1}>
              <Grid item ={2}>
                <CustomCard title="ENT" number={displayNumber(estado.rutinas_entrada)} estado />
              </Grid>
              <Grid item ={2}>
                <CustomCard title="ING" number={displayNumber(estado.rutinas_ingreso)} estado />
              </Grid>
              <Grid item ={2}>
                <CustomCard title="LAV" number={displayNumber(estado.rutinas_lavado)} estado />
              </Grid>

              <Grid item ={2}>
                <CustomCard title="MAR" number={displayNumber(estado.rutinas_marcado)} estado />
              </Grid>
              <Grid item ={2}>
                <CustomCard title="MED" number={displayNumber(estado.rutinas_medicion)} estado />
              </Grid>
              <Grid item ={2}>
                <CustomCard title="REP" number={displayNumber(estado.rutinas_reposo)} estado />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
};

export default BalanceLaboratorio;
