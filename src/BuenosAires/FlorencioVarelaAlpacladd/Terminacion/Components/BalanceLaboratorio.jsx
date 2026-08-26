import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { getResumenRutinas } from '../../API/APIFunctions';
import { colors, typography, shadows } from '../../../../styles/alpacladdFvDesignTokens';

const KpiCard = ({ title, number, compact = false }) => (
  <Card
    elevation={0}
    sx={{
      textAlign: 'center',
      borderRadius: '12px',
      boxShadow: shadows.status,
      border: '1px solid rgba(26, 72, 98, 0.06)',
      backgroundColor: '#fff',
      height: '100%',
      minHeight: compact ? 110 : 140,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: shadows.statusHover,
      },
    }}
  >
    <CardContent sx={{ py: compact ? 1.5 : 2, px: 1.5 }}>
      <Typography
        sx={{
          color: colors.brand,
          fontFamily: typography.fontFamily,
          fontWeight: 700,
          fontSize: compact ? '1.6rem' : '2.2rem',
          lineHeight: 1.1,
        }}
      >
        {number}
      </Typography>
      <Typography
        sx={{
          fontFamily: typography.fontFamily,
          color: colors.textMuted,
          fontWeight: 600,
          fontSize: compact ? '0.7rem' : '0.85rem',
          mt: 0.75,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontFamily: typography.fontFamily,
      fontWeight: 700,
      color: colors.brand,
      fontSize: '0.95rem',
      mb: 1.5,
      mt: 1,
    }}
  >
    {children}
  </Typography>
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
    const intervalId = setInterval(fetchResumenRutinas, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const displayNumber = (value) => (value !== null && value !== undefined ? value : '?');

  const etapas = [
    { title: 'ENT', value: estado.rutinas_entrada },
    { title: 'ING', value: estado.rutinas_ingreso },
    { title: 'LAV', value: estado.rutinas_lavado },
    { title: 'MAR', value: estado.rutinas_marcado },
    { title: 'MED', value: estado.rutinas_medicion },
    { title: 'REP', value: estado.rutinas_reposo },
  ];

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, pb: 3 }}>
      <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Balance de laboratorio</Typography>
      <Typography sx={{ ...typography.muted, fontSize: '0.85rem', mb: 2.5 }}>
        Resumen en vivo de rutinas creadas, resultados y etapas en proceso
      </Typography>

      <SectionTitle>Resumen general</SectionTitle>
      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            title="Rutinas creadas"
            number={
              balance.rutinas_finalizadas != null
                ? balance.rutinas_finalizadas + balance.rutinas_en_proceso
                : '?'
            }
          />
        </Grid>
        <Grid item xs={6} sm={3} md={4}>
          <KpiCard title="Finalizadas" number={displayNumber(balance.rutinas_finalizadas)} />
        </Grid>
        <Grid item xs={6} sm={3} md={4}>
          <KpiCard title="En proceso" number={displayNumber(balance.rutinas_en_proceso)} />
        </Grid>
      </Grid>

      <SectionTitle>Resultados finalizados</SectionTitle>
      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard title="Conforme" number={displayNumber(finalizadas.finalizadas_conforme)} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard title="No conforme" number={displayNumber(finalizadas.finalizadas_no_conforme)} />
        </Grid>
      </Grid>

      <SectionTitle>Etapas en proceso</SectionTitle>
      <Grid container spacing={1.5}>
        {etapas.map((e) => (
          <Grid item xs={4} sm={2} key={e.title}>
            <KpiCard title={e.title} number={displayNumber(e.value)} compact />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BalanceLaboratorio;
