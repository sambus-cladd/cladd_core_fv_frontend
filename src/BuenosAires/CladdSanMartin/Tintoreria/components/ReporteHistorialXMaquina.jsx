import {useEffect, useState, React} from 'react';
import axios from 'axios'
// MUI Libreria
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
// import Box from '@mui/material/Box';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker   }   from '@mui/x-date-pickers/DatePicker';
import {GetHistorialXMaquina} from '../API/APIFunctions';
import { GetMaquinas } from '../API/APIFunctions';

import EqualizerIcon from '@mui/icons-material/Equalizer';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PercentIcon from '@mui/icons-material/Percent';

import es from 'date-fns/locale/es';
import ReporteHistorialXMaquinaTabla from './ReporteHistorialXMaquinaTabla';
import ReporteHistorialXMaquinaGrafico from './ReporteHistorialXMaquinaGrafico';
import ReporteHistorialXMaquinaTiemposTabla from './ReporteHistorialXMaquinaTiemposTabla';
import ReporteHistorialXMaquinaTiemposGrafico from './ReporteHistorialXMaquinaTiemposGrafico';
import ReporteHistorialXMaquinaEficienciasTabla from './ReporteHistorialXMaquinaEficienciasTabla';
import ReporteHistorialXMaquinaEficienciasGrafico from './ReporteHistorialXMaquinaEficienciasGrafico';

export default function ReporteHistorialXMaquina()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)
    const mes=Fecha.getMonth()+1 

    const [FechaInicial, setFechaInicial]                       = useState( DiaAnterior );
    const [FechaFinal, setFechaFinal]                           = useState( DiaAnterior );
    const [FechaMaxInicial, setFechaMaxInicial]                 = useState( DiaAnterior );
    const [FechaMaxFinal, setFechaMaxFinal]                     = useState( DiaAnterior );
    const [FechaMinInicial, setFechaMinInicial]                 = useState( "2022/06/01" );
    const [FechaMinFinal, setFechaMinFinal]                     = useState( "2022/06/01" );

    const [ProduccionTotal, setProduccionTotal]                  = useState(0);
    const [EficienciaTotal, setEficienciaTotal]                  = useState(0);
    const [ParosTotal, setParosTotal]                            = useState(0);
    const [SinProduccionTotal, setSinProduccionTotal]            = useState(0);
    const [TiempoProduccionTotal, setTiempoProduccionTotal]      = useState(0);
    const [TotalParosMin, setTotalParosMin]                      = useState(0);
    const [TotalSinProduccionMin, setTotalSinProduccionMin]      = useState(0);
    const [ProduccionFechas, setProduccionFechas]                = useState([]);

    const [maquinas, setMaquinas]                               = useState([]);
    const [maquinaSeleccionada, setMaquinaSeleccionada]         = useState(0);

    let dataRAW;
    let ProduccionFechas_aux, objAux;
    let aux_fechainicial, aux_fechafinal;

    //Creo la conexión con la API que corresponde al listado de Máquinas
    useEffect(() => {
        const CargaMaquinas = async () => {
          try {
            const response = await GetMaquinas();
            setMaquinas(response); // Asigno los datos de las máquinas al estado
            setMaquinaSeleccionada(response[0]?.DESCRIPCION || ''); // Establece la máquina seleccionada por defecto
          } catch (error) {
            console.error('Error al obtener las máquinas:', error);
          }
        };
      
        CargaMaquinas();
      }, []);

    //Calculo la cantidad de días completos y los minutos restantes. 
    //Luego, combino los valores en una cadena con el formato deseado dias minutos
      function formatTime(minutes) {
            const days = Math.floor(minutes / 1440);
            const remainingMinutes = minutes % 1440;
            return `${days} días ${remainingMinutes} minutos`;
      }
    
    async function GetHistorialxMaquina(FechaInicial, FechaFinal)
    {
        ProduccionFechas_aux=[];
        objAux=[];
        if(FechaInicial!=null && FechaFinal!= null)
          {    
              aux_fechainicial = (FechaInicial.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechafinal = (FechaFinal.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechainicial= (aux_fechainicial.split("/",3)[2])+"-"+(aux_fechainicial.split("/",3)[1])+"-"+(aux_fechainicial.split("/",3)[0])
              aux_fechafinal= (aux_fechafinal.split("/",3)[2])+"-"+(aux_fechafinal.split("/",3)[1])+"-"+(aux_fechafinal.split("/",3)[0])
          
              dataRAW = await GetHistorialXMaquina(aux_fechainicial + '&' + aux_fechafinal + '&' + maquinaSeleccionada);

                setProduccionTotal(dataRAW.ProduccionTotal);
                setEficienciaTotal(dataRAW.EficienciaTotal);
                setParosTotal(dataRAW.ParosTotal);
                setSinProduccionTotal(dataRAW.SinProduccionTotal);
                setTiempoProduccionTotal(dataRAW.TiempoProduccionTotal);
                setTotalParosMin(dataRAW.TotalParosMin);
                setTotalSinProduccionMin(dataRAW.TotalSinProduccionMinutos);

                for(let i=0; i<dataRAW.Datos.length;i++)
                {
                    objAux={
                        Fecha: dataRAW.Datos[i].FECHA,
                        IdMaquina: dataRAW.Datos[i].IDMAQUINA,
                        Descripcion: dataRAW.Datos[i].DESCRIPCION,
                        TiempoDisponible: dataRAW.Datos[i].TIEMPODISPONIBLE,
                        TiempoProduccion: dataRAW.Datos[i].TIEMPOPRODUCCION,
                        TiempoSinProduccion: dataRAW.Datos[i].TIEMPOSINPRODUCCION,
                        TiempoParos: dataRAW.Datos[i].TIEMPOPAROS,
                        TiempoReal: dataRAW.Datos[i].TIEMPOREAL,
                        Kilos: dataRAW.Datos[i].Kilos,
                        Eficiencia: dataRAW.Datos[i].Eficiencia,
                        PorcParos: dataRAW.Datos[i].Porc_Paros,
                        PorcSinProduccion: dataRAW.Datos[i].Porc_Sin_Produccion,
                        OEE: dataRAW.Datos[i].OEE   
                    }

                    ProduccionFechas_aux.push(objAux);
                }
                setProduccionFechas(ProduccionFechas_aux);
            
          }
    }

    const handleButtonClick = ( ) =>
    {
        GetHistorialxMaquina(FechaInicial, FechaFinal)
    }; 
   
    return (  
        <>

        {/* <Grid xs={12} sm={12} md={12}>
            <br />
                <h2>-- HISTORIAL TINTORERÍA --</h2>
            <br />
        </Grid> */}

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Grid width={'85%'} sx={{ boxSizing: 'content-box', margin: 'auto' }}>

                <Card sx={{ minWidth: '30%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", padding: '20px 20px' }}> 
                    <Grid container spacing={2} sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    
                                <Grid item xs={3} md={3} lg={3}>    
                                    {/* <FormControl fullWidth> */}
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                                    <DatePicker
                                            disableFuture
                                            mask="__/__/____"
                                            label="Fecha Inicio"
                                            openTo="year"
                                            views={['year', 'month', 'day']}
                                            placeholder="dd/MM/yyyy"
                                            value={FechaInicial}
                                            minDate={FechaMinInicial}
                                            maxDate={FechaMaxInicial}
                                            onChange={  (newFechaInicial) => 
                                                {
                                                    // Al seleccionar una fecha pone en Fecha Final un mes despues 
                                                let auxFecha = new Date(newFechaInicial)
                                                setFechaMaxFinal(new Date(auxFecha.getTime() + (1000 * 60 * 60 * 24*30)*3))
                                                setFechaMinFinal(newFechaInicial)
                                                setFechaInicial(newFechaInicial);
                                                }}
                                            renderInput={(params) => <TextField {...params} />}
                                    />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={3} md={3} lg={3}>
                                    {/* <FormControl fullWidth> */}
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                                    <DatePicker
                                        disableFuture
                                        mask="__/__/____"
                                        label="Fecha Final"
                                        openTo="year"
                                        views={['year', 'month', 'day']}
                                        placeholder="dd/MM/yyyy"
                                        value={FechaFinal}
                                        minDate={FechaMinFinal}
                                        maxDate={FechaMaxFinal}
                                        onChange={  (newFechaFinal) => {
                                                // Al seleccionar una fecha pone en Fecha Inicial un mes despues 
                                                let auxFecha = new Date(newFechaFinal)
                                                setFechaMinInicial(new Date(auxFecha.getTime() - (1000 * 60 * 60 * 24*30)*3))
                                                setFechaMaxInicial(newFechaFinal)
                                                setFechaFinal(newFechaFinal); }}
                            
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={3} md={3} lg={3}>
                                <FormControl fullWidth>
                                        <InputLabel id="combo-box-label">Equipo</InputLabel>
                                            <Select
                                                label="Máquina"
                                                id="combo-box"
                                                value={maquinaSeleccionada}
                                                onChange={(event) => setMaquinaSeleccionada(event.target.value)}
                                                >
                                                {/* <MenuItem value="Todos">Todos</MenuItem> */}
                                                {maquinas.map((maquina) => (
                                                    <MenuItem key={maquina.CDMAQUINA} value={maquina.CDMAQUINA}>
                                                    {maquina.CDMAQUINA}
                                                    </MenuItem> 
                                                ))}
                                            </Select>
                                </FormControl>
                                </Grid>
                         
                                <Grid item xs={3} md={3} lg={3}>
                                    <Button variant="contained"
                                        onClick={() => {
                                        handleButtonClick();
                                        // alert('clicked');
                                        }}
                                        >Generar Informe
                                    </Button> 
                                </Grid>
                    </Grid>
                </Card>
            </Grid>
        </div>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <EqualizerIcon></EqualizerIcon>
                    <span style={{ marginLeft: '5px' }}> <strong>Producción y Eficiencia - {maquinas.find((maquina) => maquina.CDMAQUINA === maquinaSeleccionada)?.DESCRIPCION} </strong> </span>
                </p>
            </Card>
        </Grid>
        
        <Grid item xs={12} md={12} lg={12}>

        <ReporteHistorialXMaquinaGrafico Serie={ProduccionFechas} />

        
        <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Producción Total: <span style={{ color: '#008FFB' }}>{ProduccionTotal.toLocaleString('de-DE')} Kg.</span>
                </h2>
                </Box>
                <hr />
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Eficiencia Promedio: <span style={{ color: '#6d9c07' }}>{EficienciaTotal.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
            </Grid>
        </Grid>

        <br />

        <ReporteHistorialXMaquinaTabla  Titulo={"Historial por Maquinas"} Serie={ProduccionFechas} ProduccionTotal={ProduccionTotal} Labels={[' ' ]} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        
        </Grid>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <PendingActionsIcon></PendingActionsIcon>
                    <span style={{ marginLeft: '5px' }}> <strong>Tiempos de Producción (Paros) - {maquinas.find((maquina) => maquina.CDMAQUINA === maquinaSeleccionada)?.DESCRIPCION} </strong></span>
                </p>
            </Card>
        </Grid>

        <ReporteHistorialXMaquinaTiemposGrafico Serie={ProduccionFechas} />

        <br />

        <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                Promedio Sin Producción: <span style={{ color: '#e09106' }}>{formatTime(TotalSinProduccionMin)}</span>
                </h2>
                </Box>
                <hr />
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Promedio de Paros: <span style={{ color: '#e90f0f' }}>{formatTime(TotalParosMin)}</span>
                </h2>
                </Box>
                <hr />
            </Grid>
        </Grid>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Promedio Tiempo Real: <span style={{ color: '#6d9c07' }}>{formatTime(TiempoProduccionTotal)}</span>
                </h2>
                </Box>
                <hr />
            </Grid>

        <br />

        <ReporteHistorialXMaquinaTiemposTabla  Titulo={"Historial por Maquinas"} Serie={ProduccionFechas} Labels={[' ' ]} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        
        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <PercentIcon></PercentIcon>
                    <span style={{ marginLeft: '5px' }}> <strong>Eficiencia, Paros y Disponibilidad - {maquinas.find((maquina) => maquina.CDMAQUINA === maquinaSeleccionada)?.DESCRIPCION} </strong></span>
                </p>
            </Card>
        </Grid>

        <ReporteHistorialXMaquinaEficienciasGrafico Serie={ProduccionFechas} />

        <br />

        <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                Promedio Sin Producción: <span style={{ color: '#e09106' }}>{SinProduccionTotal.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Promedio de Paros: <span style={{ color: '#e90f0f' }}>{ParosTotal.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
            </Grid>
        </Grid>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Promedio Eficiencia: <span style={{ color: '#6d9c07' }}>{EficienciaTotal.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
        </Grid>

        <br />

        <ReporteHistorialXMaquinaEficienciasTabla  Titulo={"Historial por Maquinas"} Serie={ProduccionFechas} Labels={[' ' ]} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>

    
  
  </>
  )
    
}

