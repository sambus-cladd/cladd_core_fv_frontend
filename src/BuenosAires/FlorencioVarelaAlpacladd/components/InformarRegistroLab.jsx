import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import { putRegistroLaboratorio } from '../API/APIFunctions';

const InformarRegistroLab = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Mantener foco activo constantemente
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();

    window.addEventListener('click', focusInput);
    window.addEventListener('focus', focusInput);

    return () => {
      window.removeEventListener('click', focusInput);
      window.removeEventListener('focus', focusInput);
    };
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSearch = async () => {
    if (!codigo.trim()) {
      showSnackbar('Ingrese un codigo de muestra.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Generar fecha actual en formato MySQL
      const ahora = new Date();
      const fechaActual = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      const body = {
        rutina: codigo.trim(),
        fecha_ingreso_laboratorio: fechaActual,
      };

      const respuesta = await putRegistroLaboratorio(body);

      if (respuesta?.success) {
        showSnackbar(`Rutina ${codigo} registrada correctamente.`, 'success');
      } else {
        showSnackbar(`No se encontró la rutina ${codigo}.`, 'warning');
      }
    } catch (error) {
      console.error('Error al registrar rutina:', error);
      showSnackbar('Error al conectar con el servidor.', 'error');
    } finally {
      setLoading(false);
      setCodigo('');
      inputRef.current?.focus();
    }
  };

  const handleDelete = () => {
    setCodigo('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <HeaderYFooter titulo="INFORMAR REGISTRO LABORATORIO">
      <Box
        sx={{ display: 'flex', width: { xs: '100%', sm: '100%', md: '60%' }, justifyContent: 'center',
          alignItems: 'center', margin: '0 auto', height: '60vh', position: 'relative', }} >
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ zIndex: 2000, position: 'absolute', top: 0 }} >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <CardAlpa>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
              <TextField
                label="Escanea o ingresa el codigo de muestra" variant="outlined" value={codigo} 
                onChange={(e) => setCodigo(e.target.value)}
                onKeyDown={handleKeyPress} inputRef={inputRef} fullWidth autoFocus />
            </Grid>

            <Grid item xs={12} md={12}>
              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={handleDelete} sx={{ flex: 1 }} >
                  Borrar
                </Button>

                <LoadingButton loading={loading} variant="contained" size="small" onClick={handleSearch} sx={{ flex: 1 }} >
                  Informar Registro
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </CardAlpa>
      </Box>
    </HeaderYFooter>
  );
};

export default InformarRegistroLab;
