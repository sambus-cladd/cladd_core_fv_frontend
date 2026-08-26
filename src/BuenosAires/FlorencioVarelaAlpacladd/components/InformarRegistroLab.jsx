import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import { putRegistroLaboratorio } from '../API/APIFunctions';
import { colors, typography } from '../../../styles/alpacladdFvDesignTokens';

const primaryBtnSx = {
  background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
  fontFamily: 'Poppins',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  boxShadow: 'none',
  '&:hover': { background: '#1A4862' },
};

const InformarRegistroLab = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

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
    <Box
      sx={{
        display: 'flex',
        width: { xs: '100%', md: '60%' },
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        minHeight: '50vh',
        position: 'relative',
        px: 1,
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 2000, position: 'absolute', top: 0 }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <CardAlpa sx={{ width: '100%', mt: 0 }}>
        <Grid container spacing={2} padding={2.5}>
          <Grid item xs={12}>
            <Typography
              sx={{
                ...typography.cardTitle,
                mb: 0.5,
              }}
            >
              Ingreso laboratorio
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, mb: 1.5 }}
            >
              Escaneá o ingresá el código de muestra para registrar el ingreso.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Código de muestra"
              variant="outlined"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
              fullWidth
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Poppins',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  flex: 1,
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px',
                }}
              >
                Borrar
              </Button>

              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={handleSearch}
                sx={{ flex: 1, ...primaryBtnSx }}
              >
                Informar registro
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </CardAlpa>
    </Box>
  );
};

export default InformarRegistroLab;
