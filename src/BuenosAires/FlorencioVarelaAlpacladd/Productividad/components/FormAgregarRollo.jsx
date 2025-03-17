import { Grid, Card, TextField, MenuItem, Button, Typography, InputAdornment, Dialog, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react';
import PinIcon from '@mui/icons-material/Pin'
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AbcIcon from '@mui/icons-material/Abc';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import { getStockTotalPlanta, putAgregarRolloDeposito, getBuscarRolloAlpa } from '../../API/APIFunctions';
function FormAgregarRollo() {

    const [mensaje, setMensaje] = useState('');
    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [rollo, setRollo] = useState('');
    const [secuencia, setSecuencia] = useState('');
    const [partida, setPartida] = useState('');
    const [articulo, setArticulo] = useState('');
    const [nombreArticulo, setNombreArticulo] = useState('');
    const [dibujo, setDibujo] = useState('');
    const [peso, setPeso] = useState('');
    const [metros, setMetros] = useState('');
    const [ancho, setAncho] = useState('');
    const [fecha, setFecha] = useState('');
    const [telar, setTelar] = useState('');
    const [destino, setDestino] = useState('');
    const [rack, setRack] = useState('');
    const [cadena, setCadena] = useState('');
    const [titulo, setTitulo] = useState('');
    const [habilitarWarning, setHabilitarWarning] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [rollosUsados, setRollosUsados] = useState([]);
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
    async function fetchRollosEnStock() {
        try {
            let respuesta = await getStockTotalPlanta();
            if (respuesta?.data?.length > 0) {
                const rollosUsados = respuesta.data.map((item) => item.rollo);
                setRollosUsados(rollosUsados);
            }
            else {
                setRollosUsados([]);
            }
        } catch (error) {
            console.error('Error buscando rollos en stock:', error);
        }
    }

    useEffect(() => {
        fetchRollosEnStock();

        return () => {

        }
    }, [])

    function validarRolloExistente(rollo) {
        if (rollosUsados.includes(parseInt(rollo))) {
            setMensaje("El rollo ya fue registrado anteriormente");
            toggleOpenErrorWithDelay();
            return true;
        }
        return false;
    }
    async function handleRegistrar() {
        let datos = {
            rollo: rollo,
            secuencia: secuencia,
            partida: partida,
            articulo: articulo,
            metros: metros,
            fecha: fecha,
            destino: destino,
            rack: rack,
            telar: telar
        };
        console.log("Quiero registrar: ", datos);
        if (rollo.length !== 8) {
            setMensaje("El código del rollo debe tener 8 dígitos");
            toggleOpenErrorWithDelay();
            return;
        }
        if (validarRolloExistente(rollo)) {
            return;
        }
        if (articulo === '' || secuencia === '' || metros === '') {
            setMensaje("Error en 1 o más campos");
            toggleOpenErrorWithDelay();
            return;
        }
        if (destino === 'deposito' && rack === '') {
            setMensaje("No se puede registrar un rollo en deposito sin el número de rack");
            toggleOpenErrorWithDelay();
            return;
        }
        if (destino !== 'deposito' && destino !== 'piso') {
            setMensaje("Debe elegir algun destino para el rollo");
            toggleOpenErrorWithDelay();
            return;
        }

        try {
            let respuesta = await putAgregarRolloDeposito(datos);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                console.log("Conexión exitosa: ", respuesta);
                toggleOpenDialogWithDelay();
            } else {
                console.warn("Conexión realizada pero con posibles problemas: ", respuesta);
                toggleOpenErrorWithDelay();
            }
            console.log(respuesta);
        } catch (error) {
            console.error('Error registrando:', error);
        }
    };

    const setData = (rollo) => {
        try {
            setSecuencia(rollo.secuencia);
            setPartida(rollo.partida);
            setArticulo(rollo.articulo);
            setNombreArticulo(rollo.nombre_articulo);
            setPeso(rollo.kilos);
            setMetros(rollo.metros);
            setAncho(rollo.ancho);
            setFecha(rollo.fecha_registro);
            setTelar(rollo.telar);
            setMensajeAlerta('Estas por agregar el rollo ' + rollo.rollo + ' al Stock. ¿Estás seguro?');
            setHabilitarWarning(true);
        } catch (error) {
            console.error('Error buscando rollo:', error);
        }

    }
    async function handleRollo(e) {
        setRollo(e.target.value);

        if (e.target.value.length !== 8) {
            setSecuencia('');
            setPartida('');
            setArticulo('');
            setNombreArticulo('');
            setDibujo('');
            setPeso('');
            setMetros('');
            setAncho('');
            setFecha('');
            setTelar('');
            setDestino('');
            setRack('');
            setCadena('');
            setTitulo('');
            setMensajeAlerta('');
            setHabilitarWarning(false);
        }
        if (e.target.value.length === 8) {
            if (validarRolloExistente(e.target.value)) {
                return;
            }
            try {
                let respuesta = await getBuscarRolloAlpa(e.target.value);
                if (respuesta.data && Array.isArray(respuesta.data) && respuesta.data.length > 0) {
                    setData(respuesta.data[0]);
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
                                <TextField label={"Nombre"} value={nombreArticulo} id={`Form-NombreArticulo`} fontFamily="Poppins" variant="outlined"
                                    onChange={(e) => {
                                        setNombreArticulo(e.target.value)
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
                                <Button variant="contained" color={habilitarWarning ? 'success' : 'info'} style={{ color: 'white' }}
                                    onClick={() => {
                                        handleRegistrar();
                                    }}>
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Agregar Rollo
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {habilitarWarning &&
                    <Grid item xs={12} container justifyContent="center">
                        <Alert icon={<InfoIcon fontSize="inherit" />} variant='filled' severity="success" sx={{ paddingTop: '20' }}>
                            {mensajeAlerta}
                        </Alert>
                    </Grid>
                }

            </Grid >
            {/* INICIO -- Mensajes popup */}
            < Dialog open={openDialog} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }
            }>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#00AC60', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <TaskAltIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    Datos enviados con éxito!
                </DialogTitle>
            </Dialog >


            <Dialog open={openError} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#e00000', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <CancelIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    {mensaje}
                </DialogTitle>
            </Dialog>
            {/* FIN -- Mensajes popup */}
        </>)
}
export default FormAgregarRollo;