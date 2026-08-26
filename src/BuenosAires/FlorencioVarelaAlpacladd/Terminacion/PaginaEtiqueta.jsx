import React, { useState, useRef, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Box, TextField, Grid, Button, Snackbar, Alert, Typography } from '@mui/material';
import { createRoot } from 'react-dom/client';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import EtiquetaCalidadLetter from './Components/EtiquetaCalidadLetter';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDatosDePiezas } from '../API/APIFunctions';
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

const PaginaCalidad = () => {
  const [codigosdebarra, setCodigosdebarra] = useState('');
  const [hdr, setHdr] = useState('');
  const [posicion, setPosicion] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
  const codigosRef = useRef(null);
  const [codigosFaltantes, setCodigosFaltantes] = useState([]);

  useEffect(() => {
    codigosRef.current?.focus();
  }, []);

  const normalizarCodigo = (codigo) => codigo.padStart(9, '0');

  const limpiarYNormalizarCodigos = (valor) => {
    let codes = valor.split(',').map((code) => code.trim()).filter(Boolean);
    codes = codes.map((code) => {
      if (code.length < 9) return normalizarCodigo(code);
      if (code.length > 9) {
        showSnackbar(`El código ${code} tiene más de 9 caracteres, se recortará.`, 'warning');
        return code.slice(0, 9);
      }
      return code;
    });
    return codes.join(',');
  };

  const handleCodigo = (event) => {
    let value = event.target.value.replace(/\s+/g, '');
    let codes = value.split(',').map((code) => code.trim());
    if (codes.length > 0) {
      const ultimo = codes[codes.length - 1];
      if ((ultimo.length === 8 || ultimo.length === 9) && value[value.length - 1] !== ',') {
        value += ',';
      }
    }
    setCodigosdebarra(value);
  };

  const handleBlur = () => {
    setCodigosdebarra(limpiarYNormalizarCodigos(codigosdebarra));
  };

  const showSnackbar = (message, severity = 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  async function handleClick() {
    if (!codigosdebarra.trim()) {
      showSnackbar('Por favor, ingresa al menos un código de barra.', 'warning');
      return;
    }

    setLoading(true);
    const codigosOriginales = limpiarYNormalizarCodigos(codigosdebarra)
      .split(',')
      .map((code) => code.trim())
      .filter(Boolean);
    const body = { codigos: codigosOriginales.join(',') };

    try {
      const fecha = dayjs().format('DD/MM/YYYY HH:mm:ss');
      const respuesta = await getDatosDePiezas(body);
      const piezasEncontradas = (respuesta.data || []).map((pieza) => pieza.ROLLOS.trim());
      const codigosNoEncontrados = codigosOriginales.filter((codigo) => !piezasEncontradas.includes(codigo));

      if (codigosNoEncontrados.length > 0) {
        setCodigosFaltantes(codigosNoEncontrados);
        showSnackbar('Existen códigos no encontrados. Revisa el listado.', 'warning');
        return;
      }
      setCodigosFaltantes([]);

      if (respuesta.data && respuesta.data.length > 0) {
        await handlePrint(respuesta.data, fecha);
        handleDelete();
        showSnackbar('Etiqueta generada correctamente.', 'success');
      } else {
        showSnackbar('No se encontraron piezas. Verifica los códigos ingresados.', 'warning');
      }
    } catch (error) {
      showSnackbar('Error al conectar con el servidor.', 'error');
      console.error('Error en la petición:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleClick();
  };

  const handleDelete = () => {
    setCodigosdebarra('');
    setHdr('');
    setPosicion('');
  };

  async function handlePrint(piezas, fecha) {
    const primera = piezas.filter((pieza) => pieza.COD_CALIDAD === 1).length;
    const cantidad = piezas.length;
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      showSnackbar('No se pudo abrir la nueva ventana. Verifica los bloqueadores emergentes.', 'warning');
      return;
    }
    const rootElement = newWindow.document.createElement('div');
    newWindow.document.body.appendChild(rootElement);
    setTimeout(() => {
      const reactRoot = createRoot(rootElement);
      reactRoot.render(
        <PDFViewer width="100%" height="600">
          <EtiquetaCalidadLetter
            lote={piezas[0].LOTE}
            articulo={piezas[0].RO_ARTIC}
            piezas={piezas}
            primera={primera}
            cantidad={cantidad}
            orden=""
            posicion={posicion}
            hdr={hdr}
            fecha={fecha}
          />
        </PDFViewer>
      );
    }, 1000);
  }

  return (
    <HeaderYFooter titulo="ETIQUETA" routes={[]} color="alpacladd" showMainMenu={false}>
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
          autoHideDuration={10000}
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
              <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Etiqueta de calidad</Typography>
              <Typography variant="body2" sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, mb: 1 }}>
                Escaneá o ingresá los códigos de barra para generar el PDF.
              </Typography>
            </Grid>

            {codigosFaltantes.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="error">
                  No se encontraron los siguientes códigos: <strong>{codigosFaltantes.join(', ')}</strong>
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} md={9}>
              <TextField
                label="Códigos de barra"
                variant="outlined"
                value={codigosdebarra}
                onChange={handleCodigo}
                onBlur={handleBlur}
                inputRef={codigosRef}
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LoadingButton loading={loading} variant="contained" onClick={handleClick} fullWidth sx={{ ...primaryBtnSx, height: '100%', minHeight: 56 }}>
                Generar PDF
              </LoadingButton>
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField label="Hoja de ruta" variant="outlined" value={hdr} onChange={(e) => setHdr(e.target.value)} onKeyDown={handleKeyDown} fullWidth sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField label="Posición" variant="outlined" value={posicion} onChange={(e) => setPosicion(e.target.value)} onKeyDown={handleKeyDown} fullWidth sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                fullWidth
                sx={{ fontFamily: 'Poppins', textTransform: 'none', borderRadius: '10px', height: '100%', minHeight: 56 }}
              >
                Borrar
              </Button>
            </Grid>
          </Grid>
        </CardAlpa>
      </Box>
    </HeaderYFooter>
  );
};

export default PaginaCalidad;
