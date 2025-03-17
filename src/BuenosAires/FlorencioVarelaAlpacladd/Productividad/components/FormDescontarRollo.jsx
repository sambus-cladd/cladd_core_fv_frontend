import { Grid, Card, TextField, MenuItem, Button, Typography, InputAdornment, Dialog, DialogTitle } from '@mui/material'
import { useState } from 'react';
import PinIcon from '@mui/icons-material/Pin'
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AbcIcon from '@mui/icons-material/Abc';
import Alert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import {putDescontarRolloDeposito, getBuscarRolloDeposito} from '../../API/APIFunctions';
function FormDescontarRollo() {

    const [mensaje, setMensaje] = useState('');
    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [rollo, setRollo] = useState('');
    const [secuencia, setSecuencia] = useState('');
    const [partida, setPartida] = useState('');
    const [articulo, setArticulo] = useState('');
    const [estado, setEstado] = useState('');
    const [peso, setPeso] = useState('');
    const [metros, setMetros] = useState('');
    const [fecha, setFecha] = useState('');
    const [telar, setTelar] = useState('');
    const [destino, setDestino] = useState('');
    const [rack, setRack] = useState('');
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [habilitarWarning, setHabilitarWarning] = useState(false);
    const [encotroRollo, setEncontroRollo] = useState(false);

    async function toggleOpenErrorWithDelay() {
        setopenError(true); // Establecer openError en true
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 1 segundo
        setopenError(false); // Establecer openError en false después de esperar 1 segundo
    }

    async function toggleOpenDialogWithDelay() {
        setopenDialog(true); // Establecer openError en true  
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 1 segundo
        setopenDialog(false); // Establecer openError en false después de esperar 1 segundo
    }

    async function handleRegistrar() {

        if (!encotroRollo) {
            setMensaje(`No se encontró el rollo ${rollo} en el stock`);
            toggleOpenErrorWithDelay();
            return;
        }

        try {
            let respuesta = await putDescontarRolloDeposito(rollo);

            if (respuesta.status >= 200 && respuesta.status < 300) {
                setMensaje(`Rollo ${rollo} descontado con éxito`);
                toggleOpenDialogWithDelay();
            } else {
                setMensaje("Conexión realizada pero con posibles problemas");
                toggleOpenErrorWithDelay();
            }
        } catch (error) {
            setMensaje('Error al intentar descontar el rollo');
            toggleOpenErrorWithDelay();
        }
    };

    const setData = (rollo) => {
        try {
            setSecuencia(rollo.secuencia_lr);
            setPartida(rollo.orden_lr);
            setEstado(rollo.estado);
            setArticulo(rollo.articulo);
            setPeso(rollo.kilos);
            setMetros(rollo.largo);
            setFecha(rollo.fecha_registro);
            setTelar(rollo.telar);
            setRack(rollo.numero_rack);
            setDestino(rollo.destino);
            if (rollo.estado === 'Reservado') {
                setMensajeAlerta('Estás por enviar un rollo a producción, ¿Estás seguro?');
                setHabilitarWarning(true);
            } 
            if(rollo.estado === 'Stock') {
                setMensajeAlerta('El rollo no se encuentra reservado para ninguna orden de trabajo');
                setHabilitarWarning(true);
            }
            if(rollo.estado === 'Produccion' || rollo.estado === 'Calidad') {
                setMensajeAlerta('El rollo se encuentra acutalmente en producción');
                setHabilitarWarning(true);
            }
        } catch (error) {
            setMensaje('Error buscando rollo');
            toggleOpenErrorWithDelay();
        }
    }
    async function handleRollo(e) {
        setRollo(e.target.value);
        if (e.target.value.length !== 8) {
            setSecuencia('');
            setPartida('');
            setEstado('');
            setArticulo('');
            setPeso('');
            setMetros('');
            setFecha('');
            setTelar('');
            setDestino('');
            setEstado('');
            setRack('');
            setHabilitarWarning(false);
        }
        if (e.target.value.length === 8) {
            try {
                let respuesta = await getBuscarRolloDeposito(e.target.value);
                if (respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 0) {
                    setData(respuesta.data[0]);
                    setEncontroRollo(true);
                }
                else
                {
                    setHabilitarWarning(false);
                    setEncontroRollo(false);
                }

            } catch (error) {
                console.error('Error buscando rollo:', error);
            }
        }

    }

    return (
        <>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                <Grid item xs={12} container justifyContent="center">
                    <Card sx={{ width: "60rem", borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0 }}>
                        <Grid container direction="row" justifyContent="center" alignItems="flex-start" padding={2}>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Rollo"} value={rollo} id={`Form-Rollo`} fontFamily="Poppins" variant="outlined" type="number"
                                    onChange={(e) => {
                                        handleRollo(e);
                                    }}
                                    autoFocus

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Articulo"} value={articulo} id={`Form-Articulo`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setArticulo(e.target.value)
                                    }}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <AbcIcon />
                                            </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Estado"} value={estado} id={`Form-estado`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setEstado(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <AbcIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Secuencia"} value={secuencia} id={`Form-Secuencia`} readOnly fontFamily="Poppins" variant="outlined" type="number"
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>

                        </Grid>

                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={2}>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Partida"} value={partida} id={`Form-Partida`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setPartida(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <AbcIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>

                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Telar"} value={telar} id={`Form-Telar`} fontFamily="Poppins" variant="outlined" type="number"
                                    onChange={(e) => {
                                        setTelar(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Peso [Kg]"} value={peso} id={`Form-Peso`} fontFamily="Poppins" variant="outlined" type="number"
                                    onChange={(e) => {
                                        setPeso(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} paddingX={1}>
                                <TextField label={"Largo [m]"} value={metros} id={`Form-Metros`} fontFamily="Poppins" variant="outlined" type="number"
                                    onChange={(e) => {
                                        setMetros(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end" padding={2}>
                            <Grid item xs={3}>
                                <TextField label={"Fecha Tejido"} value={fecha} id={`Form-Fecha`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setFecha(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    sx={{ width: "80%" }}
                                    id="outlined-basic"
                                    label="Destino"
                                    variant="outlined"
                                    select
                                    value={destino}
                                    onChange={(event) => {
                                        setDestino(event.target.value);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Destino</em>
                                    </MenuItem>
                                    <MenuItem key={0} value="piso">
                                        Piso
                                    </MenuItem>
                                    <MenuItem key={1} value="deposito">
                                        Deposito
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField label={"N° Rack"} value={rack} id={`Form-Rack`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setRack(e.target.value)
                                    }}

                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <PinIcon />
                                            </InputAdornment>

                                    }}
                                    disabled={destino !== 'deposito'}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button variant="contained" color={encotroRollo ? 'error' : 'info'} style={{ color: 'white' }}
                                    onClick={() => {
                                        handleRegistrar();
                                    }}>
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Descontar Rollo
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {habilitarWarning &&
                    <Grid item xs={12} container justifyContent="center">
                        <Alert icon={<InfoIcon fontSize="inherit" />} variant='filled' severity="error" sx={{ paddingTop: '20' }}>
                            {mensajeAlerta}
                        </Alert>
                    </Grid>
                }
            </Grid>

            {/* INICIO -- Mensajes popup */}
            <Dialog open={openDialog} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#00AC60', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <TaskAltIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    {mensaje}
                </DialogTitle>
            </Dialog>


            <Dialog open={openError} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#e00000', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <CancelIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    {mensaje}
                </DialogTitle>
            </Dialog>
            {/* FIN -- Mensajes popup */}
        </>)
}

export default FormDescontarRollo