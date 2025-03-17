import React, { useState, useEffect } from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { Typography, Grid, Button, TextField, Autocomplete, FormControl, Select, MenuItem, Table } from '@mui/material'
import dayjs from 'dayjs'
import { getReporteEnsayosXArticulo, getArticulosFV, getEspecificacionArticulos } from '../../API/APIFunctions'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import GraficoLineaEnsayo from './GraficoLineaEnsayo'
import CircularProgress from '@mui/material/CircularProgress';
import MensajeDialog from '../../../../components/Plantilla/MensajeDialog';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const GraficosEnsayos = () => {
    const [fechaInicio, setFechaInicio] = useState(dayjs());
    const [fechaFin, setFechaFin] = useState(dayjs());
    const [articulo, setArticulo] = useState(null);
    const [serieAncho, setSerieAncho] = useState([]);
    const [recuentoTrama, setRecuentoTrama] = useState([]);
    const [articulosFV, setArticulosFV] = useState([]);
    const [motivo, setMotivo] = useState('Terminado');
    const motivos = ['Crudo', 'Lavado Potencial', 'Quick Wash', 'Terminado', 'Reprueba', 'Stock (sin lab.)', 'Personalizado'];
    const [especificacion, setEspecificacion] = useState([]);
    const [encogimientoTrama, setEncogimientoTrama] = useState([]);
    const [encogimientoUrdimbre, setEncogimientoUrdimbre] = useState([]);
    const [elasticidad, setElasticidad] = useState([]);
    const [deformacion, setDeformacion] = useState([]);
    const [peso, setPeso] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipo, setTipo] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [duracion, setDuracion] = useState(3000);
    const [rows, setRows] = useState([]);
    async function fetchReporte() {
        let body = {
            articulo: articulo,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };
        try {
            let respuesta = await getReporteEnsayosXArticulo(body);
            if (respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 0) {
                let anchoFormateado = respuesta?.data[0].filter((elemento) => elemento.ancho_sin_lavar_cal !== null);
                let tramaFormateado = respuesta?.data[0].filter((elemento) => elemento.recuento_trama_cal !== null);
                let encogimientoTrama = respuesta?.data[0].filter((elemento) => elemento.estabilidad_trama_cal !== null);
                let encogimientoUrdimbre = respuesta?.data[0].filter((elemento) => elemento.estabilidad_urdido_cal !== null);
                let elasticidad = respuesta?.data[0].filter((elemento) => elemento.elasticidad_lavada_cal !== null);
                let deformacion = respuesta?.data[0].filter((elemento) => elemento.deformacion_lavada_cal !== null);
                let peso = respuesta?.data[0].filter((elemento) => elemento.peso_sin_lavar_cal !== null);
                let promedio = respuesta?.data[1][0];
                return {
                    ancho: anchoFormateado, trama: tramaFormateado, encogimientoTrama: encogimientoTrama,
                    encogimientoUrdimbre: encogimientoUrdimbre, elasticidad: elasticidad, deformacion: deformacion, peso: peso,
                    promedios: promedio
                };
            }
        } catch (error) {
            alert("error: " + error);
        }
    }

    async function fetchArticulosFV() {
        try {
            let respuesta = await getArticulosFV();
            let articulos = respuesta.data.map((articulo) => articulo.PRODUCTO_ARTCOD);
            setArticulosFV(articulos);

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchArticulosFV();
        return () => {
        }
    }, [])
    async function fetchEspecificacion() {
        try {
            let respuesta = await getEspecificacionArticulos(articulo, motivo);
            if (respuesta.data && respuesta.data.especificacion.length > 0) {
                let response = respuesta.data.especificacion;
                return (response);
            }
            else {
                setMensaje("No hay especificación guardada del artículo " + articulo);
                setTipo('error');
                setDuracion(1000);
                setIsOpen(true);
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleGenerarReporte() {
        try {
            setIsLoading(true);

            // Realiza las llamadas y espera el resultado
            let serie = await fetchReporte();
            let especificacion = await fetchEspecificacion();
            let promedios = serie?.promedios;
            // Si tanto la serie como la especificación están vacías, muestra el mensaje de error
            if (
                (!serie || !Object.values(serie).some(arr => arr.length > 0)) &&
                (!especificacion || especificacion.length === 0)
            ) {
                setMensaje(`No hay ensayos registrados del artículo ${articulo} entre ${fechaInicio.format('DD/MM/YYYY')} y ${fechaFin.format('DD/MM/YYYY')}.`);
                setTipo('error');
                setDuracion(3000); // Puedes ajustar la duración del mensaje aquí
                setIsOpen(true);
            }
            else {
                // Asigna los datos si están presentes
                setSerieAncho(serie?.ancho || []);
                setRecuentoTrama(serie?.trama || []);
                setEncogimientoTrama(serie?.encogimientoTrama || []);
                setEncogimientoUrdimbre(serie?.encogimientoUrdimbre || []);
                setElasticidad(serie?.elasticidad || []);
                setDeformacion(serie?.deformacion || []);
                setPeso(serie?.peso || []);
                setEspecificacion(especificacion || []);
                if (serie.promedios) {
                    setRows([
                        {
                            ensayo: "Ancho sin lavar",
                            minimo: especificacion[0]?.ESPEC_MIN || '',
                            estandar: especificacion[0]?.ESPEC_STD || '',
                            maximo: especificacion[0]?.ESPEC_MAX || '',
                            promedio: promedios?.promedio_ancho_sin_lavar || '',
                        },
                        {
                            ensayo: "Recuento trama",
                            minimo: especificacion[8]?.ESPEC_MIN || '',
                            estandar: especificacion[8]?.ESPEC_STD || '',
                            maximo: especificacion[8]?.ESPEC_MAX || '',
                            promedio: promedios?.promedio_recuento_trama || '',
                        },
                        {
                            ensayo: "Estabilidad trama",
                            minimo: especificacion[1]?.ESPEC_MIN || '',
                            estandar: especificacion[1]?.ESPEC_STD || '',
                            maximo: especificacion[1]?.ESPEC_MAX || '',
                            promedio: promedios?.promedio_estabilidad_trama || '',
                        },
                        {
                            ensayo: "Estabilidad urdido",
                            minimo: especificacion[2]?.ESPEC_MIN || '',
                            estandar: especificacion[2]?.ESPEC_STD || '',
                            maximo: especificacion[2]?.ESPEC_MAX || '',
                            promedio: promedios?.promedio_estabilidad_urdido || '',
                        },
                        {
                            ensayo: "Peso sin lavar",
                            minimo: especificacion[5]?.ESPEC_MIN || '',
                            estandar: especificacion[5]?.ESPEC_STD || '',
                            maximo: especificacion[5]?.ESPEC_MAX || '',
                            promedio: promedios?.promedio_peso_sin_lavar || '',
                        },
                    ])
                }
                else {
                    setRows([]);
                }
            }
        } catch (error) {
            setMensaje("Error de comunicación con base de datos");
            setTipo('error');
            setIsOpen(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <Grid container direction={"row"} justifyContent={"center"} alignItems={"flex-start"}>
                    <Grid item xs={12} sm={4}>
                        <Grid container
                            direction="row"
                            sx={{
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}>
                            <Grid item xs={6}>
                                <Typography variant='h6' fontFamily={'Poppins'} fontSize={'bold'}>
                                    Artículo
                                </Typography>
                                <Autocomplete
                                    id="articulo-terminado"
                                    options={articulosFV}
                                    value={articulo}
                                    onChange={(event, newValue) => {
                                        setArticulo(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='h6' fontFamily={'Poppins'} fontSize={'bold'}>
                                    Motivo
                                </Typography>
                                <FormControl variant="standard" fullWidth>
                                    <Select
                                        id="motivo-select"
                                        value={motivo}
                                        onChange={(event) => setMotivo(event.target.value)}
                                        variant='outlined'
                                    >
                                        {motivos.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='h6' fontFamily={'Poppins'} fontSize={'bold'}>
                                    Desde
                                </Typography>
                                <DatePicker
                                    value={fechaInicio}
                                    onChange={(newValue) => setFechaInicio(newValue)}
                                    disableFuture
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='h6' fontFamily={'Poppins'} fontSize={'bold'}>
                                    Hasta
                                </Typography>
                                <DatePicker
                                    value={fechaFin}
                                    onChange={(newValue) => setFechaFin(newValue)}
                                    disableFuture
                                />
                            </Grid>
                            <Grid item xs={12} paddingTop={1}>
                                <Button variant='contained' onClick={handleGenerarReporte}>
                                    Generar reporte
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>{
                        isLoading &&
                        <Grid item xs={8}>
                            <CircularProgress />
                        </Grid>
                    }
                    <Grid item xs={12} sm={8}>
                        {serieAncho.length > 0 && <GraficoLineaEnsayo Serie={serieAncho} ensayo={"Ancho"} espec={especificacion} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {recuentoTrama.length > 0 && <GraficoLineaEnsayo Serie={recuentoTrama} ensayo={"RecuentoTrama"} espec={especificacion} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {encogimientoTrama.length > 0 && <GraficoLineaEnsayo Serie={encogimientoTrama} ensayo={"EncogimientoTrama"} espec={especificacion} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {encogimientoUrdimbre.length > 0 && <GraficoLineaEnsayo Serie={encogimientoUrdimbre} ensayo={"EncogimientoUrdimbre"} espec={especificacion} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {peso.length > 0 && <GraficoLineaEnsayo Serie={peso} ensayo={"Peso"} espec={especificacion} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {deformacion.length > 0 && <GraficoLineaEnsayo Serie={deformacion} ensayo={"Deformacion"} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {elasticidad.length > 0 && <GraficoLineaEnsayo Serie={elasticidad} ensayo={"Elasticidad"} />}
                    </Grid>
                </Grid>
            </LocalizationProvider >
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Ensayo </TableCell>
                            <TableCell align="right">Mínimo</TableCell>
                            <TableCell align="right">Estandar</TableCell>
                            <TableCell align="right">Máximo</TableCell>
                            <TableCell align="right">Promedio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right" component="th" scope="row">
                                    {row.ensayo}
                                </TableCell>
                                <TableCell align="right">{row.minimo}</TableCell>
                                <TableCell align="right">{row.estandar}</TableCell>
                                <TableCell align="right">{row.maximo}</TableCell>
                                <TableCell align="right">{row.promedio}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MensajeDialog
                mensaje={mensaje}
                tipo={tipo}
                isOpen={isOpen}
                duracion={duracion}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

export default GraficosEnsayos