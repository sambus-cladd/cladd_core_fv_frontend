import { useEffect, useState, React } from 'react';
import { Card, TextField, Button, Dialog, DialogTitle, Modal, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import {  GetTABLAMAQUINAS, GetTABLAPROCESOS, GetTABLACODMAQUINAS } from '../PCP/API/APIFunctions'
import { putRegistroProdReal } from '../../API/APIFunctions';
import { GetProdxOrden } from '../PCP/API/APIFunctions';

function FormProduccionReal() {
    dayjs.extend(duration);
    dayjs.extend(customParseFormat);

    // const [selected, setSelected] = useState([]);
    // const [codmaquinas, setCodMaquinas] = useState([]);
    // const [maquinasproc, setMaquinaProc] = useState([]);
    // const [maquinasprocfil, setMaquinaProcFil] = useState([]);
    // const [procesos, setProcesos] = useState([]);
    // const [procesosfil, setProcesosFil] = useState([]);
    const [ordenes, setOrdenes] = useState([]) 

    const [InicioHora, setInicioHora] = useState(null);
    const [FinHora, setFinHora] = useState(null);
    const [errores, setErrores] = useState({});
    const [Orden, setOrden] = useState("");
    const [Maquina, setMaquina] = useState("");
    const [MaquinaProceso, setMaquinaProceso] = useState([]);
    const [Metros, setMetros] = useState("");
    const [Proceso, setProceso] = useState("");
    const [HorasT, setHoraT] = useState("");
    const [Color, setColor] = useState("");
    const [IdOrden, setIdOrden] = useState("");

    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [openModalTabla, setOpenModalTabla] = useState(false);

    async function toggleOpenErrorWithDelay() {
        setopenError(true); // Establecer openError en true
        await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar 1 segundo
        setopenError(false); // Establecer openError en false después de esperar 1 segundo
    }

    async function toggleOpenDialogWithDelay() {
        setopenDialog(true); // Establecer openError en true  
        await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar 1 segundo
        setopenDialog(false); // Establecer openError en false después de esperar 1 segundo
    }

    const vaciarForm = () => {
        setOrden("");
        setMaquina("");
        setMaquinaProceso("");
        setInicioHora(null);
        setFinHora(null);
        setHoraT("");
        setMetros("");
        setProceso("");
    };

    const validar = () => {
        let tempErrores = {};
        if (!InicioHora) tempErrores.InicioHora = "Este campo es obligatorio.";
        if (!FinHora) tempErrores.FinHora = "Este campo es obligatorio";
        if (!Metros) tempErrores.Metros = "Este campo es obligatorio";
        if (!HorasT) tempErrores.HorasTotal = "Este campo es obligatorio";
        setErrores(tempErrores);
        return Object.keys(tempErrores).length === 0;
    };

    useEffect(() => {
        calcularHoraFin();
    }, [InicioHora, HorasT]);

    const calcularHoraFin = () => {
        if (InicioHora && HorasT) {
            const horasTotales = parseFloat(HorasT);
            if (!isNaN(horasTotales)) {
                const duracionFinal = dayjs.duration(horasTotales, 'hours');
                const horasFinal = InicioHora.add(duracionFinal);
                setFinHora(horasFinal)
            }
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1200,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    //INICIO - BOTON REGISTRAR
    const handleButton = async (datos) => {
        console.log("datos: ",datos);
        
        try {
            let DatosProd = {
                Id: datos.Id,
                Orden: datos.Orden,
                Maquina: datos.Maquina,
                MaquinaProc: datos.MaquinaProc,
                Proceso: datos.Proceso,
                Color: datos.Color,
                Metros: datos.Metros,
                HorasT: datos.HorasT,
                InicioHora: datos.InicioHora.format('YYYY/MM/DD HH:mm'),
                FinHora: datos.FinHora.format('YYYY/MM/DD HH:mm')
            };
            let respuesta = await putRegistroProdReal(DatosProd)
            if (respuesta.serverStatus === 34) {
                setMensaje('Orden registrada correctamente');
                toggleOpenDialogWithDelay();
                vaciarForm();
            } else {
                setMensaje('Error al enviar datos a BBDD');
                toggleOpenErrorWithDelay();
            }
        } catch (error) {
            setMensaje('Error al enviar datos a BBDD');
            toggleOpenErrorWithDelay();
        }
    };

    async function GetOrdenes(Orden) {
        if(Orden) {
            let DataRaw = []
            DataRaw = await GetProdxOrden(Orden);
            console.log("datos: ", DataRaw);
            
            setOrdenes(DataRaw.Dato);
        }
    }

    const handleButtonBuscar = () => {
        // GetDatosProd(Orden);
        if ( ordenes.length > 0){
            // TablaOrdenes(ordenes);
            setOpenModalTabla(true);
        } else {
            alert('Orden no Registrada')
        }
    };

    function TablaOrdenes({ Serie }) {

        const [rows, setRows] = useState([]);
    
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 450,
            bgcolor: 'background.paper',
            // border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        };
    
        useEffect(() => {
            if (Serie && Serie.length !== 0) {
                const filas = Serie.map((item) => {
                    return {
                        id: item.id,
                        orden: item.orden,
                        articulo: item.articulo,
                        maquina: item.maquina,
                        maquinaProceso: item.maquina_proceso,
                        proceso: item.proceso,
                        metros: item.metros,
                        horasTotal: item.horas_total,
                        horaInicio: formathours(item.hora_inicio),
                        horaFin: formathours(item.hora_fin),
                        horaInicioCompleto: (dayjs(item.hora_inicio)),
                        horaFinCompleto: (dayjs(item.hora_fin)),
                        color: item.color,
                        fechaRegistro: formatDate(item.fecha_registro)
                    };
                });
                setRows(filas);
            } else {
                setRows([]);
            }
        }, [Serie]);
    
        const columns = [
            { field: 'id', headerName: 'id' },
            { field: 'orden', headerName: 'Orden', filterable: false, flex: 0.3, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) =>(
                <div
                    onClick={() => {
                        // Establece los valores en los estados correspondientes
                        setMaquina(params.row.maquina);
                        setMaquinaProceso(params.row.maquinaProceso);
                        setProceso(params.row.proceso)
                        setColor(params.row.color);
                        setIdOrden(params.row.id);
                        setOpenModalTabla(false)

                        // console.log("datos:", params.row.orden, params.row.maquinaProceso, params.row.articulo, params.row.horaInicio, params.row.horaFin);
                        
                        
                    }}
                    style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}
                >
                    {params.row.orden}
                </div>
            )},
            { field: 'articulo', headerName: 'Articulo', flex: 0.2, sortable: false, filterable: true, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'maquina', headerName: 'Maquina', flex: 0.2, sortable: false, filterable: true, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'maquinaProceso', headerName: 'Proceso Maq.', sortable: false, filterable: true, flex: 0.3, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'proceso', headerName: 'Proceso', sortable: false, filterable: true, flex: 0.3, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'metros', headerName: 'Metros', sortable: false, filterable: true, flex: 0.2, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'horasTotal', headerName: 'Hs Total', sortable: false, filterable: true, flex: 0.2, type: 'number', align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'horaInicio', headerName: 'Hs Inicio', sortable: false, filterable: true, flex: 0.2, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'horaFin', headerName: 'Hs Fin', sortable: false, filterable: true, flex: 0.2, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center' },
            { field: 'fechaRegistro', headerName: 'Registro', flex: 0.2, sortable: false, filterable: true, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center'}
        ];
        // Formateo de fecha a "dd/mm/yy HH:mm"
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // getMonth va del 0 al 11
            const year = date.getFullYear().toString().slice(-2); // Obtiene los dos últimos dígitos del año

            // Agrega ceros para días, meses, horas o minutos del 1 al 9
            const formattedDay = day < 10 ? '0' + day : day;
            const formattedMonth = month < 10 ? '0' + month : month;
            // Formato final "dd/mm/yy HH:mm"
            const fecha_formateada = `${formattedDay}/${formattedMonth}/${year}`;
            return fecha_formateada;
        }
        // Fornateo de horas a HH:mm
        function formathours(hoursString){
            const hours = new Date(hoursString);

            const horas = hours.getHours();
            const minutos = hours.getMinutes();

            const formattedHours = horas < 10 ? '0' + horas : horas;
            const formattedMinutes = minutos < 10 ? '0' + minutos : minutos;
            const hora_formateada = `${formattedHours}:${formattedMinutes}`
            return hora_formateada;
        }
        return (
            <>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            headerHeight={35} 
                            disableRowSelectionOnClick
                            getRowHeight={() => 40}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false
                                    },
                                },
                            }}
                            sx={{
                                fontFamily: "Poppins", 
                                fontSize: "0.8rem",
                                fontWeight: 650,
                                margin: "0rem",
                                backgroundColor: "#f4f4f4",
                                '& .super-app-theme--header': {
                                    backgroundColor: '#BABABA', // Cambia el color de fondo a azul
                                    color: 'white', // Cambia el color de texto a blanco
                                    fontFamily: 'Poppins',
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                },
                            }}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                        />
                       
            </>            
        );
    }

    const handleCloseModalTabla = () => {
        setOpenModalTabla(false);
    };

    const handleLimpiar = () => {
        vaciarForm();
        setOrdenes([]);
    }

    return (
        <>
            {/* contenedor principal */}
            <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >

                {/* GRID FORM */}
                <Grid item xs={9} sm={9} md={9} padding={1}>
                    <Card sx={{ minWidth: '100%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, marginTop: '20px' }}>

                        {/* PRIMERA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} marginTop={1}>

                            {/* HORA INICIO */}
                            <Grid item xs={12} sm={12} md={6} padding={0.5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es' >
                                    <DateTimePicker
                                        fullWidth
                                        label="Inicio"
                                        value={InicioHora}
                                        format='DD/MM/YYYY HH:mm'
                                        onChange={(newHoraInicio) => {
                                            setInicioHora(newHoraInicio);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid> 

                            {/* HORA FINAL */}
                            <Grid item xs={12} sm={12} md={6} padding={0.5}>

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es' >
                                    <DateTimePicker
                                        fullWidth
                                        label="Fin"
                                        value={FinHora}
                                        format='DD/MM/YYYY HH:mm'
                                        readOnly
                                        disabled
                                        onChange={(newHoraFinal) => {
                                            setFinHora(newHoraFinal);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} marginTop={'10px'}>

                            {/* BOTON BUSCAR */}
                            <Grid item xs={12} sm={1} md={1} padding={0.5} marginTop={1.3}>
                                <Button
                                    id='Button-Buscar' 
                                    variant="contained" 
                                    style={{ color: 'white' }}
                                    onClick={handleButtonBuscar}
                                >
                                    <SearchIcon/>
                                </Button>
                            </Grid>

                            {/* Orden */}
                            <Grid item xs={12} sm={2} md={2} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Orden"
                                    variant="filled"
                                    value={Orden}
                                    focused
                                    onChange={(event) => {
                                        const orden = event.target.value;
                                        setOrden(orden);
                                        GetOrdenes(orden);

                                    }}
                                    required
                                >
                                </TextField>
                            </Grid>

                            {/* Maquina */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Maquina"
                                    variant="filled"
                                    readOnly
                                    focused
                                    value={Maquina}
                                >
                                </TextField>
                            </Grid>

                            {/* Maquina Proceso */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Proc Maquina"
                                    variant="filled"
                                    readOnly
                                    focused
                                    value={MaquinaProceso}
                                >
                                </TextField>
                            </Grid>

                            {/* Proceso */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Proceso"
                                    variant="filled"
                                    value={Proceso}
                                    readOnly
                                    focused
                                >
                                </TextField>
                            </Grid>

                            {Proceso === "LINEA COLOR" && (
                                <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Color"
                                        variant="filled"
                                        value={Color}
                                        focused
                                        readOnly
                                    >
                                    </TextField>
                                </Grid>
                            )}
                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} marginTop={'10px'}>
                            {(Proceso !== 'MANTENIMIENTO' && Proceso !== 'LIMPIEZA') && (
                                <>
                                    {/* Metros */}
                                    <Grid item xs={12} sm={4} md={4} padding={0.5} >
                                        <TextField
                                            fullWidth
                                            label="Metros"
                                            variant='outlined'
                                            type='number'
                                            value={Metros}
                                            onChange={(event) => {
                                                const metros = event.target.value
                                                setMetros(metros);
                                            }}
                                        />
                                    </Grid>

                                    {/* Horas Total */}
                                    <Grid xs={12} sm={4} md={4} padding={0.5}>
                                        <TextField
                                            label="Horas Total"
                                            value={HorasT}
                                            type='number'
                                            onChange={(event) => {
                                                const horatotal = event.target.value
                                                setHoraT(horatotal);
                                                // let finHoraCalculada = addHours(InicioHora, parseFloat(horatotal));
                                                // setFinHora(finHoraCalculada); 

                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}

                            {(Proceso === 'MANTENIMIENTO' || Proceso === 'LIMPIEZA') && (
                                <Grid item xs={12} sm={8} md={8}>
                                    <TextField
                                        label="Horas Total"
                                        value={HorasT}
                                        type='number'
                                        onChange={(event) => {
                                            const horatotal = event.target.value
                                            setHoraT(horatotal);
                                            // let finHoraCalculada = addHours(InicioHora, parseFloat(horatotal));
                                            // setFinHora(finHoraCalculada); 

                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            )}
                        </Grid>

                        {/* FILA BOTON */}
                        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" padding={2}>
                            <Grid item xs={6} sm={6} md={6} justifyContent="flex-end" alignItems="flex-end">
                                <Button variant="contained" style={{ color: 'white' }}
                                    onClick={() => {handleLimpiar()}} >
                                        <DeleteIcon/>
                                </Button>
                            </Grid>

                            <Grid item xs={6} sm={6} md={6} justifyContent="flex-end" alignItems="flex-end">
                                <Button variant="contained" style={{ color: 'white' }}
                                    onClick={() => {
                                        let Aux = {
                                            Id: IdOrden,
                                            Orden: Orden,
                                            Maquina: Maquina,
                                            MaquinaProc: MaquinaProceso,
                                            Proceso: Proceso,
                                            Color: Color,
                                            Metros: Metros,
                                            HorasT: HorasT,
                                            InicioHora: InicioHora,
                                            FinHora: FinHora
                                        }
                                        handleButton(Aux)
                                    }}>
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Registrar Orden
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            <Modal open={openModalTabla} onClose={handleCloseModalTabla}>
                <Box sx={style}>
                    <Typography fontFamily={'Poppins'}>Seleccione Orden: </Typography>
                    <TablaOrdenes Serie={ordenes}/>
                </Box>
            </Modal>

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
        </>
    )
}

export default FormProduccionReal;