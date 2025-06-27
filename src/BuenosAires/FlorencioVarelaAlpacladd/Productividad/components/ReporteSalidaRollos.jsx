import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import DataGridTabla from '../../../../components/DataGrid/DataGridTable';
import GraficoBarraRollosxFecha from './GraficoBarraRollosxFecha';
import { getReporteSalidaRollos } from '../../API/APIFunctions';
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
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>

      {/* Fecha de inicio */}
      <Grid item>
        <Typography variant='h6' fontFamily='Poppins' fontWeight="bold" gutterBottom>
          Fecha de inicio
        </Typography>
        <DatePicker
          value={fechaInicio}
          onChange={(newValue) => setFechaInicio(newValue)}
          disableFuture
        />
      </Grid>

      {/* Fecha de fin */}
      <Grid item>
        <Typography variant='h6' fontFamily='Poppins' fontWeight="bold" gutterBottom>
          Fecha de fin
        </Typography>
        <DatePicker
          value={fechaFin}
          onChange={(newValue) => setFechaFin(newValue)}
          disableFuture
        />
      </Grid>

      {/* Botón */}
      <Grid item alignSelf="end" sx={{ mt: 2 }}>
        <Button variant='contained' onClick={fetchRollos}>
          Generar reporte
        </Button>
      </Grid>

      {/* Gráfico */}
      <Grid item xs={12}>
        <Box p={1} textAlign="center">
          <GraficoBarraRollosxFecha
            data={rows}
            label="Cantidad de Salidas por fecha"
            ingreso={false}
          />
        </Box>
      </Grid>

      {/* Tabla */}
      <Grid item xs={12}>
        <DataGridTabla
          rows={rows2}
          columns={columns2}
          filename={`Salida de rollos desde ${fechaInicio.format('DD/MM/YYYY')} hasta ${fechaFin.format('DD/MM/YYYY')}`}
        />
      </Grid>

    </Grid>
  </LocalizationProvider>
);

};

export default ReporteSalidaRollos;
