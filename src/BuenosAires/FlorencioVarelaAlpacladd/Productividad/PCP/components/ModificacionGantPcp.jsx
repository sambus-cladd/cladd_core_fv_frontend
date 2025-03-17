import { useEffect, useState, React } from 'react';
import { Box, Card, Modal, Alert,  MenuItem, TextField, Button, Dialog,  DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import  { PutModificacionGantFV, GetTABLAMAQUINAS, GetTABLAPROCESOS, GetTABLACODMAQUINAS, GetProdxOrden, DeleteOrdenPcp } from '../API/APIFunctions'
import { set } from 'date-fns';

function FormularioGantPcp() {
    dayjs.extend(duration);
    dayjs.extend(customParseFormat);
    const [codmaquinas, setCodMaquinas] = useState([]);
    const [maquinasproc, setMaquinaProc] = useState([]);
    const [maquinasprocfil, setMaquinaProcFil] = useState([]);
    const [procesos, setProcesos] = useState([]);
    const [procesosfil, setProcesosFil] = useState([]);
    const [colores, setColores] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [openModalTabla, setOpenModalTabla] = useState(false);

    const [InicioHora, setInicioHora] = useState(null);
    const [FinHora, setFinHora] = useState(null);

    const [IdOrdenPcp, setIdOrdenPcp] = useState("");
    const [Orden, setOrden] = useState("");
    const [Maquina, setMaquina] = useState("");
    const [MaquinaProceso, setMaquinaProceso] = useState([]);
    const [Articulo, setArticulo] = useState("");
    const [Metros, setMetros] = useState("");
    const [Proceso, setProceso] = useState("");
    const [HorasT, setHoraT] = useState("");
    const [Color, setColor] = useState("");

    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);

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

    const [alertt, setAlert] = useState(null);
    
    useEffect(() => {
        if (alertt !== null) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 30000); // 30 segundos

            return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta o si cambia el valor de alert
        }
    }, [alertt]);

    const vaciarForm = () => {
        setOrden("");
        setMaquina("");
        setMaquinaProceso("");
        setProceso("");
        setArticulo("");
        setColor("");
        setInicioHora(null);
        setFinHora(null);
        setHoraT("");
        setMetros("");

    };

    /* --- INICIO TABLA MAQUINAS --- */
    useEffect(() => {
        const CargaMaquinas = async () => {
            try {
                const response = await GetTABLAMAQUINAS();
                setMaquinaProc(response.Dato);
                // console.log("Maquinas procesos : ", response.Dato);

            } catch (error) {
                console.error("Error al obtener las maquinas:", error);
            }
        }
        CargaMaquinas();
    }, []);
    /* --- FIN TABLA MAQUINAS */

    /* --- INICIO TABLA COD MAQUINAS --- */
    useEffect(() => {
        const CargaCodMaquinas = async () => {
            try {
                const response = await GetTABLACODMAQUINAS();
                setCodMaquinas(response.Dato);
                // console.log("Codigo Maquinas: ", response.Dato);
    
            } catch (error) {
                console.error("Error al obtener los codigos de maquinas:", error);
            }
        }
        CargaCodMaquinas();
    }, []);
    /* --- FIN TABLA COD MAQUINAS */

    /* --- INICIO TABLA PROCESOS --- */
    useEffect(() => {
        const CargaProcesos = async () =>{
            try {
                const response = await GetTABLAPROCESOS();
                const lineaColor = response.Dato.find(p => p.proceso === 'LINEA COLOR');
                const colores = lineaColor ? lineaColor.color.split(',') : [];
                setColores(colores)
                setProcesos(response.Dato)
                // console.log("Procesos: ", response.Dato);
            } catch(error) {
                console.error("Error al obtener los procesos:", error);
            }
        }
        CargaProcesos();
    }, []);
    /* --- FIN TABLA PROCESOS --- */

    useEffect(() => {
        if (Maquina) {
            filterProcMaq(Maquina);
            filterProc();  
        }
    }, [Maquina]);

    const filterProcMaq = (CodMaquina) => {
        const procesomaq = maquinasproc.filter(m => m.cod_maquina === CodMaquina);
        setMaquinaProcFil(procesomaq)
        // console.log("Procesos por maquina select", procesomaq);
        
    }

    const filterProc = () => {
        if (Maquina === "108" || Maquina === "GIRO LENTO") {
            const procesosFiltrados = procesos.filter(proceso => proceso.proceso !== "LINEA COLOR");
            setProcesosFil(procesosFiltrados);
        } else {
            setProcesosFil(procesos);
        }
    };

    //INICIO - BOTON REGISTRAR
    const handleButton = async (datos) => {
        // console.log("datos: ", datos);
        
            try {
                let DatosGant = {
                    IdOrden: datos.IdOrden,
                    Orden: datos.Orden,
                    Maquina: datos.Maquina,
                    MaquinaProc: datos.MaquinaProc,
                    Proceso: datos.Proceso,
                    Color: datos.Color,
                    Articulo: datos.Articulo,
                    Metros: datos.Metros,
                    HorasT: datos.HorasT,
                    InicioHora: datos.InicioHora.format('YYYY/MM/DD HH:mm') ,
                    FinHora: datos.FinHora.format('YYYY/MM/DD HH:mm')
                };

                let respuesta = await PutModificacionGantFV(DatosGant)

                if (respuesta.serverStatus === 34) {
                    toggleOpenDialogWithDelay();
                    vaciarForm();
                } else { 
                    toggleOpenErrorWithDelay();
                }

                // console.log("respuesta: ", respuesta, DatosGant)

                // window.location.reload('/Hilanderia'); // Recargar la página
            } catch (error) {
                console.error('Error en handleButtonEnviar:', error);
            }
    };
    //FIN - BOTON REGISTRAR

    async function GetDatosProd(Orden){
        if(Orden){
            let dataRAW = []
            dataRAW = await GetProdxOrden(Orden);
            // console.log("dataRAW", dataRAW)
            setOrdenes(dataRAW.Dato);
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
        const [idOrden, setIdOrden] = useState(null);
        const [openModal, setOpenModal] = useState(false);

    
        const hanldeOpenModal = (idOrden) => {
            setIdOrden(idOrden);
            setOpenModal(true);
        }
    
        const handleCloseModal = () => {
            setIdOrden(null);
            setOpenModal(false);
        }
    
        const handleConfirm = async () => {
            const response = await DeleteOrdenPcp(idOrden);
            if (response.serverStatus === 34) {
                // // Actualizar las filas eliminando el detalle correspondiente
                // setRows((prevRows) => prevRows.filter((row) => row.id !== idDetalleSelect));
                setAlert(1);
                setOpenModalTabla(false);
                vaciarForm();
                setOrdenes([]);
            } else {
                setAlert(2);
            }
        };
    
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
            { field: 'eliminar', headerName: '...', flex: 0.1,align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <DeleteForeverIcon sx={{ color: '#ff4a29'}} onClick={() => hanldeOpenModal(params.row.id)} />
            )},
            { field: 'orden', headerName: 'Orden', filterable: false, flex: 0.3, align: "center", headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) =>(
                <div
                    onClick={() => {
                        // Establece los valores en los estados correspondientes
                        setIdOrdenPcp(params.row.id);
                        setMaquina(params.row.maquina);
                        setMaquinaProceso(params.row.maquinaProceso);
                        setArticulo(params.row.articulo);
                        setMetros(params.row.metros);
                        setHoraT(params.row.horasTotal);
                        setProceso(params.row.proceso)
                        setInicioHora(params.row.horaInicioCompleto);
                        setFinHora(params.row.horaFinCompleto);
                        setColor(params.row.color);

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
                        <Modal open={openModal} onClose={handleCloseModal}>
                            <Box sx={style}>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <WarningAmberIcon sx={{ fontSize: 90, color: '#FFBA08' }}/>
                                </Box>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <Typography variant='h6' component='h2' fontFamily={"Poppins"} fontWeight={400}> 
                                        ¿ Seguro que desea Eliminar esta Orden ? 
                                    </Typography>
                                </Box>
                                <Box mt={2} display='flex' justifyContent="center" alignItems='center'> {/* Agrega margen superior para el botón */}
    
                                    <Button variant="contained" onClick={handleCloseModal} sx={{ marginRight: 4, backgroundColor: '#757575', '&:hover' : {backgroundColor: '#424242'}}}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" onClick={handleConfirm} color='error'>
                                        Eliminar
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                       
            </>            
        );
    }

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

    const handleCloseModalTabla = () => {
        setOpenModalTabla(false);
    }

    return (
        <>
            {/* contenedor principal */}
            <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >

                {/* GRID FORM */}
                <Grid item xs={8} sm={8} md={8} padding={1}>
                    <Card sx={{ minWidth: '100%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, marginTop: '20px' }}>
                        {/* MODIFICACIONES */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={0.5} marginTop={1}>
                            <Typography fontFamily={'Poppins'} fontSize={18} fontWeight={500} >
                                Ingresar Orden
                            </Typography>
                        </Grid>

                        {/* PRIMERA FILA */}
                        <Grid container direction="row" justifyContent="center" alignItems="center" padding={0.5} marginTop={1}>

                            {/* Orden */}
                            <Grid item xs={12} sm={5} md={5} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Orden"
                                    variant="filled"
                                    focused
                                    value={Orden}
                                    onChange={(event) => {
                                        const orden = event.target.value;
                                        setOrden(orden);
                                        GetDatosProd(orden);
                                    }}
                                >
                                </TextField>
                            </Grid>

                            {/* BOTON BUSCAR */}
                            <Grid item xs={12} sm={1} md={1} padding={0.5}>
                                <Button
                                    id='Button-Buscar' 
                                    fullWidth
                                    variant="contained" 
                                    style={{ color: 'white' }}
                                    onClick={handleButtonBuscar}
                                >
                                    <SearchIcon/>
                                </Button>
                            </Grid>

                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} marginTop={'10px'}>

                            {/* HORA INICIO */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es' >
                                    <DateTimePicker
                                        fullWidth
                                        label="Inicio"
                                        value={InicioHora}
                                        format='DD/MM/YYYY HH:mm'
                                        onChange={(newHoraInicio) => {
                                            // console.log("inicio: ", newHoraInicio);
                                            setInicioHora(newHoraInicio);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* HORA FINAL */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5}>
                                
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es' >
                                    <DateTimePicker
                                        fullWidth
                                        label="Fin"
                                        value={FinHora}
                                        format='DD/MM/YYYY HH:mm'
                                        onChange={(newHoraFinal) => {
                                            // console.log("final: ", newHoraFinal);
                                            setFinHora(newHoraFinal);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                             {/* Maquina */}
                             <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Maquina"
                                    variant="outlined"
                                    select
                                    value={Maquina}
                                    onChange={(event) => {
                                        const maquina = event.target.value
                                        setMaquina(maquina);                             
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar:</em>
                                    </MenuItem>
                                    {codmaquinas.map((maquina, index) => (
                                        <MenuItem key={index} value={maquina.cod_maquina}>
                                            {maquina.cod_maquina}
                                        </MenuItem>
                                    ))
                                    }
                                </TextField>
                            </Grid>

                            {/* Maquina Proceso */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Proc Maquina"
                                    variant="outlined"
                                    select
                                    value={MaquinaProceso}
                                    onChange={(event) => {
                                        const maquinaproc = event.target.value
                                        setMaquinaProceso(maquinaproc);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar:</em>
                                    </MenuItem>
                                    {maquinasprocfil.map((maquina, index) => (
                                        <MenuItem key={index} value={maquina.proceso}>
                                            {maquina.proceso}
                                        </MenuItem>
                                    ))
                                    }
                                </TextField>
                            </Grid>

                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} >
                        {(Proceso !== 'MANTENIMIENTO' && Proceso !== 'LIMPIEZA') && (
                            <>
                            {/* Articulo*/}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Articulo"
                                    variant="outlined"
                                    value={Articulo}
                                    onChange={(event) => {
                                        setArticulo(event.target.value);
                                    }}
                                >
                                </TextField>
                            </Grid>

                            {/* Metros */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    label="Metros"
                                    variant='outlined'
                                    type='number'
                                    value={Metros}
                                    onChange={(event)=> {
                                        const metros = event.target.value
                                        setMetros(metros);
                                    }}
                                />
                            </Grid>

                            {/* Horas Total */}
                            <Grid xs={12} sm={3} md={3} padding={0.5}>
                                <TextField
                                    fullWidth
                                    type='number'
                                    variant='outlined'
                                    label='Horas Total'
                                    value={HorasT}
                                    onChange={(event) =>{
                                        const horas = event.target.value
                                        setHoraT(horas)
                                    }}
                                />
                            </Grid>

                            {/* Proceso */}
                            <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Proceso"
                                    variant="outlined"
                                    value={Proceso}
                                    select
                                    onChange={(event) => {
                                        setProceso(event.target.value);
                                        setColor("");
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar:</em>
                                    </MenuItem>
                                    {procesosfil.map((proceso, index) => (
                                        <MenuItem key={index} value={proceso.proceso}>
                                            {proceso.proceso}
                                        </MenuItem>
                                    ))
                                    }
                                </TextField>
                            </Grid>

                            {/* Selección de color si el proceso es "COLOR" */}
                            {Proceso === "LINEA COLOR" && (
                                <Grid item xs={12} sm={3} md={3} padding={0.5} >
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Color"
                                        variant="outlined"
                                        value={Color}
                                        select
                                        onChange={(event) => setColor(event.target.value)}
                                        required
                                    >
                                        {colores.map((color, index) => (
                                            <MenuItem key={index} value={color}>
                                                {color}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
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

                            {/* BOTON LIMPIAR */}
                            <Grid item xs={3} sm={3} md={4} justifyContent="flex-end" alignItems="flex-end">
                                <Button 
                                    variant='contained' 
                                    style={{ color: 'white'}}
                                    onClick={vaciarForm}
                                >
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Limpiar
                                    </Typography>
                                </Button>
                            </Grid>
                            {/* BOTON MODIFICAR */}
                            <Grid item xs={3} sm={3} md={6} justifyContent="flex-end" alignItems="flex-end">
                                <Button variant="contained" style={{ color: 'white' }}
                                    onClick={() => {
                                        let Aux = {
                                            IdOrden: IdOrdenPcp,
                                            Orden: Orden,
                                            Maquina: Maquina,
                                            MaquinaProc: MaquinaProceso,
                                            Proceso: Proceso,
                                            Color: Color,
                                            Articulo: Articulo,
                                            Metros: Metros,
                                            HorasT: HorasT,
                                            InicioHora: InicioHora,
                                            FinHora: FinHora
                                        }

                                        handleButton(Aux)
                                    }}>
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Modificar Datos
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
                    Datos actualizados con éxito!
                </DialogTitle>
            </Dialog>

            <Dialog open={openError} PaperProps={{ style: { backgroundColor: 'transparent', padding: '0', borderRadius: '12px' } }}>
                <DialogTitle sx={{ alignSelf: 'center', paddingBottom: 3, backgroundColor: '#e00000', color: 'white', fontFamily: 'Poppins', fontWeight: '600', borderRadius: '12px' }}>
                    <CancelIcon sx={{ position: 'relative', top: '3px', mr: 1 }} />
                    No se pudo realizar la carga
                </DialogTitle>
            </Dialog>
            {/* FIN -- Mensajes popup */}

             {/* Mostrar el alert según el valor de alert */}
             {alertt === 1 && (
                
                            <Alert
                                variant='filled'
                                severity="success"
                                onClose={() => setAlert(null)}
                                sx={{
                                    position: 'fixed',
                                    bottom: 20,
                                    left: 20,
                                    width: 'auto',
                                    zIndex: 9999,
                                }}
                            >
                                Orden eliminada correctamente.
                            </Alert>
                        )}
                        {alertt === 2 && (
                            <Alert
                                variant='filled'
                                severity="error"
                                onClose={() => setAlert(null)}
                                sx={{
                                    position: 'fixed',
                                    bottom: 20,
                                    left: 20,
                                    width: 'auto',
                                    zIndex: 9999,
                                }}
                            >
                                Error al eliminar la Orden.
                            </Alert>
                        )}
        </>
    )
}

export default FormularioGantPcp;