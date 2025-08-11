import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import axios from 'axios';
import EtiquetaReimpresionPDF from './Components/EtiquetaReimpresionPDF'; // ruta correcta
import { createRoot } from 'react-dom/client';
import { PDFViewer } from '@react-pdf/renderer';

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
    const response = await axios.get(`http://localhost:4300/api/movimientos/${codigo}`);

    if (!response.data?.data) {
      showSnackbar('No se encontró la información del código ingresado.', 'warning');
      setLoading(false);
      return;
    }

    const pieza = response.data.data;

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      showSnackbar("No se pudo abrir la nueva ventana. Verifica los bloqueadores emergentes.", 'warning');
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
    console.log("Datos de la pieza:", pieza);
  } catch (error) {
    console.error('❌ Error al buscar el rollo:', error);
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
    if (e.key === 'Enter') {
      handlePrint();
    }
  };

  return (
    <HeaderYFooter titulo="REIMPRIMIR ETIQUETAS">
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', sm: '100%', md: '60%' },
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          height: '60vh',
          position: 'relative',
        }}
      >
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ zIndex: 2000, position: 'absolute', top: 0 }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <CardAlpa>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
              <TextField
                label="Escaneá o ingresá el código de rollo"
                variant="outlined"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onKeyDown={handleKeyPress}
                inputRef={inputRef}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ flex: 1 }}
                >
                  Borrar
                </Button>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  size="small"
                  onClick={handlePrint}
                  sx={{ flex: 1 }}
                >
                  Generar Etiqueta
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
