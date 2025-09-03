import { useEffect, useState, React } from 'react';
import { Card, MenuItem, TextField, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { PutRegistroGantFV, GetTABLAMAQUINAS, GetTABLAPROCESOS, GetTABLACODMAQUINAS } from '../API/APIFunctions'
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import axios from 'axios';
import DataGridTable from '../../../../../components/DataGrid/DataGridTable';
import '../assets/DualListBoxCustom.css';
import { set } from 'date-fns';
import MyDocument from './DocPedidoRollo';
import { getRollosEnProduccionXArt, getStockRollosXArt, putEnviarRollosAProduccion } from '../../../API/APIFunctions';
import { getNumeroOrdenes, GetDatosGantFV } from '../API/APIFunctions';

function FormularioGantPcp() {
    dayjs.extend(duration);
    dayjs.extend(customParseFormat);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [codmaquinas, setCodMaquinas] = useState([]);
    const [maquinasproc, setMaquinaProc] = useState([]);
    const [maquinasprocfil, setMaquinaProcFil] = useState([]);
    const [procesos, setProcesos] = useState([]);
    const [procesosfil, setProcesosFil] = useState([]);
    const [colores, setColores] = useState([]);
    const [habilitarSeleccionRollos, setHabilitarSeleccionRollos] = useState(false);
    const [habilitarTabla, setHabilitarTabla] = useState(false);
    const [InicioHora, setInicioHora] = useState(null);
    const [FinHora, setFinHora] = useState(null);
    const [errores, setErrores] = useState({});
    const [Orden, setOrden] = useState("");
    const [Maquina, setMaquina] = useState("");
    const [MaquinaProceso, setMaquinaProceso] = useState([]);
    const [Articulo, setArticulo] = useState("");
    const [Metros, setMetros] = useState("");
    const [Proceso, setProceso] = useState("");
    const [HorasT, setHoraT] = useState("");
    const [Color, setColor] = useState("");
    const [metrosRollo, setMetrosRollo] = useState(0);
    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [rollosDeArticulo, setRollosdeArticulo] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const maquinasGiroLento = ["GL1", "GL2", "GL3", "GL4", "GL5", "GL6", "GL7"];
    const [maquinasGiroLentoOcupadas, setMaquinasGiroLentoOcupadas] = useState([]);
    const [verificacionMensaje, setVerificacionMensaje] = useState("");
    const [openVerificacion, setOpenVerificacion] = useState(false);
    const [metrosCorrectos, setMetrosCorrectos] = useState(false);

    const columns = [
        { field: 'rollo', headerName: 'Rollo', width: 150 },
        { field: 'orden', headerName: 'Orden', width: 150 },
        { field: 'maquina', headerName: 'Maquina', width: 150 },
        { field: 'proceso', headerName: 'Proceso', width: 150 },
        { field: 'fecha_inicio', headerName: 'Inicio', width: 150, valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY HH:mm') },
        { field: 'fecha_fin', headerName: 'Fin', width: 150, valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY HH:mm') },
    ]
    const [rows, setRows] = useState([]);

    function handleprint() {
        if (selected.length === 0 && Maquina === '108') {
            setMensaje('Debes seleccionar al menos un rollo');
            toggleOpenErrorWithDelay();
            return;
        }

        const rollos = selected.map(item => item.split('-')[0]);
        const rollosSeleccionados = rollosDeArticulo.filter(rollo => rollos.includes(String(rollo.rollo)));

        const newWindow = window.open('', '_blank');
        const rootElement = newWindow.document.createElement('div');
        newWindow.document.body.appendChild(rootElement);
        const reactRoot = ReactDOM.createRoot(rootElement);
        reactRoot.render(
            <>
                <PDFViewer width="100%" height="600">
                    <MyDocument orden={Orden} maquina={Maquina} articulo={Articulo} rollos={rollosSeleccionados} />
                </PDFViewer>
            </>
        );

    }

    async function handleAsignar() {
        if (selected.length === 0 && Maquina === '108' && Proceso !== 'MANTENIMIENTO' && Proceso !== 'LIMPIEZA' && Orden !== 'MANTENIMIENTO' && Orden !== 'LIMPIEZA') {
            setMensaje('Debes seleccionar al menos un rollo');
            toggleOpenErrorWithDelay();
            return;
        }
        if (validar()) {
            let Aux = {
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
            await handleButton(Aux);
            const rollos_elegidos = selected.map(item => item.split('-')[0]);
            calcularHoraFin();
            let todosExitosos = true;
            for (const rollo of rollos_elegidos) {
                try {
                    let body = {
                        orden: Orden,
                        maquina: Maquina,
                        proceso: Proceso,
                        procesoMaquina: MaquinaProceso,
                        color: Color,
                        inicio: InicioHora.format('YYYY-MM-DD HH:mm'),
                        fin: FinHora.format('YYYY-MM-DD HH:mm'),
                        rollo: rollo
                    }
                    const respuesta = await putEnviarRollosAProduccion(body);

                    if (respuesta.status >= 200 && respuesta.status < 300) {
                        continue;
                    } else {
                        // Si hay un error en la respuesta (por ejemplo, un código de estado 4xx o 5xx)
                        todosExitosos = false; // Marcar que no todos son exitosos
                        break; // Salir del bucle ya que hay un error
                    }
                } catch (error) {
                    todosExitosos = false; // Marcar que no todos son exitosos
                    break; // Salir del bucle ya que hay un error en la consulta
                }
            }

            // Después del bucle, verificamos el estado de todosExitosos
            if (todosExitosos) {
                setMensaje('Todas las órdenes se registraron correctamente');
                toggleOpenDialogWithDelay();
                vaciarForm();
            } else {
                setMensaje('Error al asignar rollos');
                toggleOpenErrorWithDelay();
            }

        }
        else {
            setMensaje('Error en 1 o más campos');
            toggleOpenErrorWithDelay();
        }
    }



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
        setArticulo("");
        setColor("");
        setInicioHora(null);
        setFinHora(null);
        setHoraT("");
        setMetros("");
        setProceso("");
        setSelected([]);
    };
    useEffect(() => {
        if (selected.length > 0) {
            // Extraemos el 'value' de cada objeto en selected (si selected contiene objetos)
            const metrosSeleccionados = selected.map(item => {
                const value = item.value || item; // Si 'selected' son objetos, obtenemos el 'value', sino usamos el propio 'item'
                const [, metros] = value.split('-'); // Separamos por '-' y obtenemos los Metros
                return parseInt(metros); // Convertimos a número
            });

            // Sumamos los metros seleccionados
            const sumaMetros = metrosSeleccionados.reduce((a, b) => a + b, 0);

            // Actualizamos el estado con la suma
            setMetrosRollo(sumaMetros);
        }
        else {
            setMetrosRollo(0);
        }
    }, [selected]);



    const validar = () => {
        let tempErrores = {};
        if (!Maquina) tempErrores.Maquina = "Este campo es obligatorio.";
        if (!Proceso) tempErrores.Proceso = "Este campo es obligatorio.";
        if (!InicioHora) tempErrores.InicioHora = "Este campo es obligatorio.";
        if (!FinHora) tempErrores.FinHora = "Este campo es obligatorio";
        if (!Orden) tempErrores.Orden = "Este campo es obligatorio";
        // if (!MaquinaProceso) tempErrores.MaquinaProceso = "Este campo es obligatorio";
        // if (!Articulo) tempErrores.Articulo = "Este campo es obligatorio";
        // if (!Metros) tempErrores.Metros = "Este campo es obligatorio";
        setErrores(tempErrores);
        return Object.keys(tempErrores).length === 0;
    };

    /* --- INICIO TABLA MAQUINAS --- */
    useEffect(() => {
        const CargaMaquinas = async () => {
            try {
                const response = await GetTABLAMAQUINAS();
                console.log("Respuesta de GetTABLAMAQUINAS:", response);
                if (response && response.Dato && Array.isArray(response.Dato[0])) {
                    setMaquinaProc(response.Dato[0]);
                } else {
                    console.error("La respuesta no tiene el formato esperado:", response);
                }
            } catch (error) {
                console.error("Error al obtener las maquinas:", error);
                setMensaje("Error al obtener las maquinas");
                toggleOpenErrorWithDelay();
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
                console.log("Respuesta de GetTABLACODMAQUINAS:", response);
                if (response && response.Dato && Array.isArray(response.Dato[0])) {
                    setCodMaquinas(response.Dato[0]);
                } else {
                    console.error("La respuesta no tiene el formato esperado:", response);
                }
            } catch (error) {
                console.error("Error al obtener los codigos de maquinas:", error);
                setMensaje("Error al obtener los codigos de maquinas:");
                toggleOpenErrorWithDelay();
            }
        }
        CargaCodMaquinas();
    }, []);
    /* --- FIN TABLA COD MAQUINAS */

    useEffect(() => {
        fetchRollosEnProduccion();
        fetchStockRollos();
        return () => {
        }
    }, [Articulo]);

    /* --- INICIO TABLA PROCESOS --- */
    useEffect(() => {
        const CargaProcesos = async () => {
            try {
                const response = await GetTABLAPROCESOS();
                console.log("Respuesta de GetTABLAPROCESOS:", response);
                if (response && response.Dato && Array.isArray(response.Dato[0])) {
                    const lineaColor = response.Dato[0].find(p => p.proceso === 'LINEA COLOR');
                    const colores = lineaColor ? lineaColor.color.split(',') : [];
                    setColores(colores);
                    setProcesos(response.Dato[0]);
                } else {
                    console.error("La respuesta no tiene el formato esperado:", response);
                }
            } catch (error) {
                console.error("Error al obtener los procesos:", error);
                setMensaje("Error al obtener los procesos");
                toggleOpenErrorWithDelay();
            }
        }
        CargaProcesos();
    }, []);
    /* --- FIN TABLA PROCESOS --- */

    useEffect(() => {
        if (Maquina) {
            console.log("Máquina seleccionada:", Maquina);
            filterProcMaq(Maquina);
            filterProc();
        }
    }, [Maquina]);

    const obtenerVelocidadMaquina = (nombreProcesoMaquina) => {
        const maquinaproc = maquinasproc.find(m => m.proceso === nombreProcesoMaquina);
        return maquinaproc ? maquinaproc.velocidad : 1; // Default velocidad a 1 si no se encuentra
    };

    const filterProcMaq = (CodMaquina) => {
        console.log("Filtrando procesos de máquina para:", CodMaquina);
        console.log("Datos disponibles en maquinasproc:", maquinasproc);
        const procesomaq = maquinasproc.filter(m => m.cod_maquina === CodMaquina);
        console.log("Procesos filtrados:", procesomaq);
        setMaquinaProcFil(procesomaq);
    }

    const filterProc = () => {
        console.log("Filtrando procesos para máquina:", Maquina);
        console.log("Datos disponibles en procesos:", procesos);
        if (Maquina === "108" || Maquina === "GIRO LENTO") {
            const procesosFiltrados = procesos.filter(proceso => proceso.proceso !== "LINEA COLOR");
            console.log("Procesos filtrados:", procesosFiltrados);
            setProcesosFil(procesosFiltrados);
        } else {
            console.log("Usando todos los procesos");
            setProcesosFil(procesos);
        }
    };

    useEffect(() => {
        calcularHoraFin();
    }, [InicioHora, HorasT]);

    async function fetchRollosEnProduccion() {
        try {
            let respuesta = await getRollosEnProduccionXArt(Articulo);
            if (respuesta.data[0]) {
                setRows(respuesta.data[0]);
            }
        } catch (error) {
            setMensaje('Error en fetchRollosEnProduccion');
        }
    }

    const fetchStockRollos = async () => {
        try {
            let response = await getStockRollosXArt(Articulo);
            let formattedOptions = [];
            if (Array.isArray(response.data) && response.data.length > 0) {
                setRollosdeArticulo(response.data);
                formattedOptions = response.data.map(item => ({
                    value: item.rollo + `-` + parseInt(item.largo),
                    label: `${item.rollo} ${item.orden_lr} (${item.secuencia_lr}) - ${item.largo} m`,
                }));
            }

            setOptions(formattedOptions);
        } catch (error) {
            console.error('Error fetching stock rollos:', error);
            setOptions([]); // Resetea las opciones en caso de error
        }
    };


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

    //INICIO - BOTON REGISTRAR
    const handleButton = async (datos) => {
        try {
            let DatosGant = {
                Orden: datos.Orden,
                Maquina: datos.Maquina,
                MaquinaProc: datos.MaquinaProc,
                Proceso: datos.Proceso,
                Color: datos.Color,
                Articulo: datos.Articulo,
                Metros: datos.Metros,
                HorasT: datos.HorasT,
                InicioHora: datos.InicioHora.format('YYYY/MM/DD HH:mm'),
                FinHora: datos.FinHora.format('YYYY/MM/DD HH:mm'),
                Rollos: selected.map(item => item.split('-')[0])
            };

            let respuesta = await PutRegistroGantFV(DatosGant)
            console.warn('Respuesta de PutRegistroGantFV:', respuesta);
            // if (respuesta.serverStatus === 34) {
            if (respuesta?.affectedRows > 0 && respuesta?.serverStatus >= 2) {
                setMensaje('Orden registrada correctamente');
                toggleOpenDialogWithDelay();
            } else {
                console.error('La orden no se registró correctamente. Respuesta inesperada:', respuesta);
                setMensaje('Error al registar la ordenNNNN');
                toggleOpenErrorWithDelay();
            }
        } catch (error) {
            console.error('Error al enviar datos a BBDD:', error);
            setMensaje('Error al enviar datos a BBDD');
            toggleOpenErrorWithDelay();
        }
    };

    // Logs de depuración antes del return principal
    console.log('Orden:', Orden);
    console.log('Maquina:', Maquina);
    console.log('Articulo:', Articulo);
    console.log('codmaquinas:', codmaquinas);
    console.log('maquinasprocfil:', maquinasprocfil);
    console.log('procesosfil:', procesosfil);
    console.log('colores:', colores);
    console.log('options (rollos):', options);
    console.log('selected (rollos seleccionados):', selected);

    const filtrarMaquinasGiroLentoDisponibles = () => {
        if (!InicioHora || !HorasT) return;

        const fechaInicio = dayjs(InicioHora);
        const fechaFin = fechaInicio.add(Number(HorasT), 'hour');

        const ocupadas = rows
            .filter(row => {
                if (!row.InicioHora || !row.FinHora) return false;

                const inicioRow = dayjs(row.InicioHora);
                const finRow = dayjs(row.FinHora);

                return maquinasGiroLento.includes(row.MaquinaProc) &&
                    fechaInicio.isBefore(finRow) &&
                    fechaFin.isAfter(inicioRow);
            })
            .map(row => row.MaquinaProc);

        setMaquinasGiroLentoOcupadas(ocupadas);
    };


    useEffect(() => {
        if (Maquina === "GIRO LENTO") {
            filtrarMaquinasGiroLentoDisponibles();
        } else {
            setMaquinasGiroLentoOcupadas([]);
        }
    }, [InicioHora, HorasT, rows, Maquina]);
    useEffect(() => {
        console.log("Máquinas ocupadas:", maquinasGiroLentoOcupadas);
    }, [maquinasGiroLentoOcupadas]);


    const verificarOrden = async () => {
        if (!Orden) {
            setVerificacionMensaje("Debes ingresar un numero de orden");
            setOpenVerificacion(true);
            setMetrosCorrectos(false);
            return;
        }
        if (!Metros) {
            setVerificacionMensaje("Debes ingresar los metros para verificar");
            setOpenVerificacion(true);
            setMetrosCorrectos(false);
            return;
        }

        try {
            const response = await getNumeroOrdenes(Orden);
            const lista = Array.isArray(response?.data) ? response.data : [];

            const gantResponse = await GetDatosGantFV();
            const datosPlanos = gantResponse?.Dato?.flat() ?? [];

            if (response?.success && lista.length > 0) {
                const metrosIngresados = parseInt(Metros, 10);
                const listaConMaquinas = lista.map(item => {
                    const dato = datosPlanos.find(d => d.id === item.id_orden);
                    return {
                        ...item,
                        maquina: dato?.maquina ?? "No asignada"
                    };
                });

                const coincide = listaConMaquinas.some(x => parseInt(x.metros_totales, 10) === metrosIngresados);

                if (coincide) {
                    setMetrosCorrectos(true);
                    const registroCorrecto = listaConMaquinas.find(x => parseInt(x.metros_totales, 10) === metrosIngresados);
                    setVerificacionMensaje(
                    <><Typography variant="body1" sx={{ color: 'green' }}>
                            <b>Datos correctos.</b>
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1, mb: 2, mt: 1, borderBottom: '1px solid #ddd' }}>
                            🟢Orden: <b>{registroCorrecto.numero_orden}</b>, Maquina: <b>{registroCorrecto.maquina}</b>
                        </Typography></>
                );
                } else {
                    setMetrosCorrectos(false);
                    setVerificacionMensaje(
                        <><Typography variant="body1" sx={{ color: 'red' }}>
                            <b>Los metros ingresados no coinciden.</b>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontSize: 20, borderBottom: '1px solid #ddd' }}>
                            Valores correctos posibles:
                        </Typography>
                            {listaConMaquinas.map((x, index) => (
                                <Typography key={index} variant="body1" sx={{ ml: 1, mb: 2, mt: 1, borderBottom: '1px solid #ddd' }}>
                                    🟢Orden: <b>{x.numero_orden}</b>, Maquina: <b>{x.maquina}</b>, Metros: <b>{parseInt(x.metros_totales, 10)}</b>
                                </Typography>
                            ))}
                        </>
                    );
                }
            } else {
                setMetrosCorrectos(false);
                setVerificacionMensaje(
                    <Typography variant="body1" sx={{ color: 'red' }}>
                        <b>No se encontró ninguna orden con ese número.</b>
                    </Typography>
                );
            }
            setOpenVerificacion(true);
        } catch (error) {
            setMetrosCorrectos(false);
            setOpenVerificacion(true);
        }
    };

    return (
        <>
            {/* contenedor principal */}
            <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >

                {/* GRID FORM */}
                <Grid item xs={7} sm={7} md={7} padding={1}>
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

                            {/* Orden */}
                            <Grid item xs={12} sm={2} md={2} padding={0.5} >
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Orden"
                                    variant="outlined"
                                    value={Orden}
                                    onChange={(event) => {
                                        const orden = event.target.value;
                                        setOrden(orden);

                                    }}
                                    required
                                    error={!!errores.Orden}
                                    helperText={errores.Orden}
                                >
                                </TextField>
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
                                        if (maquina === "GIRO LENTO") {
                                            setHoraT(12)

                                        } else {
                                            setHoraT(null)
                                        };
                                        setMaquinaProceso("");
                                        setProceso("");
                                    }}
                                    required
                                    error={!!errores.Maquina}
                                    helperText={errores.Maquina}
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
                                        const maquinaproc = event.target.value;
                                        setMaquinaProceso(maquinaproc);
                                    }}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar:</em>
                                    </MenuItem>
                                    {Maquina === "GIRO LENTO"
                                        ? maquinasGiroLento.map((gl) => (
                                            <MenuItem
                                                key={gl}
                                                value={gl}
                                                disabled={maquinasGiroLentoOcupadas.includes(gl)}
                                            >
                                                {gl} {maquinasGiroLentoOcupadas.includes(gl) ? "(Ocupada)" : ""}
                                            </MenuItem>
                                        ))
                                        : maquinasprocfil.map((maquina) => (
                                            <MenuItem key={maquina.proceso} value={maquina.proceso}>
                                                {maquina.proceso}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
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
                                    required
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
                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} marginTop={'10px'}>
                            {(Proceso !== 'MANTENIMIENTO' && Proceso !== 'LIMPIEZA') && (
                                <>
                                    {/* Articulo*/}
                                    <Grid item xs={12} sm={4} md={4} padding={0.5} >
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

                                                if (Maquina !== "GIRO LENTO") {
                                                    const velocidad = obtenerVelocidadMaquina(MaquinaProceso);
                                                    const horasTotal = metros / (velocidad * 60);
                                                    setHoraT(horasTotal.toFixed(0));
                                                    // let finHoraCalculada = addHours(InicioHora, parseFloat(horasTotal.toFixed(0)));
                                                    // console.log("hora fin: ", finHoraCalculada);

                                                    // setFinHora(finHoraCalculada);

                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Horas Total */}
                                    <Grid xs={12} sm={4} md={4} padding={0.5}>
                                        <TextField
                                            fullWidth
                                            focused
                                            readOnly
                                            variant='filled'
                                            label='Horas Total'
                                            value={HorasT}
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
                        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" padding={2} gap={1}>
                            <Grid item>
                                <Button variant="contained" style={{ color: 'white' }}
                                    onClick={() => {
                                        let Aux = {

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
                                        handleAsignar();
                                    }}>
                                    <Typography variant="button" fontFamily="Poppins" fontSize={18}>
                                        Registrar Orden
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" onClick={verificarOrden} sx={{ mt: 0 }}>
                                    Verificar Orden
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={5} sm={5} md={5} padding={1}>
                    <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >
                        <Grid item xs={6} sm={6} md={6} padding={1}>
                            <Typography variant="h6" fontFamily="Poppins" fontSize={18}>
                                Rollos Disponibles
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} padding={1}>
                            <Typography variant="h6" fontFamily="Poppins" fontSize={18}>
                                Rollos Seleccionados
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >
                        <Grid item xs={12} sm={12} md={12} padding={1}>
                            <div className="custom-dual-listbox">
                                <DualListBox
                                    options={options}
                                    selected={selected}
                                    alignActions="top"
                                    onChange={(newValue) => {
                                        setSelected(newValue)
                                    }}
                                />

                            </div>
                            <Grid item xs={12} sm={12} md={12} padding={1} alignItems="flex-end">
                                <Typography variant="h6" fontFamily="Poppins" fontSize={18}>
                                    Metros Necesarios: {`${Metros} m`}
                                </Typography>
                                <Typography variant="h6" fontFamily="Poppins" fontSize={18} >
                                    Metros Seleccionados: {`${metrosRollo} m`}
                                </Typography>
                                <Button onClick={handleprint}>
                                    imprimir
                                </Button>

                                {/* Popp up Verificar datos de orden */}
                                <Dialog open={openVerificacion} onClose={() => setOpenVerificacion(false)}
                                    PaperProps={{ style: { padding: '20px', borderRadius: '12px', minWidth: '300px' } }}
                                >
                                    <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #ddd', ml: 0, pb: 0, mb: 1, }}>
                                        Verificacion de Ordenes
                                    </DialogTitle>
                                    <DialogContent sx={{ p: 0 }}>
                                        <Typography variant="body1" textAlign={'center'}>
                                            {verificacionMensaje}
                                        </Typography>
                                    </DialogContent>

                                    <Button variant="contained" style={{ color: 'white' }}
                                        disabled={!metrosCorrectos}
                                        onClick={() => {
                                            let Aux = {

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
                                            handleAsignar();
                                            setOpenVerificacion(false);
                                        }}>
                                        <Typography variant="button" fontFamily="Poppins" fontSize={15}>
                                            Registrar Orden
                                        </Typography>
                                    </Button>

                                    <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setOpenVerificacion(false)}>
                                        Cerrar
                                    </Button>
                                </Dialog>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
            <DataGridTable rows={rows} columns={columns} />
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

export default FormularioGantPcp;