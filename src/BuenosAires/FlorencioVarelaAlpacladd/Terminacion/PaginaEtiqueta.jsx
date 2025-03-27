import React, { useState, useRef, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Box, TextField, Grid, Button, Snackbar, Alert } from '@mui/material';
import { createRoot } from 'react-dom/client'; // Updated import
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import EtiquetaCalidadLetter from './Components/EtiquetaCalidadLetter';
import axios from 'axios';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {getDatosDePiezas} from '../API/APIFunctions';

const PaginaCalidad = () => {
    const [codigosdebarra, setCodigosdebarra] = useState('');
    const [hdr, setHdr] = useState('');
    const [posicion, setPosicion] = useState('');
    const [loading, setLoading] = useState(false);

    // Estado para Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('warning');

    // Ref para enfocar el input al cargar
    const codigosRef = useRef(null);

    useEffect(() => {
        codigosRef.current?.focus();
    }, []);

    // Normalizar un solo código (agregar ceros a la izquierda si tiene menos de 9 dígitos)
    const normalizarCodigo = (codigo) => {
        return codigo.padStart(9, '0');
    };

    // Limpia y normaliza toda la lista de códigos
    const limpiarYNormalizarCodigos = (valor) => {
        let codes = valor.split(',').map(code => code.trim()).filter(Boolean);

        codes = codes.map(code => {
            if (code.length < 9) {
                return normalizarCodigo(code);
            }
            if (code.length > 9) {
                showSnackbar(`El código ${code} tiene más de 9 caracteres, se recortará.`, 'warning');
                return code.slice(0, 9);
            }
            return code;  // Si tiene exactamente 9, lo deja igual
        });

        return codes.join(',');
    };

    // Maneja lo que el usuario escribe (sin modificar nada automáticamente)
    const handleCodigo = (event) => {
        let value = event.target.value;
    
        // Eliminar espacios extra
        value = value.replace(/\s+/g, '');
    
        // Dividir por comas y limpiar espacios en caso de que existan
        let codes = value.split(',').map(code => code.trim());
    
        // Verificar si el último código tiene 8 o 9 caracteres y agregar coma automáticamente
        if (codes.length > 0) {
            let ultimo = codes[codes.length - 1];
    
            if (ultimo.length === 8 || ultimo.length === 9) {
                // Si no termina con coma, se la agregamos
                if (value[value.length - 1] !== ',') {
                    value += ',';
                }
            }
        }
    
        setCodigosdebarra(value);
    };
    

    // Al salir del campo, normaliza toda la lista
    const handleBlur = () => {
        setCodigosdebarra(limpiarYNormalizarCodigos(codigosdebarra));
    };

    // Función para mostrar un mensaje de Snackbar
    const showSnackbar = (message, severity = 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    // Cerrar Snackbar
    const handleSnackbarClose = () => setSnackbarOpen(false);

    // Al hacer click en "Generar PDF"
    const [codigosFaltantes, setCodigosFaltantes] = useState([]);

    async function handleClick() {
        if (!codigosdebarra.trim()) {
            showSnackbar("Por favor, ingresa al menos un código de barra.", 'warning');
            return;
        }

        setLoading(true);

        const codigosOriginales = limpiarYNormalizarCodigos(codigosdebarra)
            .split(',')
            .map(code => code.trim())
            .filter(Boolean);

        const body = { codigos: codigosOriginales.join(',') };

        try {
            let fecha = dayjs().format('DD/MM/YYYY HH:mm:ss');
            let respuesta = await getDatosDePiezas(body);

            const piezasEncontradas = (respuesta.data || []).map(pieza => pieza.ROLLOS.trim());

            // Comparamos originales vs encontrados para detectar faltantes
            const codigosNoEncontrados = codigosOriginales.filter(codigo => !piezasEncontradas.includes(codigo));

            if (codigosNoEncontrados.length > 0) {
                setCodigosFaltantes(codigosNoEncontrados);  // Guardamos los faltantes para mostrar en pantalla
                showSnackbar(`Existen códigos no encontrados. Revisa el listado.`, 'warning');
                return;  // Evita avanzar a la impresión
            } else {
                setCodigosFaltantes([]);  // Limpia si todo fue bien
            }

            if (respuesta.data && respuesta.data.length > 0) {
                await handlePrint(respuesta.data, fecha);
                handleDelete();
                showSnackbar("Etiqueta generada correctamente.", 'success');
            } else {
                showSnackbar("No se encontraron piezas. Verifica los códigos ingresados.", 'warning');
            }
        } catch (error) {
            showSnackbar("Error al conectar con el servidor.", 'error');
            console.error("Error en la petición:", error);
        } finally {
            setLoading(false);
        }
    }


    // Generar PDF al presionar Enter
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') handleClick();
    };

    // Borrar campos
    const handleDelete = () => {
        setCodigosdebarra('');
        setHdr('');
        setPosicion('');
    };

    // Imprimir PDF
    async function handlePrint(piezas, fecha) {
        let primera = piezas.filter(pieza => pieza.COD_CALIDAD === 1).length;
        let cantidad = piezas.length;
        const newWindow = window.open('', '_blank');

        if (!newWindow) {
            showSnackbar("No se pudo abrir la nueva ventana. Verifica los bloqueadores emergentes.", 'warning');
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
        <HeaderYFooter titulo="ETIQUETA CALIDAD">
            <Box sx={{
                display: 'flex',
                width: { xs: '100%', sm: '100%', md: '60%' },
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                height: '60vh',
                position: 'relative'
            }}>
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

                <CardAlpa>
                    <Grid container spacing={2} padding={2}>

                        {/* Alert de códigos faltantes */}
                        {codigosFaltantes.length > 0 && (
                            <Grid item xs={12}>
                                <Alert severity="error">
                                    No se encontraron los siguientes códigos: <strong>{codigosFaltantes.join(', ')}</strong>
                                </Alert>
                            </Grid>
                        )}

                        <Grid item xs={12} md={10}>
                            <TextField
                                label="Escanea o escribe los códigos de barra"
                                variant="outlined"
                                value={codigosdebarra}
                                onChange={handleCodigo}
                                onBlur={handleBlur}
                                inputRef={codigosRef}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <LoadingButton
                                loading={loading}
                                variant="contained"
                                size="small"
                                onClick={handleClick}
                                sx={{ width: '100%' }}
                            >
                                Generar PDF
                            </LoadingButton>
                        </Grid>

                        {/* Otros campos */}
                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Hoja de ruta"
                                variant="outlined"
                                value={hdr}
                                onChange={(e) => setHdr(e.target.value)}
                                onKeyDown={handleKeyDown}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Posición"
                                variant="outlined"
                                value={posicion}
                                onChange={(e) => setPosicion(e.target.value)}
                                onKeyDown={handleKeyDown}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                sx={{ width: '100%' }}
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
