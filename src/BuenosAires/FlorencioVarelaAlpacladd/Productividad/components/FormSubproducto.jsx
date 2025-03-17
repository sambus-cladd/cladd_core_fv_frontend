import { useEffect, useState } from 'react';
import { Grid, Card, TextField, MenuItem, Button, Typography, InputAdornment, Dialog, DialogTitle, Autocomplete } from '@mui/material';
import dayjs from 'dayjs';

//API Function 
import { getTiposSubproductos, putRegistroSubprod } from '../../API/APIFunctions';
import { GetTABLACODMAQUINAS } from '../PCP/API/APIFunctions';

// Mui Icons
import PinIcon from '@mui/icons-material/Pin'
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function FormSubproducto() {

    const SubProductos = ["Crudo", "Denim", "Puntera"];
    const [tiposDenim, setTiposDenim] = useState([]);
    const [tiposCrudo, setTiposCrudo] = useState([]);
    const [tiposPuntera, setTiposPuntera] = useState([]);
    const [maquinas, setMaquinas] = useState([])

    const [orden, setOrden] = useState("");
    const [maquina, setMaquina] = useState("");
    const [subproducto, setSubproducto] = useState("");
    const [tipoSubprod, setTipoSubprod] = useState("");
    const [kilos, setKilos] = useState("");
    const [fechaHoraActual, setFechaHoraActual] = useState(dayjs().format('DD/MM/YYYY HH:mm'));

    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [errores, setErrores] = useState({});

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

    useEffect(() => {
        // Actualiza la fecha y hora cada minuto
        const interval = setInterval(() => {
            setFechaHoraActual(dayjs().format('DD/MM/YYYY HH:mm'));
        }, 1000); // 60000 ms = 1 minuto

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ObtenerTipos = async () => {
            try {
                const response = await getTiposSubproductos()
                setTiposDenim(response.Dato)
                setTiposCrudo(response.Dato1)
                setTiposPuntera(response.Dato2)
                // console.log("response: ",response);

            } catch (error) {
                console.error("Error al obtener los tipos: ", error)
            }
        }
        ObtenerTipos();
    }, []);

    useEffect(() => {
        const ObtenerMaquinas = async () => {
            try {
                const response = await GetTABLACODMAQUINAS()
                setMaquinas(response.Dato)
                // console.log("Maquinas: ", response);

            } catch (error) {
                console.error("Error al obtener maquinas: ", error)
            }
        }
        ObtenerMaquinas();
    }, []);

    const vaciarForm = () => {
        setOrden("");
        setMaquina("");
        setSubproducto("");
        setTipoSubprod("");
        setKilos("");
    }

    const validar = () => {
        let tempErrores = {};
        if (!orden) tempErrores.Orden = "Este campo es obligatorio.";
        if (!maquina) tempErrores.Maquina = "Este campo es obligatorio.";
        if (!subproducto) tempErrores.SubProd = "Este campo es obligatorio.";
        if (!tipoSubprod) tempErrores.TipoSubProd = "Este campo es obligatorio.";
        if (!kilos) tempErrores.Kilos = "Este campo es obligatorio.";

        setErrores(tempErrores);
        return Object.keys(tempErrores).length === 0;

    };

    const handleButtonRegistro = async (datos) => {
        if (validar()) {
            try {
                let subprod = {
                    Orden: datos.Orden,
                    Maquina: datos.Maquina,
                    SubProducto: datos.SubProducto,
                    TipoSubProducto: datos.TipoSubProducto,
                    Kilos: datos.Kilos
                }

                let respuesta = await putRegistroSubprod(subprod);
                // console.log("res ", respuesta);

                if (respuesta.data.serverStatus === 34) {
                    toggleOpenDialogWithDelay();
                    vaciarForm();

                } else {
                    toggleOpenErrorWithDelay();
                }
            } catch (error) {
                console.error("Error en hanldeButtonRegistro: ", error)
            }
        };
    }

    return (
        <>
            {/* contenedor principal */}
            <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >

                {/* GRID FORM */}
                <Grid item xs={8} sm={8} md={8} padding={1}>
                    <Card sx={{ minWidth: '100%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, marginTop: '20px' }}>
                        {/* TITULO */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>
                            <Typography fontSize={25} fontFamily={"Poppins"} fontWeight={400}>
                                Registro SubProducto
                            </Typography>
                        </Grid>
                        {/* PRIMERA FILA*/}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                            {/* Orden */}
                            <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Orden"
                                    variant="outlined"
                                    value={orden}
                                    onChange={(event) => {
                                        const norden = event.target.value
                                        setOrden(norden);
                                    }}
                                    error={!!errores.Orden}
                                    helperText={errores.Orden}
                                // onFocus={(event) => {
                                //     event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                // }}
                                />
                            </Grid>

                            {/* Maquina */}
                            <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Maquina"
                                    variant="outlined"
                                    select
                                    value={maquina}
                                    onChange={(event) => {
                                        const maq = event.target.value
                                        setMaquina(maq);
                                    }}
                                    required
                                    error={!!errores.Maquina}
                                    helperText={errores.Maquina}
                                >
                                    <MenuItem value="">
                                        <em>Maquina</em>
                                    </MenuItem>
                                    {maquinas.map((maq) => (
                                        <MenuItem key={maq.id_cod_maquinas} value={maq.cod_maquina}>
                                            {maq.cod_maquina}
                                        </MenuItem>
                                    ))
                                    }
                                </TextField>
                            </Grid>

                            {/* Fecha y Hora */}
                            <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Fecha y Hora"
                                    variant="filled"
                                    focused
                                    value={fechaHoraActual}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        {/* CUARTA FILA  */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1}>

                            {/* SubProducto */}
                            <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="SubProducto"
                                    variant="outlined"
                                    select
                                    value={subproducto}
                                    onChange={(event) => {
                                        const subprod = event.target.value
                                        setSubproducto(subprod);
                                    }}
                                    required
                                    error={!!errores.SubProd}
                                    helperText={errores.SubProd}
                                >
                                    <MenuItem value="">
                                        <em>SubProducto</em>
                                    </MenuItem>
                                    {SubProductos.map((sub, index) => (
                                        <MenuItem key={index} value={sub}>
                                            {sub}
                                        </MenuItem>
                                    ))
                                    }
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4} padding={0.5}>
                                <Autocomplete
                                    fullWidth
                                    id="autocomplete-subproducto"
                                    options={
                                        subproducto === "Denim"
                                            ? tiposDenim
                                            : subproducto === "Crudo"
                                                ? tiposCrudo
                                                : subproducto === "Puntera"
                                                    ? tiposPuntera
                                                    : [] // Si no hay un subproducto válido, no hay opciones
                                    }
                                    getOptionLabel={(option) => option.tipo_subprod || ""}
                                    value={
                                        (subproducto === "Denim"
                                            ? tiposDenim
                                            : subproducto === "Crudo"
                                                ? tiposCrudo
                                                : subproducto === "Puntera"
                                                    ? tiposPuntera
                                                    : []
                                        ).find((option) => option.tipo_subprod === tipoSubprod) || null
                                    }
                                    inputValue={tipoSubprod}
                                    onChange={(event, newValue) => {
                                        setTipoSubprod(newValue ? newValue.tipo_subprod : "");
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setTipoSubprod(newInputValue);
                                    }}
                                    noOptionsText="No options"
                                    renderInput={(params) => (
                                        <TextField
                                            label="Tipo"
                                            error={!!errores.TipoSubProd}
                                            helperText={errores.TipoSubProd}
                                            {...params}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Kg */}
                            <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Kg"
                                    variant="outlined"
                                    type='number'
                                    value={kilos}
                                    onChange={(event) => {
                                        const kg = event.target.value
                                        setKilos(kg);
                                    }}
                                    required
                                    error={!!errores.Kilos}
                                    helperText={errores.Kilos}
                                // onFocus={(event) => {
                                //     event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                // }}
                                />
                            </Grid>
                        </Grid>
                        {/* FILA BOTON */}
                        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" padding={2}>

                            <Grid item xs={6} sm={6} md={6} justifyContent="flex-end" alignItems="flex-end">
                                <Button variant="contained" style={{ color: 'white' }}
                                    onClick={() => {
                                        let aux = {
                                            Orden: orden,
                                            Maquina: maquina,
                                            SubProducto: subproducto,
                                            TipoSubProducto: tipoSubprod,
                                            Kilos: kilos
                                        }
                                        handleButtonRegistro(aux);
                                    }}
                                >
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Registrar Datos
                                    </Typography>
                                </Button>
                            </Grid>

                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            {/* INICIO -- Mensajes popup */}
            <Dialog open={openDialog} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#00AC60', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <TaskAltIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    Datos enviados con éxito!
                </DialogTitle>
            </Dialog>


            <Dialog open={openError} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#e00000', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <CancelIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    No se pudo realizar la carga
                </DialogTitle>
            </Dialog>
            {/* FIN -- Mensajes popup */}
        </>
    )

}
export default FormSubproducto;