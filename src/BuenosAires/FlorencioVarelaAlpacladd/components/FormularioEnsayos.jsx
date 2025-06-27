import { Grid, Typography, Card, Modal, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Dialog, DialogTitle } from "@mui/material";
import RenglonForm from './RenglonForm'
import RenglonFormTriple from "./RenglonFormTriple";
import RenglonFormSigno from './RenglonFormSigno';
import RenglonFormPasadas from './RenglonFormPasadas';
import { useState, useEffect } from "react";
import { getDatosEnsayo, getEspecificacionArticulos, getResultadosPosiblesEnsayos, getRutinasLaboratorio, putCambiarEtapaEnsayo, PutEnsayoDeRutina, putFinalizarEnsayo } from "../API/APIFunctions";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { useAuth } from '../../../AuthContext';
import MensajeDialog from '../../../components/Plantilla/MensajeDialog';
import { useParams } from 'react-router-dom';

function FormularioEnsayos({ rutina, handleTabChange }) {
    const [anchoSinLavar1, setAnchoSinLavar1] = useState(null);
    const [anchoSinLavar2, setAnchoSinLavar2] = useState(null);
    const [anchoSinLavarCalculo, setAnchoSinLavarCalculo] = useState(null);
    const [pesoSinLavar1, setPesoSinLavar1] = useState(null);
    const [pesoSinLavar2, setPesoSinLavar2] = useState(null);
    const [pesoSinLavarCalculo, setPesoSinLavarCalculo] = useState(null);
    const [pesoLavado1, setPesoLavado1] = useState(null);
    const [pesoLavado2, setPesoLavado2] = useState(null);
    const [pesoLavadoCalculo, setPesoLavadoCalculo] = useState(null);
    const [recuentoUrdido1, setRecuentoUrdido1] = useState(null);
    const [recuentoUrdido2, setRecuentoUrdido2] = useState(null);
    const [recuentoUrdidoCalculo, setRecuentoUrdidoCalculo] = useState(null);
    const [recuentoTrama1, setRecuentoTrama1] = useState(null);
    const [recuentoTrama2, setRecuentoTrama2] = useState(null);
    const [recuentoTramaCalculo, setRecuentoTramaCalculo] = useState(null);
    const [pasadasPorCosto1, setPasadasPorCosto1] = useState(null);
    const [pasadasPorCosto2, setPasadasPorCosto2] = useState(null);
    const [pasadasporCostoCalculo, setPasadasPorCostoCalculo] = useState(null);
    const [estabilidadUrdido1, setEstabilidadUrdido1] = useState(null);
    const [estabilidadUrdido2, setEstabilidadUrdido2] = useState(null);
    const [estabilidadUrdido3, setEstabilidadUrdido3] = useState(null);
    const [estabilidadUrdidoCalculo, setEstabilidadUrdidoCalculo] = useState(null);
    const [estabilidadTrama1, setEstabilidadTrama1] = useState(null);
    const [estabilidadTrama2, setEstabilidadTrama2] = useState(null);
    const [estabilidadTrama3, setEstabilidadTrama3] = useState(null);
    const [estabilidadTramaCalculo, setEstabilidadTramaCalculo] = useState(null);
    const [predistorsionIzq, setPredistorsionIzq] = useState(null);
    const [predistorsionIzqCalculo, setPredistorsionIzqCalculo] = useState(null);
    const [predistorsionIzqSigno, setPredistorsionIzqSigno] = useState(null);
    const [predistorsionDer, setPredistorsionDer] = useState(null);
    const [predistorsionDerSigno, setPredistorsionDerSigno] = useState(null);
    const [predistorsionDerCalculo, setPredistorsionDerCalculo] = useState(null);
    const [movimientoIzq, setMovimientoIzq] = useState(null);
    const [movimientoIzqCalculo, setMovimientoIzqCalculo] = useState(null);
    const [movimientoIzqSigno, setMovimientoIzqSigno] = useState(null);
    const [movimientoDer, setMovimientoDer] = useState(null);
    const [movimientoDerSigno, setMovimientoDerSigno] = useState(null);
    const [movimientoDerCalculo, setMovimientoDerCalculo] = useState("");
    const [anchoLavadoCalculo, setAnchoLavadoCalculo] = useState(null);
    const [recuentoPasadasLavada, setRecuentoPasadasLavada] = useState(null);
    const [elasticidadLavada1, setElasticidadLavada1] = useState(null);
    const [elasticidadLavada2, setElasticidadLavada2] = useState(null);
    const [elasticidadLavadaCalculo, setElasticidadLavadaCalculo] = useState(null);
    const [elasticidadSinLavar1, setElasticidadSinLavar1] = useState(null);
    const [elasticidadSinLavar2, setElasticidadSinLavar2] = useState(null);
    const [elasticidadSinLavarCalculo, setElasticidadSinLavarCalculo] = useState(null);
    const [deformacionLavada1, setDeformacionLavada1] = useState(null);
    const [deformacionLavada2, setDeformacionLavada2] = useState(null);
    const [deformacionLavadaCalculo, setDeformacionLavadaCalculo] = useState(null);
    const [elmendorfTramaSinLavar1, setElmendorfTramaSinLavar1] = useState(null);
    const [elmendorfTramaSinLavar2, setElmendorfTramaSinLavar2] = useState(null);
    const [elmendorfTramaSinLavarCalculo, setElmendorfTramaSinLavarCalculo] = useState(null);
    const [elmendorfUrdidoSinLavar1, setElmendorfUrdidoSinLavar1] = useState(null);
    const [elmendorfUrdidoSinLavar2, setElmendorfUrdidoSinLavar2] = useState(null);
    const [elmendorfUrdidoSinLavarCalculo, setElmendorfUrdidoSinLavarCalculo] = useState(null);
    const [deslizCosturaUT1, setDeslizCosturaUT1] = useState(null);
    const [deslizCosturaUT2, setDeslizCosturaUT2] = useState(null);
    const [deslizCosturaUTCalculo, setDeslizCosturaUTCalculo] = useState(null);
    const [deslizCosturaTU1, setDeslizCosturaTU1] = useState(null);
    const [deslizCosturaTU2, setDeslizCosturaTU2] = useState(null);
    const [deslizCosturaTUCalculo, setDeslizCosturaTUCalculo] = useState(null);
    const [rigidez1, setRigidez1] = useState(null);
    const [rigidez2, setRigidez2] = useState(null);
    const [rigidezCalculo, setRigidezCalculo] = useState(null);

    const [articulo, setArticulo] = useState("");
    const [subLote, setSubLote] = useState("");
    const [lote, setLote] = useState("");
    const [metros, setMetros] = useState(null);
    const [letra, setLetra] = useState('');
    const [etapa, setEtapa] = useState('');
    const [motivo, setMotivo] = useState('');
    const [nuevaEtapa, setNuevaEtapa] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [steps, setSteps] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [open, setOpen] = useState(false);
    const [resultadoEnsayo, setResultadoEnsayo] = useState('');
    const [resultadosPosibles, setResultadosPosibles] = useState([]);
    const [observaciones, setObservaciones] = useState('');
    const [especificacionArticulo, setEspecificacionarticulo] = useState("");
    const [referencias, setReferencias] = useState({});
    const [errors, setErrors] = useState({});
    const [dibujo, setDibujo] = useState('');
    const [resultadoRutinaTerminada, setResultadoRutinaTerminada] = useState('');

    // const { auth } = useAuth();
    const [auth, setAuth] = useState(() => {
        const saved = localStorage.getItem('auth');
        return saved ? JSON.parse(saved) : null;
    });

    const [tipo, setTipo] = useState('success');
    const [isOpen, setIsOpen] = useState(false);

    const { rutinaId } = useParams(); // trae desde la URL
    useEffect(() => {
        const rutinaFinal = rutinaId || rutina; // usa la prop o el valor de la URL
        if (rutinaFinal) {
            getDataRutina(rutinaFinal);
        }
    }, [rutinaId, rutina]);

    useEffect(() => {
        if (rutinaId) {
            document.title = `Rutina ${rutinaId}`;
        } else {
            document.title = 'Rutina';
        }
    }, [rutinaId]);

    const etapas = [
        {
            "orden": 1,
            "etapa": "Registro"
        },
        {
            "orden": 2,
            "etapa": "Entrada"
        },
        {
            "orden": 3,
            "etapa": "Ingreso"
        },
        {
            "orden": 4,
            "etapa": "Marcado"
        },
        {
            "orden": 5,
            "etapa": "Lavado"
        },
        {
            "orden": 6,
            "etapa": "Reposo"
        },
        {
            "orden": 7,
            "etapa": "Medicion"
        },
        {
            "orden": 8,
            "etapa": "Finalizado"
        }
    ]
    let dataRaw;

    const validarEspecificacion = () => {
        const hasErrors = Object.values(errors).some(error => error === true);
        return hasErrors;
    };
    const EstiloModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleGuardarResultado = async () => {

        if (auth.rol !== 'Administrador' && (resultadoEnsayo !== 'CONFORME' && resultadoEnsayo !== 'VER')) {
            setMensaje("No tienes permisos para realizar esta acción");
            setTipo("error");
            setIsOpen(true);
            return;
        }

        if (auth.rol !== 'Administrador' && (validarEspecificacion() && resultadoEnsayo !== 'VER')) {
            setMensaje("No puedes finalizar la rutina. Hay errores en uno o más campos.");
            setTipo("error");
            setIsOpen(true);
            return;
        }

        let body = {
            rutina: rutina,
            resultado: resultadoEnsayo,
            observaciones: observaciones,
            responsable: auth?.rol
        };

        try {
            let respuesta = await putFinalizarEnsayo(body);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                try {
                    await handleCambioDeEtapa("Finalizado");
                    await getDataRutina(rutina);
                } catch (error) {
                    setMensaje("Error al finalizar etapa");
                    setTipo("error");
                    setIsOpen(true);
                }
                setMensaje(`Rutina ${rutina} finalizada con éxito`);
                setTipo("success");
                setIsOpen(true);
            } else {
                setMensaje("Conexión realizada pero con posibles problemas: ", respuesta);
                setTipo("error");
                setIsOpen(true);
            }
        } catch (error) {
            setMensaje(error)
            setTipo("error");
            setIsOpen(true);
        }
        handleClose();
    };

    async function getDataRutina(rutina) {

        try {

            const respuesta = await getRutinasLaboratorio(rutina);
            if (respuesta.data.length === 0) {
                setMensaje(`No se encontró la especificación de la ${rutina}`);
                setTipo("error");
                setIsOpen(true);
                return;
            }
            dataRaw = respuesta.data[0];
            setArticulo(dataRaw.articulo_final);
            setLote(dataRaw.lote);
            setMetros(dataRaw.metros);
            setLetra(dataRaw.letra);
            setEtapa(dataRaw.status);
            setMotivo(dataRaw.motivo);
            setSubLote(dataRaw.sublote);
            setResultadoRutinaTerminada(dataRaw.resultado)
            setResultadoEnsayo(dataRaw.resultado);
            setObservaciones(dataRaw.observaciones)
            setDibujo(dataRaw.dibujo)
            await fetchEspecificacion(dataRaw.articulo_final, dataRaw.motivo.toUpperCase());
        } catch (error) {
            setMensaje("Error: ", error);
            setTipo("error");
            setIsOpen(true);
        }
    }
    function getOrdenEtapas() {
        const stepLabels = etapas.map(step => step.etapa);
        setSteps(stepLabels);

        const initialStepIndex = stepLabels.indexOf(etapa);
        if (initialStepIndex !== -1) {
            setActiveStep(initialStepIndex);
        }
    }

    function setearDatos(datos) {
        if (datos.ancho_sin_lavar_1 !== null) setAnchoSinLavar1(datos.ancho_sin_lavar_1);
        if (datos.ancho_sin_lavar_2 !== null) setAnchoSinLavar2(datos.ancho_sin_lavar_2);
        if (datos.peso_sin_lavar_1 !== null) setPesoSinLavar1(datos.peso_sin_lavar_1);
        if (datos.peso_sin_lavar_2 !== null) setPesoSinLavar2(datos.peso_sin_lavar_2);
        if (datos.peso_lavado_1 !== null) setPesoLavado1(datos.peso_lavado_1);
        if (datos.peso_lavado_2 !== null) setPesoLavado2(datos.peso_lavado_2);
        if (datos.recuento_urdido_1 !== null) setRecuentoUrdido1(datos.recuento_urdido_1);
        if (datos.recuento_urdido_2 !== null) setRecuentoUrdido2(datos.recuento_urdido_2);
        if (datos.recuento_trama_1 !== null) setRecuentoTrama1(datos.recuento_trama_1);
        if (datos.recuento_trama_2 !== null) setRecuentoTrama2(datos.recuento_trama_2);
        if (datos.pasadas_por_costo_1 !== null) setPasadasPorCosto1(datos.pasadas_por_costo_1);
        if (datos.pasadas_por_costo_2 !== null) setPasadasPorCosto2(datos.pasadas_por_costo_2);
        if (datos.estabilidad_urdido_1 !== null) setEstabilidadUrdido1(datos.estabilidad_urdido_1);
        if (datos.estabilidad_urdido_2 !== null) setEstabilidadUrdido2(datos.estabilidad_urdido_2);
        if (datos.estabilidad_urdido_3 !== null) setEstabilidadUrdido3(datos.estabilidad_urdido_3);
        if (datos.estabilidad_trama_1 !== null) setEstabilidadTrama1(datos.estabilidad_trama_1);
        if (datos.estabilidad_trama_2 !== null) setEstabilidadTrama2(datos.estabilidad_trama_2);
        if (datos.estabilidad_trama_3 !== null) setEstabilidadTrama3(datos.estabilidad_trama_3);
        if (datos.predistorsion_izq !== null) {
            const signopredisizq = Math.sign(datos.predistorsion_izq);
            const abspredisizq = Math.abs(datos.predistorsion_izq);
            setPredistorsionIzq((abspredisizq * 0.6).toFixed(2));
            setPredistorsionIzqSigno(signopredisizq);
        }
        if (datos.predistorsion_der !== null) {
            const signopredisder = Math.sign(datos.predistorsion_der);
            const abspredisder = Math.abs(datos.predistorsion_der);
            setPredistorsionDer((abspredisder * 0.6).toFixed(2));
            setPredistorsionDerSigno(signopredisder);
        }
        if (datos.movimiento_izq !== null) {
            const signomoizq = Math.sign(datos.movimiento_izq);
            const absmovizq = Math.abs(datos.movimiento_izq);
            setMovimientoIzq((absmovizq * 0.6).toFixed(2));
            setMovimientoIzqSigno(signomoizq);
        }
        if (datos.movimiento_der !== null) {
            const signomoder = Math.sign(datos.movimiento_der);
            const absmovder = Math.abs(datos.movimiento_der);
            setMovimientoDer((absmovder * 0.6).toFixed(2));
            setMovimientoDerSigno(signomoder);
        }
        if (datos.ancho_lavado_calculo !== null) setAnchoLavadoCalculo(datos.ancho_lavado_cal);
        if (datos.recuento_pasadas_lavada !== null) setRecuentoPasadasLavada(datos.recuento_pasadas_lavada);
        if (datos.elasticidad_lavada_1 !== null) setElasticidadLavada1(datos.elasticidad_lavada_1);
        if (datos.elasticidad_lavada_2 !== null) setElasticidadLavada2(datos.elasticidad_lavada_2);
        if (datos.elasticidad_sin_lavar_1 !== null) setElasticidadSinLavar1(datos.elasticidad_sin_lavar_1);
        if (datos.elasticidad_sin_lavar_2 !== null) setElasticidadSinLavar2(datos.elasticidad_sin_lavar_2);
        if (datos.deformacion_lavada_1 !== null) setDeformacionLavada1(datos.deformacion_lavada_1);
        if (datos.deformacion_lavada_2 !== null) setDeformacionLavada2(datos.deformacion_lavada_2);
        if (datos.elmendorf_trama_sin_lavar_1 !== null) setElmendorfTramaSinLavar1(datos.elmendorf_trama_sin_lavar_1);
        if (datos.elmendorf_trama_sin_lavar_2 !== null) setElmendorfTramaSinLavar2(datos.elmendorf_trama_sin_lavar_2);
        if (datos.elmendorf_urdido_sin_lavar_1 !== null) setElmendorfUrdidoSinLavar1(datos.elmendorf_urdido_sin_lavar_1);
        if (datos.elmendorf_urdido_sin_lavar_2 !== null) setElmendorfUrdidoSinLavar2(datos.elmendorf_urdido_sin_lavar_2);
        if (datos.desliz_costura_ut_1 !== null) setDeslizCosturaUT1(datos.desliz_costura_ut_1);
        if (datos.desliz_costura_ut_2 !== null) setDeslizCosturaUT2(datos.desliz_costura_ut_2);
        if (datos.desliz_costura_tu_1 !== null) setDeslizCosturaTU1(datos.desliz_costura_tu_1);
        if (datos.desliz_costura_tu_2 !== null) setDeslizCosturaTU2(datos.desliz_costura_tu_2);
        if (datos.rigidez_1 !== null) setRigidez1(datos.rigidez_1);
        if (datos.rigidez_2 !== null) setRigidez2(datos.rigidez_2);
    }

    async function fetchDatosDeEnsayo(rutina) {
        try {
            let respuesta = await getDatosEnsayo(rutina);
            if (Array.isArray(respuesta.data) && respuesta.data.length > 0 && respuesta.data[0] !== null) {
                setearDatos(respuesta.data[0]);

                if (respuesta.data[0].dibujo !== null) {
                    setDibujo(respuesta.data[0].dibujo);
                    console.log("Dibujo cargado desde ensayo:", respuesta.data[0].dibujo);
                }
            }
            else {
                setMensaje(`No se encontraron ensayos registrados para la rutina ${rutina}`);
                setTipo("error");
                setIsOpen(true);
            }
        } catch (error) {
            setMensaje("error: " + error);
            setTipo("error");
            setIsOpen(true);
        }
    }


    async function handleCambioDeEtapa(etapa) {
        try {
            const usuarioResponsable = auth?.usuario || 'desconocido';
            let body = {
                rutina: rutina,
                etapa: etapa,
                usuario: usuarioResponsable
            };
            let respuesta = await putCambiarEtapaEnsayo(body);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                setMensaje("Estado de la rutina, cambiada con éxito");
                setTipo("success");
                setIsOpen(true);
            } else {
                setMensaje("Conexión realizada pero con posibles problemas: ", respuesta);
                setTipo("error");
                setIsOpen(true);
            }

        } catch (error) {
            setMensaje("error: " + error);
            setTipo("error");
            setIsOpen(true);
        }
    }

    async function fetchResultadosPosibles() {
        try {
            let respuesta = await getResultadosPosiblesEnsayos();
            let resultados = respuesta.data.map(resultado => resultado.resultado);
            setResultadosPosibles(resultados);

        }
        catch (error) {
            setMensaje("error: " + error);
            setTipo("error");
            setIsOpen(true);
        }
    }
    async function fetchEspecificacion(articuloFinal, motivo) {
        try {
            let respuesta = await getEspecificacionArticulos(articuloFinal, motivo);

            const referencias = {};

            // Verifica que 'especificacion' exista y sea un array antes de recorrerlo
            if (Array.isArray(respuesta.data?.especificacion)) {
                respuesta.data.especificacion.forEach(item => {
                    referencias[item.ESPEC_ENSAYO] = {
                        minRef: item.ESPEC_MIN,
                        maxRef: item.ESPEC_MAX,
                        ref: item.ESPEC_STD,
                        validar: item.ESPEC_VALIDA_STD,
                        esObligatorio: item.ESPEC_OBLIGATORIO
                    };
                });
            } else {
                setMensaje("La especificación no existe");
                setTipo("error");
                setIsOpen(true);
            }

            // Verifica que 'otraInformacion' exista y tenga al menos un elemento
            if (respuesta.data?.otraInformacion?.[0]) {
                setEspecificacionarticulo(respuesta.data.otraInformacion[0]);
            } else {
                console.warn("Otra información no está disponible.");
            }
            setReferencias(referencias);

        } catch (error) {
            setMensaje("Error al obtener la especificación:", error);
            setTipo("error");
            setIsOpen(true);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                await getDataRutina(rutina);
                await fetchDatosDeEnsayo(rutina);
                await fetchResultadosPosibles();
            } catch (error) {
                setMensaje(`Error al cargar los datos de la rutina ${rutina}`);
                setTipo("error");
                setIsOpen(true);
            }
        };
        fetchData();
        return () => {
        }
    }, [])

    useEffect(() => {
        getOrdenEtapas(etapa);
        return () => {
        }
    }, [etapa])


    async function guardarDatos() {
        try {
            let datos = {
                rutina: rutina,
                anchoSinLavar1: anchoSinLavar1,
                anchoSinLavar2: anchoSinLavar2,
                anchoSinLavarCalculo: anchoSinLavarCalculo,
                pesoSinLavar1: pesoSinLavar1,
                pesoSinLavar2: pesoSinLavar2,
                pesoSinLavarCalculo: pesoSinLavarCalculo,
                pesoLavado1: pesoLavado1,
                pesoLavado2: pesoLavado2,
                pesoLavadoCalculo: pesoLavadoCalculo,
                recuentoUrdido1: recuentoUrdido1,
                recuentoUrdido2: recuentoUrdido2,
                recuentoUrdidoCalculo: recuentoUrdidoCalculo,
                recuentoTrama1: recuentoTrama1,
                recuentoTrama2: recuentoTrama2,
                recuentoTramaCalculo: recuentoTramaCalculo,
                pasadasPorCosto1: pasadasPorCosto1,
                pasadasPorCosto2: pasadasPorCosto2,
                pasadasporCostoCalculo: pasadasporCostoCalculo,
                estabilidadUrdido1: estabilidadUrdido1,
                estabilidadUrdido2: estabilidadUrdido2,
                estabilidadUrdido3: estabilidadUrdido3,
                estabilidadUrdidoCalculo: estabilidadUrdidoCalculo,
                estabilidadTrama1: estabilidadTrama1,
                estabilidadTrama2: estabilidadTrama2,
                estabilidadTrama3: estabilidadTrama3,
                estabilidadTramaCalculo: estabilidadTramaCalculo,
                recuentoPasadasLavada: recuentoPasadasLavada,
                anchoLavadoCalculo: anchoLavadoCalculo,
                predistorsionIzq: predistorsionIzq,
                predistorsionIzqCalculo: predistorsionIzqCalculo,
                predistorsionDerCalculo: predistorsionDerCalculo,
                movimientoIzqCalculo: movimientoIzqCalculo,
                movimientoDerCalculo: movimientoDerCalculo,
                elasticidadSinLavar1: elasticidadSinLavar1,
                elasticidadSinLavar2: elasticidadSinLavar2,
                elasticidadSinLavarCalculo: elasticidadSinLavarCalculo,
                elasticidadLavada1: elasticidadLavada1,
                elasticidadLavada2: elasticidadLavada2,
                elasticidadLavadaCalculo: elasticidadLavadaCalculo,
                deformacionLavada1: deformacionLavada1,
                deformacionLavada2: deformacionLavada2,
                deformacionLavadaCalculo: deformacionLavadaCalculo,
                elmendorfUrdidoSinLavar1: elmendorfUrdidoSinLavar1,
                elmendorfUrdidoSinLavar2: elmendorfUrdidoSinLavar2,
                elmendorfUrdidoSinLavarCalculo: elmendorfUrdidoSinLavarCalculo,
                elmendorfTramaSinLavar1: elmendorfTramaSinLavar1,
                elmendorfTramaSinLavar2: elmendorfTramaSinLavar2,
                elmendorfTramaSinLavarCalculo: elmendorfTramaSinLavarCalculo,
                deslizCosturaUT1: deslizCosturaUT1,
                deslizCosturaUT2: deslizCosturaUT2,
                deslizCosturaUTCalculo: deslizCosturaUTCalculo,
                deslizCosturaTU1: deslizCosturaTU1,
                deslizCosturaTU2: deslizCosturaTU2,
                deslizCosturaTUCalculo: deslizCosturaTUCalculo,
                rigidez1: rigidez1,
                rigidez2: rigidez2,
                rigidezCalculo: rigidezCalculo,
                dibujo: dibujo
            };
            console.log("Datos enviados:", datos);

            let respuesta = await PutEnsayoDeRutina(datos);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                setMensaje("Datos guardados correctamente");
                setTipo("success");
                setIsOpen(true);
            } else {
                setMensaje("Conexión realizada pero con posibles problemas: ", respuesta);
                setTipo("error");
                setIsOpen(true);
            }
        } catch (error) {
            setMensaje(`Error al guardar los datos de la rutina ${rutina}`);
            setTipo("error");
            setIsOpen(true);
        }
    }

    const handleStep = async (step) => {
        try {
            const { rol } = auth || {}; // Desestructuración segura
            const currentStep = steps[step]; // Etapa seleccionada

            // Guardar datos siempre al inicio
            await guardarDatos();

            // Lógica para NO administrador
            if (rol !== 'Administrador') {
                if (etapa === "Finalizado") {
                    // Si no es administrador, puede guardar solo en la misma etapa
                    if (step === activeStep) {
                        setMensaje("Datos guardados correctamente en la etapa finalizada.");
                        setTipo("success");
                        setIsOpen(true);
                    } else {
                        // No puede cambiar la etapa desde "Finalizado"
                        setMensaje("No puedes cambiar el estado de una rutina finalizada!");
                        setTipo("error");
                        setIsOpen(true);
                    }
                    return; // Fin del flujo para no administradores
                }
            }

            // Lógica para Administrador
            setActiveStep(step);
            setNuevaEtapa(currentStep);
            setEtapa(currentStep);

            if (currentStep !== "Finalizado") {
                // Cambiar etapa normalmente si no es "Finalizado"
                handleCambioDeEtapa(currentStep);
            } else {
                // Si es "Finalizado", mostrar el modal
                handleOpen();
            }

        } catch (error) {
            // Manejo de errores
            console.error("Error in handleStep:", error);
            setMensaje("Error al guardar los datos o cambiar de etapa.");
            setTipo("error");
            setIsOpen(true);
        }
    };
    console.log("ROL:", auth?.rol);
    console.log("ETAPA:", etapa);
    console.log("RESULTADOS POSIBLES:", resultadosPosibles);
    console.log("RESULTADO:", resultadoEnsayo?.trim().toUpperCase());

    const resultadoNormalizado = resultadoEnsayo?.trim().toUpperCase();

    const permiteEditarCampos =
        auth?.rol === 'Administrador' ||
        (
            auth?.rol === 'Operador' &&
            etapa === 'Finalizado' &&
            (resultadoNormalizado === 'ANULADO' || resultadoNormalizado === 'TERCEROS ENSAYOS')
        ) ||
        etapa !== 'Finalizado';

    return (
        <>
            <Grid container direction="row" justifyContent="center" alignItems="center" p={1.5} rowSpacing={1.5} pt={1.5}>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: "5px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={1} pb={0.3} px={0.5}>
                            <Grid item xs={2}>
                                <Grid container direction="row">
                                    <Grid item xs={9}>
                                        <Typography paddingTop={1}>Rutina:
                                            <span style={{ fontWeight: 'bold' }}>
                                                {`${rutina}`}
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography>Letra: <span style={{ fontWeight: 'bold' }}>
                                    {` ${letra}`}
                                </span> </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>Metros: <span style={{ fontWeight: 'bold' }}>
                                    {` ${metros}`}
                                </span> </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>Etapa: <span style={{ fontWeight: 'bold' }}>
                                    {nuevaEtapa === "" ? (` ${etapa}`) : nuevaEtapa}
                                </span> </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>Artículo: <span style={{ fontWeight: 'bold' }}>
                                    {` ${articulo}`}
                                </span> </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>Lote: <span style={{ fontWeight: 'bold' }}>
                                    {` ${lote}`}
                                </span></Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>SubLote: <span style={{ fontWeight: 'bold' }}>
                                    {` ${subLote}`}
                                </span></Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography>Motivo: <span style={{ fontWeight: 'bold' }}>
                                    {` ${motivo}`}
                                </span> </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: "5px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={1} pb={0.3} px={0.5}>
                            <Grid item xs={2}>
                                <Typography>
                                    Especificación: <span style={{ fontWeight: 'bold' }}>
                                        {especificacionArticulo.PRODUCTO_ARTCOD || ""}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>
                                    Nombre: <span style={{ fontWeight: 'bold' }}>
                                        {especificacionArticulo.PRODUCTO_NOMBRE_COMERCIAL || ""}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>
                                    Composición: <span style={{ fontWeight: 'bold' }}>
                                        {especificacionArticulo.PRODUCTO_COMPOSICION || ""}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>
                                    Ligamento: <span style={{ fontWeight: 'bold' }}>
                                        {especificacionArticulo.PRODUCTO_LIGAMENTO || ""}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>Dibujo: <span style={{ fontWeight: 'bold' }}>
                                    <Select
                                        label="Seleccione una opción"
                                        value={dibujo}
                                        onChange={(e) => setDibujo(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    >
                                        <MenuItem value="Z">Z</MenuItem>
                                        <MenuItem value="S">S</MenuItem>
                                        <MenuItem value="Tafetán">Tafetán</MenuItem>
                                    </Select>
                                </span> </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: "5px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)" }}>
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                        >
                            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0} py={0} my={0}>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="ANCHO " id={1}
                                        variable1={anchoSinLavar1} setVariable1={setAnchoSinLavar1} unidadCalculo={"cm"}
                                        variable2={anchoSinLavar2} setVariable2={setAnchoSinLavar2} unidadMedida={"cm"}
                                        calculo={anchoSinLavarCalculo} setCalculo={setAnchoSinLavarCalculo}
                                        tipo={"sin lavar"}
                                        tipoCalculo={'Promedio'}
                                        minRef={referencias["ANCHO s/ Lavar [cm]"]?.minRef}
                                        maxRef={referencias["ANCHO s/ Lavar [cm]"]?.maxRef}
                                        referencia={referencias["ANCHO s/ Lavar [cm]"]?.ref}
                                        validar_std={referencias["ANCHO s/ Lavar [cm]"]?.validar}
                                        esObligatorio={referencias["ANCHO s/ Lavar [cm]"]?.esObligatorio}
                                        setErrors={setErrors}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormPasadas ensayo="PASADAS " tipo={"por costo"}
                                        variable1={pasadasPorCosto1} setVariable1={setPasadasPorCosto1} unidadCalculo={"p/dm"}
                                        variable2={pasadasPorCosto2} setVariable2={setPasadasPorCosto2}
                                        calculo={pasadasporCostoCalculo} setCalculo={setPasadasPorCostoCalculo}
                                        tipoCalculo={'Promedio'}
                                        minRef={referencias["PASADAS COSTO [p/dm]"]?.minRef}
                                        maxRef={referencias["PASADAS COSTO [p/dm]"]?.maxRef}
                                        referencia={referencias["PASADAS COSTO [p/dm]"]?.ref}
                                        validar_std={referencias["PASADAS COSTO [p/dm]"]?.validar}
                                        esObligatorio={referencias["PASADAS COSTO [p/dm]"]?.esObligatorio}
                                        recuentoTrama1={recuentoTrama1} recuentoTrama2={recuentoTrama2}
                                        recuentoTramaCalculo={recuentoTramaCalculo} estabilidadUrdidoCalculo={estabilidadUrdidoCalculo}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="RIGIDEZ" id={2}
                                        variable1={rigidez1} setVariable1={setRigidez1} unidadCalculo={""}
                                        variable2={rigidez2} setVariable2={setRigidez2}
                                        calculo={rigidezCalculo} setCalculo={setRigidezCalculo}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'} 
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormSigno ensayo="PREDISTORSION " tipo={"izq"} id={3}
                                        variable1={predistorsionIzq} setVariable1={setPredistorsionIzq} unidadCalculo={"%"}
                                        signo={predistorsionIzqSigno} setSigno={setPredistorsionIzqSigno} unidadMedida={"%"}
                                        calculo={predistorsionIzqCalculo} setCalculo={setPredistorsionIzqCalculo}
                                        minRef={referencias["PREDISTORSION Izq  [%]"]?.minRef}
                                        maxRef={referencias["PREDISTORSION Izq  [%]"]?.maxRef}
                                        referencia={referencias["PREDISTORSION Izq  [%]"]?.ref}
                                        validar_std={referencias["PREDISTORSION Izq  [%]"]?.validar}
                                        esObligatorio={referencias["PREDISTORSION Izq  [%]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}

                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="GRAB" tipo={"trama sin lavar"}
                                        id={4}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>

                                <Grid item xs={1.2} sx={{ px: 0.5 }}>
                                    <Typography sx={{ fontFamily: 'Poppins' }}>
                                        <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>Ancho </span>
                                        <span style={{ fontSize: 14 }}>lav</span>
                                    </Typography>
                                    <TextField id={5} value={anchoLavadoCalculo} onChange={
                                        (e) => setAnchoLavadoCalculo(e.target.value)}
                                        variant="outlined" size="small" fullWidth
                                        InputProps={{
                                            // readOnly: etapa === 'Finalizado' && auth.rol !== 'Administrador'
                                            readOnly: !permiteEditarCampos
                                        }}
                                    />
                                    <Typography sx={{ fontSize: 16 }}> Ref:
                                    </Typography>
                                </Grid>
                                <Grid item xs={1.2} sx={{ px: 0.5 }}>
                                    <Typography sx={{ fontFamily: 'Poppins' }}>
                                        <span style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold' }}>Rec Pas </span>
                                        <span style={{ fontSize: 14 }}>lav</span>
                                    </Typography>
                                    <TextField id={22} value={recuentoPasadasLavada} onChange={(e) => setRecuentoPasadasLavada(e.target.value)} variant="outlined" size="small" fullWidth InputProps=
                                        {{
                                            // readOnly: etapa === 'Finalizado' && auth.rol !== 'Administrador'
                                            readOnly: !permiteEditarCampos
                                        }} />
                                    <Typography sx={{ fontSize: 16 }}> Ref:
                                    </Typography>
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="RECUENTO " tipo={"trama"} id={6}
                                        variable1={recuentoTrama1} setVariable1={setRecuentoTrama1} unidadCalculo={"p/''"}
                                        variable2={recuentoTrama2} setVariable2={setRecuentoTrama2} unidadMedida={"[p/'']"}
                                        calculo={recuentoTramaCalculo} setCalculo={setRecuentoTramaCalculo}
                                        tipoCalculo={'Promedio'}
                                        minRef={referencias["RECUENTO Trama [p/'']"]?.minRef}
                                        maxRef={referencias["RECUENTO Trama [p/'']"]?.maxRef}
                                        referencia={referencias["RECUENTO Trama [p/'']"]?.ref}
                                        validar_std={referencias["RECUENTO Trama [p/'']"]?.validar}
                                        esObligatorio={referencias["RECUENTO Trama [p/'']"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="RECUENTO " tipo={"urdido"} id={7}
                                        variable1={recuentoUrdido1} setVariable1={setRecuentoUrdido1} unidadCalculo={"h/''"}
                                        variable2={recuentoUrdido2} setVariable2={setRecuentoUrdido2} unidadMedida={"[h/'']"}
                                        calculo={recuentoUrdidoCalculo} setCalculo={setRecuentoUrdidoCalculo}
                                        tipoCalculo={'Promedio'}
                                        minRef={referencias["RECUENTO Urdido [h/'']"]?.minRef}
                                        maxRef={referencias["RECUENTO Urdido [h/'']"]?.maxRef}
                                        referencia={referencias["RECUENTO Urdido [h/'']"]?.ref}
                                        validar_std={referencias["RECUENTO Urdido [h/'']"]?.validar}
                                        esObligatorio={referencias["RECUENTO Urdido [h/'']"]?.esObligatorio}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormSigno ensayo="PREDISTORSION " tipo={"der"} id={8}
                                        variable1={predistorsionDer} setVariable1={setPredistorsionDer} unidadCalculo={"%"}
                                        signo={predistorsionDerSigno} setSigno={setPredistorsionDerSigno} unidadMedida={"%"}
                                        calculo={predistorsionDerCalculo} setCalculo={setPredistorsionDerCalculo}
                                        minRef={referencias["PREDISTORSION Der  [%]"]?.minRef}
                                        maxRef={referencias["PREDISTORSION Der  [%]"]?.maxRef}
                                        referencia={referencias["PREDISTORSION Der  [%]"]?.ref}
                                        validar_std={referencias["PREDISTORSION Der  [%]"]?.validar}
                                        esObligatorio={referencias["PREDISTORSION Der  [%]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}

                                    />
                                </Grid>

                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="GRAB " tipo={"urdido sin lavar"} id={9}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormTriple ensayo="ESTABILIDAD " tipo={"trama"} id={10}
                                        variable1={estabilidadTrama1} setVariable1={setEstabilidadTrama1} unidadCalculo={"%"}
                                        variable2={estabilidadTrama2} setVariable2={setEstabilidadTrama2} unidadMedida={"%"}
                                        variable3={estabilidadTrama3} setVariable3={setEstabilidadTrama3}
                                        calculo={estabilidadTramaCalculo} setCalculo={setEstabilidadTramaCalculo}
                                        minRef={referencias["ESTABILIDAD Trama  [%]"]?.minRef}
                                        maxRef={referencias["ESTABILIDAD Trama  [%]"]?.maxRef}
                                        referencia={referencias["ESTABILIDAD Trama  [%]"]?.ref}
                                        validar_std={referencias["ESTABILIDAD Trama  [%]"]?.validar}
                                        esObligatorio={referencias["ESTABILIDAD Trama  [%]"]?.esObligatorio}
                                        tipoCalculo={'Estabilidad'} readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormTriple ensayo="ESTABILIDAD " tipo={"urdido"} id={11}
                                        variable1={estabilidadUrdido1} setVariable1={setEstabilidadUrdido1} unidadCalculo={"%"}
                                        variable2={estabilidadUrdido2} setVariable2={setEstabilidadUrdido2} unidadMedida={"%"}
                                        variable3={estabilidadUrdido3} setVariable3={setEstabilidadUrdido3}
                                        calculo={estabilidadUrdidoCalculo} setCalculo={setEstabilidadUrdidoCalculo}
                                        tipoCalculo={'Estabilidad'}
                                        minRef={referencias["ESTABILIDAD Urdido [%]"]?.minRef}
                                        maxRef={referencias["ESTABILIDAD Urdido [%]"]?.maxRef}
                                        referencia={referencias["ESTABILIDAD Urdido [%]"]?.ref}
                                        validar_std={referencias["ESTABILIDAD Urdido [%]"]?.validar}
                                        esObligatorio={referencias["ESTABILIDAD Urdido [%]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}

                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="ELMENDORF " tipo={"urdido sin lavar"} id={12}
                                        variable1={elmendorfUrdidoSinLavar1} setVariable1={setElmendorfUrdidoSinLavar1} unidadCalculo={""}
                                        variable2={elmendorfUrdidoSinLavar2} setVariable2={setElmendorfUrdidoSinLavar2}
                                        calculo={elmendorfUrdidoSinLavarCalculo} setCalculo={setElmendorfUrdidoSinLavarCalculo}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormSigno ensayo="MOVIMIENTO " tipo={"izq"} id={13}
                                        variable1={movimientoIzq} setVariable1={setMovimientoIzq} unidadCalculo={"%"}
                                        signo={movimientoIzqSigno} setSigno={setMovimientoIzqSigno} unidadMedida={"%"}
                                        calculo={movimientoIzqCalculo} setCalculo={setMovimientoIzqCalculo}
                                        minRef={referencias["MOVIMIENTO Izq  [%]"]?.minRef}
                                        maxRef={referencias["MOVIMIENTO Izq  [%]"]?.maxRef}
                                        referencia={referencias["MOVIMIENTO Izq  [%]"]?.ref}
                                        validar_std={referencias["MOVIMIENTO Izq  [%]"]?.validar}
                                        esObligatorio={referencias["MOVIMIENTO Izq  [%]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="DESLIZ." tipo={"costura U/T"} id={14}
                                        variable1={deslizCosturaUT1} setVariable1={setDeslizCosturaUT1} unidadCalculo={"[kg]"}
                                        variable2={deslizCosturaUT2} setVariable2={setDeslizCosturaUT2} unidadMedida={"[kg]"}
                                        calculo={deslizCosturaUTCalculo} setCalculo={setDeslizCosturaUTCalculo}
                                        minRef={referencias["DESLIZ.Costura U/T [kg]"]?.minRef}
                                        maxRef={referencias["DESLIZ.Costura U/T [kg]"]?.maxRef}
                                        referencia={referencias["DESLIZ.Costura U/T [kg]"]?.ref}
                                        validar_std={referencias["DESLIZ.Costura U/T [kg]"]?.validar}
                                        esObligatorio={referencias["DESLIZ.Costura U/T [kg]"]?.esObligatorio}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="ELASTICIDAD " tipo={"lavada"} id={15}
                                        variable1={elasticidadLavada1} setVariable1={setElasticidadLavada1} unidadCalculo={"%"}
                                        variable2={elasticidadLavada2} setVariable2={setElasticidadLavada2} unidadMedida={"%"}
                                        calculo={elasticidadLavadaCalculo} setCalculo={setElasticidadLavadaCalculo}
                                        tipoCalculo={'Estabilidad'} readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="PESO " tipo={"sin lavar"} id={16}
                                        variable1={pesoSinLavar1} setVariable1={setPesoSinLavar1} unidadCalculo={`g/m2`}
                                        variable2={pesoSinLavar2} setVariable2={setPesoSinLavar2} unidadMedida={'g'}
                                        calculo={pesoSinLavarCalculo} setCalculo={setPesoSinLavarCalculo}
                                        tipoCalculo={'PromedioConFactorPeso'}
                                        factorPeso={'0.994'}
                                        minRef={referencias["PESO s/ Lavar [gr/m2]"]?.minRef}
                                        maxRef={referencias["PESO s/ Lavar [gr/m2]"]?.maxRef}
                                        referencia={referencias["PESO s/ Lavar [gr/m2]"]?.ref}
                                        validar_std={referencias["PESO s/ Lavar [gr/m2]"]?.validar}
                                        esObligatorio={referencias["PESO s/ Lavar [gr/m2]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="ELMENDORF " tipo={"trama sin lavar"} id={17}
                                        variable1={elmendorfTramaSinLavar1} setVariable1={setElmendorfTramaSinLavar1} unidadCalculo={""}
                                        variable2={elmendorfTramaSinLavar2} setVariable2={setElmendorfTramaSinLavar2}
                                        calculo={elmendorfTramaSinLavarCalculo} setCalculo={setElmendorfTramaSinLavarCalculo}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonFormSigno ensayo="MOVIMIENTO " tipo={"der"} id={18}
                                        variable1={movimientoDer} setVariable1={setMovimientoDer} unidadCalculo={"%"}
                                        signo={movimientoDerSigno} setSigno={setMovimientoDerSigno} unidadMedida={"%"}
                                        calculo={movimientoDerCalculo} setCalculo={setMovimientoDerCalculo}
                                        minRef={referencias["MOVIMIENTO Der  [%]"]?.minRef}
                                        maxRef={referencias["MOVIMIENTO Der  [%]"]?.maxRef}
                                        referencia={referencias["MOVIMIENTO Der  [%]"]?.ref}
                                        validar_std={referencias["MOVIMIENTO Der  [%]"]?.validar}
                                        esObligatorio={referencias["MOVIMIENTO Der  [%]"]?.esObligatorio}
                                        readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}

                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="DESLIZ." tipo={"costura T/U"} id={19}
                                        variable1={deslizCosturaTU1} setVariable1={setDeslizCosturaTU1} unidadCalculo={"[kg]"}
                                        variable2={deslizCosturaTU2} setVariable2={setDeslizCosturaTU2} unidadMedida={"[kg]"}
                                        calculo={deslizCosturaTUCalculo} setCalculo={setDeslizCosturaTUCalculo}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="DEFORMACION " tipo={"lavada"} id={20}
                                        variable1={deformacionLavada1} setVariable1={setDeformacionLavada1} unidadCalculo={"%"}
                                        variable2={deformacionLavada2} setVariable2={setDeformacionLavada2} unidadMedida={"%"}
                                        calculo={deformacionLavadaCalculo} setCalculo={setDeformacionLavadaCalculo}
                                        tipoCalculo={'Estabilidad'}
                                        minRef={referencias["DEFORMACION Lavada  [%]"]?.minRef}
                                        maxRef={referencias["DEFORMACION Lavada  [%]"]?.maxRef}
                                        referencia={referencias["DEFORMACION Lavada  [%]"]?.ref}
                                        validar_std={referencias["DEFORMACION Lavada  [%]"]?.validar}
                                        esObligatorio={referencias["DEFORMACION Lavada  [%]"]?.esObligatorio}
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4}>
                                    <RenglonForm ensayo="PESO " tipo={"lavado"} id={21}
                                        variable1={pesoLavado1} setVariable1={setPesoLavado1} unidadCalculo={`g/m2`}
                                        variable2={pesoLavado2} setVariable2={setPesoLavado2} unidadMedida={'g'}
                                        calculo={pesoLavadoCalculo} setCalculo={setPesoLavadoCalculo}
                                        tipoCalculo={'PromedioConFactorPeso'}
                                        factorPeso={'0.994'}
                                        // readOnly={etapa === 'Finalizado' && auth.rol !== 'Administrador'} 
                                        readOnly={!permiteEditarCampos}
                                    />
                                </Grid>
                                <Grid item xs={2.4} px={1}>
                                    <TextField variant="standard" label="Observaciones" fullWidth multiline inputProps={{
                                        readOnly: true
                                    }} value={observaciones}>

                                    </TextField>
                                </Grid>
                                <Grid item xs={2.4} px={1}>
                                    <TextField variant="standard" label="Resultado" fullWidth multiline inputProps={{
                                        readOnly: true
                                    }} value={resultadoRutinaTerminada}></TextField>
                                </Grid>
                                <Grid item xs={1.2}>

                                </Grid>
                            </Grid>

                        </Box>
                    </Card >
                </Grid >
                <Box sx={{ width: '100%' }} paddingTop={2}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton color="inherit" onClick={() => handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={{ ...EstiloModal }}>
                        <Typography variant="h6" component="h2">
                            Resultado del ensayo de la rutina {rutina}
                        </Typography>
                        <hr />
                        <FormControl fullWidth>
                            <InputLabel id="select-resultado-label">Seleccione el resultado final</InputLabel>
                            <Select
                                labelId="select-resultado-label"
                                value={resultadoEnsayo}
                                onChange={(e) => setResultadoEnsayo(e.target.value)}
                                label="Seleccione el resultado final"
                                fullWidth
                            >
                                {resultadosPosibles
                                    .filter((resultado) => {
                                        const noAdmin = ['Operador', 'Supervisor'].includes(auth?.rol);
                                        if (noAdmin && etapa === 'Finalizado') {
                                            return resultado === 'VER' || resultado === 'CONFORME';
                                        }
                                        return true;
                                    })
                                    .map((resultado) => (
                                        <MenuItem key={resultado} value={resultado}>
                                            {resultado}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            sx={{ mt: 2 }}
                        />

                        <hr />
                        <Button onClick={handleGuardarResultado} variant="contained" color="primary">
                            Guardar
                        </Button>
                    </Box>
                </Modal>
            </Grid >
            <MensajeDialog
                mensaje={mensaje}
                isOpen={isOpen}
                tipo={tipo}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
};

export default FormularioEnsayos;