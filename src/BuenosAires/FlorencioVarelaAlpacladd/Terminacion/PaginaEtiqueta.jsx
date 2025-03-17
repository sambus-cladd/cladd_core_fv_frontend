import React, { useState, useRef, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Box, TextField, Grid, Button } from '@mui/material';
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

    // Create a ref for the codigos de barra TextField
    const codigosRef = useRef(null);

    // Focus the TextField on initial render
    useEffect(() => {
        codigosRef.current?.focus();
    }, []);
    const handleCodigo = (event) => {
        let value = event.target.value;

        const codes = value.split(',').filter(Boolean);

        // Limitar a un máximo de 11 códigos
        if (codes.length > 12) {
            return;
        }

        // Agregar una coma después de cada código de barra (suponiendo que son de longitud 8)
        if (value.length > 0 && value.length % 9 === 8) {
            value += ',';
        }

        setCodigosdebarra(value);

    };
    const removeTrailingCommaSpace = (text) => {
        return text.replace(/,\s*$/, ''); // Elimina la última coma y espacios en blanco, si existen
    };

    async function handleClick() {
        if (!codigosdebarra.trim()) {
            alert("Por favor, ingresa al menos un código de barra.");
            return;
        }
    
        setLoading(true);
    
        let codigos = removeTrailingCommaSpace(codigosdebarra)
            .split(',')
            .map(codigo => codigo.padStart(9, '0')); // Agrega el cero si el código tiene menos de 9 dígitos
    
        let body = { codigos: codigos.join(',') }; // Convertir array en cadena separada por comas
    
        console.log("Enviando a la API:", body); // 👀 Verifica que los códigos ahora tengan el cero
    
        try {
            let fecha = dayjs().format('DD/MM/YYYY HH:mm:ss');
            let respuesta = await getDatosDePiezas(body);
    
            console.log("Respuesta de la API:", respuesta); // 👀 Verifica la respuesta
    
            if (respuesta.data && respuesta.data.length > 0) {
                await handlePrint(respuesta.data, fecha);
                handleDelete();
            } else {
                alert("No se encontraron piezas. Verifica los códigos ingresados.");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        } finally {
            setLoading(false);
        }
    }
    
    
    

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    };
    async function handleDelete() {
        setCodigosdebarra('');
        setHdr('');
        setPosicion('');
    }

    async function handlePrint(piezas, fecha) {
        let primera = piezas.filter(pieza => pieza.COD_CALIDAD === 1).length;
        let cantidad = piezas.length;
        const newWindow = window.open('', '_blank');
    
        if (!newWindow) {
            alert("No se pudo abrir la nueva ventana. Verifica los bloqueadores emergentes.");
            return;
        }
    
        const rootElement = newWindow.document.createElement('div');
        newWindow.document.body.appendChild(rootElement);
    
        setTimeout(() => {
            try {
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
            } catch (error) {
                console.error("Error al renderizar el PDF:", error);
            }
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
            }}>
                <CardAlpa>
                <Grid container spacing={2} direction="row" padding={2}>
                    {/* Campo de códigos de barra */}
                    <Grid item xs={12} md={10}>
                        <TextField
                            label="Escanea los códigos de barra"
                            variant="outlined"
                            value={codigosdebarra}
                            onChange={handleCodigo}
                            inputRef={codigosRef}
                            fullWidth
                            sx={{ mb: 2 }} // Agrega margen abajo
                        />
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LoadingButton 
                            loading={loading} 
                            variant="contained" 
                            size="small" 
                            onClick={handleClick}
                            sx={{ width: "100%" }} // Para que se alinee mejor en pantallas pequeñas
                        >
                            Generar PDF
                        </LoadingButton>
                    </Grid>

                    {/* Campo de Hoja de Ruta */}
                    <Grid item xs={12} md={5}>
                        <TextField
                            label="Hoja de ruta"
                            variant="outlined"
                            value={hdr}
                            onChange={(e) => setHdr(e.target.value)}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Campo de Posición */}
                    <Grid item xs={12} md={5}>
                        <TextField
                            label="Posición"
                            variant="outlined"
                            value={posicion}
                            onChange={(e) => setPosicion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Botón de Borrar */}
                    <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<DeleteIcon />} 
                            onClick={handleDelete}
                            sx={{ width: "100%" }}
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
