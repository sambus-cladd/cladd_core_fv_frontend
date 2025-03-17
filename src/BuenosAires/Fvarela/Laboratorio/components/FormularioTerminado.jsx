import { useEffect, useState, React } from 'react';
import { useParams } from 'react-router-dom';
// import { Navbar } from '../../../../components'
import {
    Box,
    Card,
    Grid,
    Select,
    SelectChangeEvent,
    MenuItem,
    Typography,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Link,
    InputAdornment,
    Input,
    InputLabel,
    OutlinedInput,
    FormControl
} from '@mui/material/';

import DvrIcon from '@mui/icons-material/Dvr';
import EventIcon from '@mui/icons-material/Event';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// FIN DE PDF
// INICIO DE DATA PICKER
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
// FIN DE DATA PICKER

import { Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { Navbar } from '../../../../components';

function FormularioTerminado() {
    let AuxFecha = new Date(Date.now())
    let identificadorIntervaloDeTiempo = 60000;// 1/2 Minuto

    //FECHA DEL FORMULARIO
    const [Fecha, setFecha] = useState(AuxFecha);
    //SELECCIÓN DE TURNO
    const [ValorTurno, setValorTurno] = useState(-1);
    //SELECCIÓN DE SUPERVISOR
    const [ValorSupervisor, setValorSupervisor] = useState(-1);

    //SELECCIÓN DE SUPERVISOR
    const [ValorOperador, setValorOperador] = useState(-1);

    /***************************************INICIO DE EVENTOS**************************************************************** */
    //EVENTO QUE CARGA LA OPCIÓN SELECCIONADA DEL TURNO 
    const handleSelectTurno = (event) => {
        setValorTurno(event.target.value);
    };
    //EVENTO QUE CARGA LA OPCIÓN SELECCIONADA DEL SUPERVISOR 
    const handleSelectSupervisor = (event) => {
        setValorSupervisor(event.target.value);
    };
    //EVENTO QUE CARGA LA OPCIÓN SELECCIONADA DEL OPERADOR 
    const handleSelectOperador = (event) => {
        setValorOperador(event.target.value);
    };



    return (
        <Grid container columns={12} rowSpacing={3} mt={0.5} mb={0.5} sx={{ paddingLeft: 2, paddingRight: 2 }} >

            {/* INICIO CARD DATOS DE CARGA */}
            <Grid item xs={12} sm={12} md={12}>   {/* <Grid xs={12} sm={12} md={12} m={2} rowSpacing={3} > */}
                <Card pb={2} sx={{ minWidth: '90%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                    <Grid container columns={12} p={1} m={1}>
                        {/* TITULO DE CARD */}
                        <Grid item xs={6} sm={6} md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                                <DvrIcon style={{ fontSize: "25px" }} />
                                <p style={{ textAlign: "left", paddingLeft: "5px" }}>Completar todos los campos </p>
                            </Box>
                        </Grid>
                        {/* FECHA */}
                        <Grid item xs={6} sm={6} md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", textAlign: "left", justifyContent: "flex-end" }}>
                                <EventIcon style={{ fontSize: "25px" }} />
                                <p style={{ textAlign: "right", paddingRight: "20px" }}>
                                    {Fecha.toLocaleDateString('en-GB')} | {Fecha.toLocaleTimeString('en-GB')}
                                </p>
                            </Box>
                        </Grid>
                        {/* TURNO */}
                        <Grid item xs={3} sm={3} md={3} m={1} >
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel required style={{ fontFamily: 'Poppins, sans-serif' }}>TURNO</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="Turno"
                                    value={ValorTurno}
                                    label="TURNO"
                                    onChange={handleSelectTurno}
                                    startAdornment={<DateRangeIcon position="Start" />}
                                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={-1}>Elegir Turno</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"TM"}>TM</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"TT"}>TT</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"TN"}>TN</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* SUPERVISOR */}
                        <Grid item xs={4} sm={4} md={4} m={1} >
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel required style={{ fontFamily: 'Poppins, sans-serif' }}>Supervisor</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="SUPERVISOR"
                                    value={ValorSupervisor}
                                    label="SUPERVISOR"
                                    onChange={handleSelectSupervisor}
                                    startAdornment={<PersonPinIcon position="Start" />}
                                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={-1}>Elegir Supervisor</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"SUP 1"}>TM</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"SUP 2"}>TT</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"SUP 3"}>TN</MenuItem>

                                    {/* {
                                    SupervisorNames.map(name => (
                                        <MenuItem value={name}>{name}</MenuItem>
                                    ))
                                } */}

                                </Select>
                            </FormControl>
                        </Grid>
                        {/* OPERADOR */}
                        <Grid item xs={4} sm={4} md={4} m={1} >
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel required style={{ fontFamily: 'Poppins, sans-serif' }}>OPERADOR</InputLabel>
                                <Select
                                    labelId="demo-simple-select-operador"
                                    id="OPERADOR"
                                    value={ValorOperador}
                                    label="OPERADOR"
                                    onChange={handleSelectOperador}
                                    startAdornment={<PersonPinIcon position="Start" />}
                                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={-1}>Elegir Operador</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"OP 1"}>TM</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"OP 2"}>TT</MenuItem>
                                    <MenuItem style={{ fontFamily: 'Poppins, sans-serif' }} value={"OP 3"}>TN</MenuItem>

                                    {/* {
                                    SupervisorNames.map(name => (
                                        <MenuItem value={name}>{name}</MenuItem>
                                    ))
                                } */}

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            {/* FIN CARD DATOS DE CARGA */}

            {/* INICIO CARD Nº 2 */}
            <Grid item xs={12} sm={12} md={12}>
                <Card sx={{ minWidth: '90%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                    <Grid container columns={12} columnSpacing={0} rowSpacing={3} p={2} mb={0.5} mt={0.5} >
                        {/*TARIMA  */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-TARIMA" style={{ fontFamily: 'Poppins, sans-serif' }}>Tarima</InputLabel>
                                <OutlinedInput
                                    id="outlined-TARIMA"
                                    label="Tarima"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }}
                                    // endAdornment={<InputAdornment position="Start">m</InputAdornment>}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/* RUTINA */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-RUTINA" style={{ fontFamily: 'Poppins, sans-serif' }}>Rutina</InputLabel>
                                <OutlinedInput
                                    id="outlined-RUTINA"
                                    // startAdornment={<EMobiledataIcon position="Start" />}
                                    label="Rutina"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }} 
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/* ARTICULO */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-ARTICULO" style={{ fontFamily: 'Poppins, sans-serif' }}>Articulo</InputLabel>
                                <OutlinedInput
                                    id="outlined-ARTICULO"
                                    // startAdornment={<EMobiledataIcon position="Start" />}
                                    label="Articulo"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }} 
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/* LOTE */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-LOTE" style={{ fontFamily: 'Poppins, sans-serif' }}>Lote</InputLabel>
                                <OutlinedInput
                                    id="outlined-LOTE"
                                    // startAdornment={<EMobiledataIcon position="Start" />}
                                    label="LOTE"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }} 
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/*  LONGITUD DEL LOTE */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-RUTINA" style={{ fontFamily: 'Poppins, sans-serif' }}>Longitud Lote</InputLabel>
                                <OutlinedInput
                                    id="outlined-LongLote"
                                    // startAdornment={<EMobiledataIcon position="Start" />}
                                    label="Longitud Lote"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }} 
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/* CORTE DE LA MUESTRA */}
                        <Grid xs={3} sm={3} md={3} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-RUTINA" style={{ fontFamily: 'Poppins, sans-serif' }}>Muestra</InputLabel>
                                <OutlinedInput
                                    id="outlined-MUESTRA"
                                    // startAdornment={<EMobiledataIcon position="Start" />}
                                    label="Muestra"
                                    // value={MOrden}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Metros Orden Caracter Invalido');
                                    //     else setMOrden(event.target.value);
                                    // }} 
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                        </Grid>
                        {/* LIGAMENTO / DIBUJO */}
                        <Grid xs={6} sm={6} md={6} pr={0.5} pl={0.5} mb={0.5} mt={0.5}>

                            <FormControl fullWidth>
                                <InputLabel htmlFor="select-label-LIGDIBU" style={{ fontFamily: 'Poppins, sans-serif' }}> Ligamento | Dibujo </InputLabel>
                                <Select
                                    labelId="select-label-LIGDIBU"
                                    id="select-label-LIGDIBU"
                                    // value={ValorTurno}
                                    label="Ligamento | Dibujo    "
                                // onChange={handleSelectTurno}
                                // startAdornment={<DateRangeIcon position="Start" />}
                                >
                                    <MenuItem value={-1}>Elegir Opcion</MenuItem>
                                    <MenuItem value={"SargaZ"}>Sarga Z</MenuItem>
                                    <MenuItem value={"SargaS"}>Sarga S</MenuItem>
                                    <MenuItem value={"SatenZ"}>Saten Z</MenuItem>
                                    <MenuItem value={"SatenS"}>Saten S</MenuItem>
                                    <MenuItem value={"Tafetan"}>Tafetán</MenuItem>
                                    <MenuItem value={"Broken"}>Broken</MenuItem>
                                    <MenuItem value={"ConveccionS"}>Convección S</MenuItem>
                                    <MenuItem value={"Fantasia"}>Fantasía</MenuItem>
                                    <MenuItem value={"Panama"}>Panamá</MenuItem>
                                    <MenuItem value={"Pique"}>Piqué</MenuItem>
                                    <MenuItem value={"Reps"}>Reps</MenuItem>
                                </Select>
                            </FormControl>

                        </Grid>
                        {/*OBSERVACIONES*/}
                        <Grid xs={12} sm={12} md={12} pl={0.5} mb={0.5} mt={0.5}  >
                            <Box >
                                <Grid container sx={{ width: "100%" }}   >
                                    <Grid xs={2} sm={2} md={2}  >
                                        <Typography sx={{}} >
                                            Observaciones:
                                        </Typography>
                                    </Grid>
                                    <Grid xs={12} sm={12} md={12}  >
                                        <Input
                                            label="Observaciones"
                                            multiline
                                            // id={Secuencia + "-Observaciones"}
                                            defaultValue=""
                                            // value={InputObservaciones}
                                            // onChange={(event) => { setInputObservaciones(event.target.value) }}
                                            // endAdornment={<NotesIcon position="end" />}
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                    </Grid>
                </Card>
            </Grid>
            {/* FIN CARD Nº 2 */}

            {/* INICIO CARD Nº 3 */}
            <Grid item xs={12} sm={12} md={12}>
                <Card sx={{ minWidth: '90%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                    <Grid container columns={12} columnSpacing={1} rowSpacing={3} p={2} mb={0.5} mt={0.5} >

                        {/*ANCHO Sin Lavar  */}
                        <Grid xs={3} sm={3} md={3} pl={1} pb={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Ancho sin lavar</InputLabel>
                                <OutlinedInput
                                    id="outlined-AnchoSinLavar"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Ancho sin lavar"
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}

                                />
                            </FormControl>
                        </Grid>


                        {/*  ANCHO Lavado */}
                        <Grid xs={3} sm={3} md={3} pl={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Ancho lavado</InputLabel>
                                <OutlinedInput
                                    id="outlined-Ancholavado"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Ancho lavado"
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}

                                />
                            </FormControl>
                        </Grid>

                        {/*   PESO Sin Lavar */}
                        <Grid xs={3} sm={3} md={3} pl={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Peso sin lavar</InputLabel>
                                <OutlinedInput
                                    id="outlined-PesoSinLavar"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Peso sin lavar"
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}

                                />
                            </FormControl>
                        </Grid>


                        {/* RECUENTO Urdido */}
                        <Grid xs={3} sm={3} md={3} pl={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Recuento Urdido</InputLabel>
                                <OutlinedInput
                                    id="outlined-RecuentoUrdido"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Recuento Urdido"
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}

                                />
                            </FormControl>
                        </Grid>


                        {/*  LONGITUD DEL LOTE */}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Longitud de Lote</InputLabel>
                                <OutlinedInput
                                    id="outlined-LongitudLote"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Longitud de Lote"
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/*  RECUENTO Trama */}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Recuento Trama</InputLabel>
                                <OutlinedInput
                                    id="outlined-RecuentoTrama"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Recuento Trama "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>

                        {/* ESTABILIDAD Trama*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Estabilidad Trama</InputLabel>
                                <OutlinedInput
                                    id="outlined-EstabilidadTrama"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Estabilidad Trama "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/* ESTABILIDAD Urdido*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Estabilidad Urdido</InputLabel>
                                <OutlinedInput
                                    id="outlined-EstabilidadUrdido"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Estabilidad Urdido "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/*PREDISTORSION Izq*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Predistorsión Izq.</InputLabel>
                                <OutlinedInput
                                    id="outlined-PredistorsiónIzq"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Predistorsión Izq. "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/* PREDISTORSION Der */}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Predistorsión Der.</InputLabel>
                                <OutlinedInput
                                    id="outlined-PredistorsiónDer"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Predistorsión Der. "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>

                        {/*MOVIMIENTO Izq*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Movimiento Izq.</InputLabel>
                                <OutlinedInput
                                    id="outlined-MovimientoIzq"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Movimiento Izq. "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/*MOVIMIENTO Der*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Movimiento Der.</InputLabel>
                                <OutlinedInput
                                    id="outlined-MovimientoDer"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Movimiento Der. "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>

                        {/*ELASTICIDAD Lavada*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Elasticidad Lavada</InputLabel>
                                <OutlinedInput
                                    id="outlined-ElasticidadLavada"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Elasticidad Lavada "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>


                        {/*DEFORMACION Lavada*/}
                        <Grid xs={3} sm={3} md={3} pl={1} mt={1} sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                            <FormControl sx={{ m: 0 }} style={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-Manometro" style={{ fontFamily: 'Poppins, sans-serif' }}>Deformación Lavada</InputLabel>
                                <OutlinedInput
                                    id="outlined-DeformaciónLavada"
                                    // startAdornment={<PinIcon position="Start" />}
                                    label="Deformación Lavada "
                                    // value={InputManometro}
                                    defaultValue=" "
                                    // onChange={(event) => {
                                    //     if ((isNaN(event.target.value))) alert('Manometro Caracter Invalido');
                                    //     else setInputManometro(event.target.value);
                                    // }}
                                    endAdornment={<InputAdornment position="Start">um</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
                </Card>
            </Grid>
            {/* FIN CARD Nº 3 */}

        </Grid>


    )
}

export default FormularioTerminado