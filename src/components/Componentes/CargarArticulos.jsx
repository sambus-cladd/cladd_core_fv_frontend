import { useEffect, useState, React }               from 'react';
import { Card, TextField, Button, Dialog, DialogTitle } from '@mui/material';
import Grid                                         from '@mui/material/Unstable_Grid2';
import {Typography }                                from "@mui/material";

import CancelIcon                                   from '@mui/icons-material/Cancel';
import TaskAltIcon                                  from '@mui/icons-material/TaskAlt';

import DescriptionIcon from '@mui/icons-material/Description';
import WavesIcon from '@mui/icons-material/Waves';
import GestureIcon from '@mui/icons-material/Gesture';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import StraightenIcon from '@mui/icons-material/Straighten';
import NumbersIcon from '@mui/icons-material/Numbers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import { GetTABLADETALLES, PutREGISTRARARTICULO } from '../API/APIFunctions';

// import { PutREGISTRARARTICULO, GetTABLADETALLES } from '../API/APIFunctions'

function ReporteConeraForm() {
    
    const [Articulo, setArticulo]                                 = useState("");
    const [Urdimbre, setUrdimbre]                                 = useState("");
    const [Hilos, setHilos]                                       = useState('');
    const [Dibujo, setDibujo]                                     = useState("");
    const [Peine, setPeine]                                       = useState("");
    const [Linea, setLinea]                                       = useState("");
    const [Ex, setEx]                                             = useState("");
    const [Nombre, setNombre]                                     = useState("");
    const [Trama, setTrama]                                       = useState("");
    const [PasXcm, setPasXcm]                                     = useState('');
    const [Gr_ml, setGr_ml]                                       = useState('');
    const [Gr_m2, setGr_m2]                                       = useState('');
    const [AnchoPeine, setAnchoPeine]                             = useState('');
    const [AnchoDescanso, setAnchoDescanso]                       = useState('');
    const [HiloXorillo, setHiloXorillo]                           = useState("");
    const [ArticuloFV, setArticuloFV]                             = useState("");
    const [Observaciones, setObservaciones]                       = useState("");

    const [openDialog, setopenDialog] = useState(false);
    const [openError, setopenError] = useState(false);
    const [errores, setErrores]                                   = useState({});

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

    const vaciarForm = () => {
        setArticulo('');
        setUrdimbre('');
        setHilos('');
        setDibujo('');
        setPeine('');
        setLinea('');
        setEx('');
        setNombre('');
        setTrama('');
        setPasXcm('');
        setGr_ml('');
        setGr_m2('');
        setAnchoPeine('');
        setAnchoDescanso('');
        setHiloXorillo('');
        setArticuloFV('');
        setObservaciones('');

    }

    const validar = () => {
        let tempErrores = {};
        if (!Articulo) tempErrores.articulo = "Este campo es obligatorio.";
        if (!Urdimbre) tempErrores.urdimbre = "Este campo es obligatorio.";
        if (!Hilos) tempErrores.hilos = "Este campo es obligatorio.";
        if (!Dibujo) tempErrores.dibujo = "Este campo es obligatorio.";
        if (!Peine) tempErrores.peine = "Este campo es obligatorio.";
        if (!Linea) tempErrores.linea = "Este campo es obligatorio.";
        if (!Ex) tempErrores.ex = "Este campo es obligatorio.";
        if (!Trama) tempErrores.trama = "Este campo es obligatorio.";
        if (!PasXcm) tempErrores.pasxcm = "Este campo es obligatorio.";
        if (!Gr_ml) tempErrores.grml = "Este campo es obligatorio.";
        if (!Gr_m2) tempErrores.grm2 = "Este campo es obligatorio.";
        if (!AnchoPeine) tempErrores.anchopeine = "Este campo es obligatorio.";
        if (!AnchoDescanso) tempErrores.anchodescanso = "Este campo es obligatorio.";
        if (!HiloXorillo) tempErrores.hiloxorillo = "Este campo es obligatorio.";

        setErrores(tempErrores);
        return Object.keys(tempErrores).length === 0;

    };

    //INICIO - BOTON REGISTRAR ARTICULO
    const handleButtonArticulos = async(datos) => {
      
        if(validar()){
            try {
                let articulo = {

                    Urdimbre: datos.Urdimbre,
                    Hilos: datos.Hilos,
                    Dibujo: datos.Dibujo,
                    Peine: datos.Peine,
                    Linea: datos.Linea,
                    Ex: datos.Ex,
                    Nombre: datos.Nombre,
                    Articulo: datos.Articulo,
                    Trama: datos.Trama,
                    PasXcm: datos.PasXcm,
                    Gr_ml: datos.Gr_ml,
                    Gr_m2: datos.Gr_m2,
                    AnchoPeine: datos.AnchoPeine,
                    AnchoDescanso: datos.AnchoDescanso,
                    HiloXorillo: datos.HiloXorillo,
                    ArticuloFV: datos.ArticuloFV,
                    Observaciones: datos.Observaciones
                };
                    
                    let respuesta = await PutREGISTRARARTICULO(articulo)

                    if (respuesta.serverStatus === 34) {
                        toggleOpenDialogWithDelay();
                        vaciarForm(); 
                    } else {
                        toggleOpenErrorWithDelay();
                    }
            
                    console.log("respuesta: ", respuesta)

                    // window.location.reload('/Hilanderia'); // Recargar la página
            } catch (error) {
                console.error('Error en handleButtonEnviar:', error);
            }
        }
    };
    //FIN - BOTON REGISTRAR ARTICULO

    // INICIO - TRAER ARTICULO EXISTENTE
    async function getArticulo(Articulo){
        if(Articulo){
            console.log("GetTABLADETALLES", Articulo);

            let DataRAW = []
            DataRAW = await GetTABLADETALLES(Articulo)
            console.log("DataRaw:", DataRAW);

            const DataRAW2 = DataRAW.Dato
            if(DataRAW2[0].length !== 0){
                setUrdimbre(DataRAW2[0].urdimbre);
                setHilos(Number(DataRAW2[0].hilos).toFixed(0));
                setDibujo(DataRAW2[0].dibujo);
                setPeine(DataRAW2[0].peine);
                setLinea(DataRAW2[0].linea);
                setEx(DataRAW2[0].ex);
                setNombre(DataRAW2[0].nombre);
                setTrama(DataRAW2[0].trama);
                setPasXcm(Number(DataRAW2[0].pas_x_cm).toFixed(1));
                setGr_ml(Number(DataRAW2[0].gr_ml).toFixed(1));
                setGr_m2(Number(DataRAW2[0].gr_m2).toFixed(1));
                setAnchoPeine(Number(DataRAW2[0].ancho_peine).toFixed(1));
                setAnchoDescanso(Number(DataRAW2[0].ancho_descanso).toFixed(1));
                setHiloXorillo(DataRAW2[0].hilo_x_orillo);
                setArticuloFV(DataRAW2[0].articulo_fv);
                setObservaciones(DataRAW2[0].observaciones);
            }            
            
        }
    } 
    // FIN - TRAER ARTICULO EXISTENTE 

    return (
      <>
        {/* contenedor principal */}
        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" >
                
                {/* GRID FORM */}
                <Grid item xs={11} sm={7} md={7} padding={1}>
                    <Card sx={{ minWidth: '100%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", paddingTop: 0, marginTop: '20px' }}>
                        

                        {/* PRIMERA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} paddingTop={6} spacing={1}>
                            
                            {/* Articulo */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Articulo" 
                                    variant="outlined"
                                    value={Articulo}
                                    onChange={(event) => {
                                            const artic = event.target.value
                                            setArticulo(artic);
                                            getArticulo(artic);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.articulo}
                                    helperText={errores.articulo} 
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Nombre */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Nombre" 
                                    variant="outlined"
                                    value={Nombre}
                                    onChange={(event) => {
                                            const nombre = event.target.value
                                            setNombre(nombre);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <AbcIcon position="end">
                                            </AbcIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Urdimbre */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Urdimbre" 
                                    variant="outlined"
                                    value={Urdimbre}
                                    onChange={(event) => {
                                            const urdimbre = event.target.value
                                            setUrdimbre(urdimbre);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.urdimbre}
                                    helperText={errores.urdimbre} 
                                    InputProps={{
                                        endAdornment: (
                                            <WavesIcon position="end">
                                            </WavesIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Hilos */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Hilos" 
                                    variant="outlined"
                                    type='number'
                                    value={Hilos}
                                    onChange={(event) => {
                                            const hilo = event.target.value
                                            setHilos(hilo);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.hilos}
                                    helperText={errores.hilos} 
                                    InputProps={{
                                        endAdornment: (
                                            <GestureIcon position="end">
                                            </GestureIcon>
                                        ),
                                    }} />
                            </Grid>

                        </Grid>

                        {/* SEGUNDA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} spacing={1}>
                            
                            {/* Dibujo */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Dibujo" 
                                    variant="outlined"
                                    value={Dibujo}
                                    onChange={(event) => {
                                            const dibujo = event.target.value
                                            setDibujo(dibujo);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.dibujo}
                                    helperText={errores.dibujo} 
                                    InputProps={{
                                        endAdornment: (
                                            <DesignServicesIcon position="end">
                                            </DesignServicesIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Peine */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Peine" 
                                    variant="outlined"
                                    value={Peine}
                                    onChange={(event) => {
                                            const peine = event.target.value
                                            setPeine(peine);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.peine}
                                    helperText={errores.peine} 
                                    InputProps={{
                                        endAdornment: (
                                            <StraightenIcon position="end">
                                            </StraightenIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Linea */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Linea" 
                                    variant="outlined"
                                    value={Linea}
                                    onChange={(event) => {
                                            const linea = event.target.value
                                            setLinea(linea);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.linea}
                                    helperText={errores.linea} 
                                    InputProps={{
                                        endAdornment: (
                                            <AbcIcon position="end">
                                            </AbcIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Ex */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Ex" 
                                    variant="outlined"
                                    value={Ex}
                                    onChange={(event) => {
                                            const ex = event.target.value
                                            setEx(ex);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.ex}
                                    helperText={errores.ex}
                                    InputProps={{
                                        endAdornment: (
                                            <CodeIcon position="end">
                                            </CodeIcon>
                                        ),
                                    }} />
                            </Grid>
                        </Grid>

                        {/* TERCERA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} spacing={1}>
                            
                            {/* Trama */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Trama" 
                                    variant="outlined"
                                    value={Trama}
                                    onChange={(event) => {
                                            const trama = event.target.value
                                            setTrama(trama);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.trama}
                                    helperText={errores.trama}
                                    InputProps={{
                                        endAdornment: (
                                            <WavesIcon position="end">
                                            </WavesIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* PasXcm */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Pas X cm" 
                                    variant="outlined"
                                    type='number'
                                    value={PasXcm}
                                    onChange={(event) => {
                                            const pasXcm = event.target.value
                                            setPasXcm(pasXcm);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.pasxcm}
                                    helperText={errores.pasxcm}
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Gr_ml */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Gr/ml" 
                                    variant="outlined"
                                    type='number'
                                    value={Gr_ml}
                                    onChange={(event) => {
                                            const gr_ml = event.target.value
                                            setGr_ml(gr_ml);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.grml}
                                    helperText={errores.grml}
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Gr_m2 */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Gr/m2" 
                                    variant="outlined"
                                    type='number'
                                    value={Gr_m2}
                                    onChange={(event) => {
                                            const gr_m2 = event.target.value
                                            setGr_m2(gr_m2);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.grm2}
                                    helperText={errores.grm2}
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>
                        </Grid>

                        {/* CUARTA FILA */}
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" padding={1} spacing={1}>
                            
                            {/* Ancho Peine */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Ancho Peine" 
                                    variant="outlined"
                                    type='number'
                                    value={AnchoPeine}
                                    onChange={(event) => {
                                            const anchoPeine = event.target.value
                                            setAnchoPeine(anchoPeine);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.anchopeine}
                                    helperText={errores.anchopeine}
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Ancho Descanso */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Ancho Descanso" 
                                    variant="outlined"
                                    type='number'
                                    value={AnchoDescanso}
                                    onChange={(event) => {
                                            const anchoDescanso = event.target.value
                                            setAnchoDescanso(anchoDescanso);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.anchodescanso}
                                    helperText={errores.anchodescanso}
                                    InputProps={{
                                        endAdornment: (
                                            <PinIcon position="end">
                                            </PinIcon>
                                        ),
                                    }} />
                            </Grid>

                            {/* Hilo X Orillo */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Hilo X Orillo" 
                                    variant="outlined"
                                    value={HiloXorillo}
                                    onChange={(event) => {
                                            const hiloXorillo = event.target.value
                                            setHiloXorillo(hiloXorillo);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    error={!!errores.hiloxorillo}
                                    helperText={errores.hiloxorillo}
                                    InputProps={{
                                        endAdornment: (
                                            <LinearScaleIcon position="end">
                                            </LinearScaleIcon>
                                        ),
                                    }} />
                            </Grid>
                            
                            {/* Articulo FV */}
                            <Grid item xs={12} sm={3} md={3} >
                                <TextField
                                    fullWidth  
                                    id="outlined-basic" 
                                    label="Articulos FV" 
                                    variant="outlined"
                                    value={ArticuloFV}
                                    onChange={(event) => {
                                            const articuloFV = event.target.value
                                            setArticuloFV(articuloFV);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <NumbersIcon position="end">
                                            </NumbersIcon>
                                        ),
                                    }} />
                            </Grid>

                        </Grid>

                        {/*  OBSERVACIONES */}
                        <Grid container  justifyContent="space-evenly" alignItems="flex-start" padding={2}>
                            
                            {/* Observaciones */}
                            <Grid item xs={12} sm={12} md={12} >
                                <TextField 
                                    fullWidth 
                                    id="outlined-basic" 
                                    label="Observaciones" 
                                    variant="outlined"
                                    multiline
                                    value={Observaciones}
                                    onChange={(event) => {
                                            const obs = event.target.value
                                            setObservaciones(obs);
                                    }} 
                                    onFocus={(event) => {
                                        event.target.select();  // Selecciona todo el contenido cuando se hace clic
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <DescriptionIcon position="end">
                                            </DescriptionIcon>
                                        ),
                                    }}
                                 />
                            </Grid>
                        </Grid>

                        {/* FILA BOTON */}
                        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" padding={2}>
                            
                            <Grid item xs={12} sm={6} md={6} justifyContent="flex-end" alignItems="flex-end">
                                <Button variant="contained" style={{  color: 'white' }}
                                onClick={() => {

                                     let Aux = {
                                        Articulo: Articulo,
                                        Urdimbre: Urdimbre,
                                        Hilos: Hilos,
                                        Dibujo: Dibujo,
                                        Peine: Peine,
                                        Linea: Linea,
                                        Ex: Ex,
                                        Nombre: Nombre,
                                        Trama: Trama,
                                        PasXcm: PasXcm,
                                        Gr_ml: Gr_ml,
                                        Gr_m2: Gr_m2,
                                        AnchoPeine: AnchoPeine,
                                        AnchoDescanso: AnchoDescanso,
                                        HiloXorillo: HiloXorillo,
                                        ArticuloFV: ArticuloFV,
                                        Observaciones: Observaciones

                                     }
        
                                    handleButtonArticulos(Aux)
                                }}>
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

export default ReporteConeraForm;