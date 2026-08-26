import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import axios from 'axios';
import EtiquetaReimpresionPDF from './Components/EtiquetaReimpresionPDF';
import { createRoot } from 'react-dom/client';
import { PDFViewer } from '@react-pdf/renderer';
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

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' },
  '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
};

const ReimpresionEtiquetas = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showSnackbar = (message, severity = 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const fetchEtiqueta = async () => {
    if (!codigo.trim()) {
      showSnackbar('Por favor ingrese un código de barra.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.0.18:4300/api/movimientos/${codigo}`);
      if (!response.data?.data) {
        showSnackbar('No se encontró la información del código ingresado.', 'warning');
        setLoading(false);
        return;
      }

      const pieza = response.data.data;
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        showSnackbar('No se pudo abrir la nueva ventana. Verifica los bloqueadores emergentes.', 'warning');
        setLoading(false);
        return;
      }

      const rootElement = newWindow.document.createElement('div');
      newWindow.document.body.appendChild(rootElement);
      setTimeout(() => {
        const reactRoot = createRoot(rootElement);
        reactRoot.render(
          <PDFViewer width="100%" height="600">
            <EtiquetaReimpresionPDF piezas={[pieza]} />
          </PDFViewer>
        );
      }, 500);

      showSnackbar('Datos encontrados correctamente.', 'success');
    } catch (error) {
      console.error('Error al buscar el rollo:', error);
      showSnackbar('Error al buscar los datos del rollo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!codigo.trim()) {
      showSnackbar('Por favor ingrese un código de barra.', 'warning');
      return;
    }
    fetchEtiqueta();
  };

  const handleDelete = () => {
    setCodigo('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handlePrint();
  };

  return (
    <HeaderYFooter titulo="REIMPRIMIR ETIQUETAS" routes={[]} color="alpacladd" showMainMenu={false}>
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', md: '60%' },
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          minHeight: '55vh',
          position: 'relative',
          px: 1,
        }}
      >
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
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
              <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Reimprimir etiqueta</Typography>
              <Typography variant="body2" sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, mb: 1 }}>
                Escaneá o ingresá el código de rollo para regenerar la etiqueta.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Código de rollo"
                variant="outlined"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onKeyDown={handleKeyPress}
                inputRef={inputRef}
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ flex: 1, fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px' }}
                >
                  Borrar
                </Button>
                <LoadingButton loading={loading} variant="contained" onClick={handlePrint} sx={{ flex: 1, ...primaryBtnSx }}>
                  Generar etiqueta
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </CardAlpa>
      </Box>
    </HeaderYFooter>
  );
};

export default ReimpresionEtiquetas;
