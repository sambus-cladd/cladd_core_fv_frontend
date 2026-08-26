import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import DataGridTabla from '../../../../components/DataGrid/DataGridTable';
import GraficoBarraRollosxFecha from './GraficoBarraRollosxFecha';
import { getReporteSalidaRollos } from '../../API/APIFunctions';
import CardAlpa from '../../../../components/Plantilla/CardAlpa';
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
};
const ReporteSalidaRollos = () => {
  const [fechaInicio, setFechaInicio] = useState(dayjs());
  const [fechaFin, setFechaFin] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);

  const columns2 = [
    { field: 'fecha_salida', headerName: 'Fecha Salida', flex: 1 },
    { field: 'rollo', headerName: 'Rollo', flex: 1 },
    { field: 'articulo', headerName: 'Articulo', flex: 1 },
    { field: 'orden_lr', headerName: 'Orden', flex: 1 },
    { field: 'secuencia_lr', headerName: 'Secuencia', flex: 1 },
    { field: 'largo', headerName: 'Largo', flex: 1, valueFormatter: (params) => `${params.value} m` },
  ]
  async function fetchRollos() {
    try {
      let body = {
        fechaInicio: fechaInicio.format('YYYY-MM-DD'),
        fechaFin: fechaFin.format('YYYY-MM-DD')
      }
      let respuesta = await getReporteSalidaRollos(body);
      if (respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 0) {
        setRows(respuesta.data[0]);
      }
      else {
        setRows([]);
      }
      if (respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 1) {
        setRows2(respuesta.data[1]);
      }
      else {
        setRows2([]);
      }
    } catch (error) {
      console.error(error);
    }
  }



  return (
  <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
    <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Salida de rollos</Typography>
    <Typography sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, fontSize: '0.85rem', mb: 2 }}>
      Generá el reporte por rango de fechas
    </Typography>

  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
    <CardAlpa sx={{ mt: 0, mb: 2 }}>
      <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-end" sx={{ p: 2.5 }}>
        <Grid item xs={12} sm={4} md={3}>
          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, color: colors.brand, fontSize: '0.85rem', mb: 0.75 }}>
            Fecha de inicio
          </Typography>
          <DatePicker
            value={fechaInicio}
            onChange={(newValue) => setFechaInicio(newValue)}
            disableFuture
            slotProps={{ textField: { fullWidth: true, size: 'small', sx: fieldSx } }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, color: colors.brand, fontSize: '0.85rem', mb: 0.75 }}>
            Fecha de fin
          </Typography>
          <DatePicker
            value={fechaFin}
            onChange={(newValue) => setFechaFin(newValue)}
            disableFuture
            slotProps={{ textField: { fullWidth: true, size: 'small', sx: fieldSx } }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Button fullWidth variant="contained" onClick={fetchRollos} sx={primaryBtnSx}>
            Generar reporte
          </Button>
        </Grid>
      </Grid>
    </CardAlpa>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(26, 72, 98, 0.06)',
            boxShadow: '0 2px 8px rgba(26, 72, 98, 0.08)',
            p: 1.5,
            textAlign: 'center',
          }}
        >
          <GraficoBarraRollosxFecha
            data={rows}
            label="Cantidad de Salidas por fecha"
            ingreso={false}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(26, 72, 98, 0.06)',
            boxShadow: '0 2px 8px rgba(26, 72, 98, 0.08)',
            p: 1,
          }}
        >
          <DataGridTabla
            rows={rows2}
            columns={columns2}
            filename={`Salida de rollos desde ${fechaInicio.format('DD/MM/YYYY')} hasta ${fechaFin.format('DD/MM/YYYY')}`}
          />
        </Box>
      </Grid>
    </Grid>
  </LocalizationProvider>
  </Box>
);

};

export default ReporteSalidaRollos;
