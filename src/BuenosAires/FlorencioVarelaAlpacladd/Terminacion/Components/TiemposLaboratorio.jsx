import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import DataGridTable from '../../../../components/DataGrid/DataGridTable';
import dayjs from 'dayjs';
import CardAlpa from '../../../../components/Plantilla/CardAlpa';
import MensajeDialog from '../../../../components/Plantilla/MensajeDialog';
import { getReporteTiempoXRutina, getReporteTiempoXFechas } from '../../API/APIFunctions';
import { colors, typography } from '../../../../styles/alpacladdFvDesignTokens';

const primaryBtnSx = {
  background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
  fontFamily: 'Poppins',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  boxShadow: 'none',
  '&:hover': { background: '#1A4862' },
};

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' },
  '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
};

const TiemposLaboratorio = () => {
  const [rows, setRows] = useState([]);
  const [rutina, setRutina] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(dayjs());
  const [fechaFin, setFechaFin] = useState(dayjs());
  const [mensaje, setMensaje] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tipo, setTipo] = useState(null);
  const columns = [
    { field: 'rutina', headerName: 'Rutina', flex: 1 },
    { field: 'estado', headerName: 'Etapa', flex: 1 },
    { field: 'inicio_etapa', headerName: 'Inicio', flex: 1 },
    { field: 'fin_etapa', headerName: 'Fin', flex: 1 },
    { field: 'duracion_horas_minutos', headerName: 'Duración', flex: 1 },
    { field: 'usuario', headerName: 'Responsable', flex: 1 },
  ];

  async function handleBuscarXRutina() {
    if (!rutina || rutina === '') {
      setMensaje('Debe ingresar una rutina');
      setTipo('error');
      setIsOpen(true);
      return;
    }
    try {
      const respuesta = await getReporteTiempoXRutina(rutina);
      setRows(respuesta.data[0] || []);
    } catch (error) {
      console.error('Error al buscar por rutina:', error);
    }
  }

  async function handleBuscarXFechas() {
    try {
      const body = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
      const respuesta = await getReporteTiempoXFechas(body);
      setRows(respuesta.data[0] || []);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
      <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Tiempos de laboratorio</Typography>
      <Typography sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, fontSize: '0.85rem', mb: 2 }}>
        Consultá duraciones por rutina o por rango de fechas
      </Typography>

      <CardAlpa sx={{ mt: 0, mb: 2 }}>
        <Grid container spacing={2} padding={2.5} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Grid container spacing={1.5} alignItems="flex-end">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rutina"
                  value={rutina ?? ''}
                  onChange={(e) => setRutina(e.target.value)}
                  type="number"
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" onClick={handleBuscarXRutina} sx={primaryBtnSx}>
                  Buscar por rutina
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <Grid container spacing={1.5} alignItems="flex-end" justifyContent="flex-end">
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="Inicio"
                    value={fechaInicio}
                    onChange={(newValue) => setFechaInicio(newValue)}
                    disableFuture
                    slotProps={{ textField: { fullWidth: true, size: 'medium', sx: fieldSx } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="Fin"
                    value={fechaFin}
                    onChange={(newValue) => setFechaFin(newValue)}
                    disableFuture
                    slotProps={{ textField: { fullWidth: true, size: 'medium', sx: fieldSx } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button fullWidth variant="contained" onClick={handleBuscarXFechas} sx={primaryBtnSx}>
                    Buscar por fechas
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </CardAlpa>

      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(26, 72, 98, 0.06)',
          boxShadow: '0 2px 8px rgba(26, 72, 98, 0.08)',
          p: 1,
        }}
      >
        <DataGridTable columns={columns} rows={rows} pageSize={5} />
      </Box>

      <MensajeDialog
        mensaje={mensaje}
        duracion={1000}
        tipo={tipo}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Box>
  );
};

export default TiemposLaboratorio;
