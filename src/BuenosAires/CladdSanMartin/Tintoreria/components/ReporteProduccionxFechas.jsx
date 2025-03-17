import {useEffect, useState, React} from 'react';
import axios from 'axios'
// MUI Libreria
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker   }   from '@mui/x-date-pickers/DatePicker';
import {GetProduccionPorFechas} from '../API/APIFunctions'
import {GetHistorialXMaquina} from '../API/APIFunctions'

import EqualizerIcon from '@mui/icons-material/Equalizer';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import InsightsIcon from '@mui/icons-material/Insights';

import es from 'date-fns/locale/es';
import ReporteProduccionGraficoTabla from './ReporteProduccionGraficoTabla';
import ReporteHistorialXMaquinaGraficoTodos from './ReporteHistorialXMaquinaGraficoTodos';
import ReporteHistorialXMaquinaTiemposTablaTodos from './ReporteHistorialXMaquinaTiemposTablaTodos';


export default function ReporteProduccionxFechas()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)
    const mes=Fecha.getMonth()+1 

    const [FechaInicial, setFechaInicial]                       = useState( DiaAnterior );
    const [FechaFinal, setFechaFinal]                           = useState( DiaAnterior );
    const [FechaMaxInicial, setFechaMaxInicial]                 = useState( DiaAnterior );
    const [FechaMaxFinal, setFechaMaxFinal]                     = useState( DiaAnterior );
    const [FechaMinInicial, setFechaMinInicial]                 = useState( "2022/06/01" );
    const [FechaMinFinal, setFechaMinFinal]                     = useState( "2022/06/01" );

    const [ProduccionTotal,setProduccionTotal]                  = useState(0);
    const [ProduccionFechas,setProduccionFechas]                = useState([]);

    const [ProduccionTotal2, setProduccionTotal2]                  = useState(0);
    const [EficienciaTotalSalon, setEficienciaTotalSalon]          = useState(0);
    const [ParosTotalSalon, setParosTotalSalon]                    = useState(0);
    const [SinProduccionTotalSalon, setSinProduccionTotalSalon]    = useState(0);
    const [TiempoProduccionTotal, setTiempoProduccionTotal]      = useState(0);
    const [TotalParosMin, setTotalParosMin]                      = useState(0);
    const [TotalSinProduccionMin, setTotalSinProduccionMin]      = useState(0);
    const [ProduccionFechas2,setProduccionFechas2]               = useState([]);
    const [maquinaSeleccionada, setMaquinaSeleccionada]          = useState('Todos');

    let dataRAW; let dataRaw2;
    let ProduccionFechas_aux, objAux;
    let ProduccionFechas_aux2, objAux2;
    let aux_fechainicial, aux_fechafinal;

    //Calculo la cantidad de días completos y los minutos restantes. 
    //Luego, combino los valores en una cadena con el formato deseado dias minutos
    function formatTime(minutes) {
        const days = Math.floor(minutes / 1440);
        const remainingMinutes = minutes % 1440;
        return `${days} días ${remainingMinutes} minutos`;
    }
    
    async function GetDataProduccion(FechaInicial, FechaFinal)
    {
        ProduccionFechas_aux=[];
        objAux=[];

        ProduccionFechas_aux2=[];
        objAux2=[];
        let Maquina='Todos';

        if(FechaInicial!=null && FechaFinal!= null)
          {    
              aux_fechainicial = (FechaInicial.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechafinal = (FechaFinal.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechainicial= (aux_fechainicial.split("/",3)[2])+"-"+(aux_fechainicial.split("/",3)[1])+"-"+(aux_fechainicial.split("/",3)[0])
              aux_fechafinal= (aux_fechafinal.split("/",3)[2])+"-"+(aux_fechafinal.split("/",3)[1])+"-"+(aux_fechafinal.split("/",3)[0])
          
              dataRAW = await GetProduccionPorFechas(aux_fechainicial+'&'+aux_fechafinal);

                setProduccionTotal(dataRAW.ProduccionTotal);

                for(let i=0; i<dataRAW.Dato.length;i++)
                {
                    objAux={
                        Fecha: dataRAW.Dato[i].FECHA,
                        Produccion: dataRAW.Dato[i].TotalKilosReales
                    }

                    ProduccionFechas_aux.push(objAux);
                }
                    setProduccionFechas(ProduccionFechas_aux);
            
               dataRaw2 = await GetHistorialXMaquina(aux_fechainicial + '&' + aux_fechafinal + '&' + maquinaSeleccionada);

                   setEficienciaTotalSalon(dataRaw2.EficienciaTotal);
                   setParosTotalSalon(dataRaw2.ParosTotal);
                   setSinProduccionTotalSalon(dataRaw2.SinProduccionTotal);
    
               for(let i=0; i<dataRaw2.Datos.length;i++)
                    {
                        objAux2={
                            Fecha: dataRaw2.Datos[i].FECHA,
                            IdMaquina: dataRaw2.Datos[i].IDMAQUINA,
                            Descripcion: dataRaw2.Datos[i].DESCRIPCION,
                            TiempoDisponible: dataRaw2.Datos[i].TIEMPODISPONIBLE,
                            TiempoProduccion: dataRaw2.Datos[i].TIEMPOPRODUCCION,
                            TiempoSinProduccion: dataRaw2.Datos[i].TIEMPOSINPRODUCCION,
                            TiempoParos: dataRaw2.Datos[i].TIEMPOPAROS,
                            TiempoReal: dataRaw2.Datos[i].TIEMPOREAL,
                            Kilos: dataRaw2.Datos[i].Kilos,
                            Eficiencia: dataRaw2.Datos[i].Eficiencia,
                            PorcParos: dataRaw2.Datos[i].Porc_Paros,
                            PorcSinProduccion: dataRaw2.Datos[i].Porc_Sin_Produccion,
                            OEE: dataRaw2.Datos[i].OEE   
                        }
    
                        ProduccionFechas_aux2.push(objAux2);
                    }
                    setProduccionFechas2(ProduccionFechas_aux2); 
          }
    }

    const handleButtonClick = ( ) =>
    {
      
        GetDataProduccion(FechaInicial, FechaFinal)
   
    }; 

   
    return (  
        <>
        
        <br />

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Grid width={'75%'} sx={{ boxSizing: 'content-box', margin: 'auto' }}>

                <Card sx={{ minWidth: '30%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", padding: '20px 0' }}> 
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
                    <span style={{ marginLeft: '5px' }}> <strong> Análisis de producción (General)</strong> </span>
                </p>
            </Card>
        </Grid>

        <br />
        
        <Grid item xs={12} md={12} lg={12}>
            
        <ReporteProduccionGraficoTabla  Titulo={"Produccion por Fechas"} Serie={ProduccionFechas} ProduccionTotal={ProduccionTotal} Labels={[' ' ]}/>
        </Grid>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <InsightsIcon></InsightsIcon>
                    <span style={{ marginLeft: '5px' }}> <strong> Análisis de eficiencia, paros y disponibilidad (General)</strong> </span>
                </p>
            </Card>
        </Grid>

        <ReporteHistorialXMaquinaGraficoTodos Serie={ProduccionFechas2} />
        
        <br />

        <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                Promedio Sin Producción: <span style={{ color: '#e09106' }}>{SinProduccionTotalSalon.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6}>
                <hr />
                <Box display="flex" justifyContent="center">
                <h2 style={{ color: 'black' }}>
                    Promedio de Paros: <span style={{ color: '#e90f0f' }}>{ParosTotalSalon.toFixed(2)}%</span>
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
                    Promedio Eficiencia: <span style={{ color: '#6d9c07' }}>{EficienciaTotalSalon.toFixed(2)}%</span>
                </h2>
                </Box>
                <hr />
        </Grid>

        <br />

        <Grid item xs={12} md={12} lg={12}>    
            <ReporteHistorialXMaquinaTiemposTablaTodos  Titulo={"Produccion por Fechas"} Serie={ProduccionFechas2} ProduccionTotal={ProduccionTotal} Labels={[' ' ]} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        </Grid> 
  
  </>
  )
    
}

