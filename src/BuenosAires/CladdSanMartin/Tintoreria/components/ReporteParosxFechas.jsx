import {useEffect, useState, React} from 'react';
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker   }   from '@mui/x-date-pickers/DatePicker';
import {GetParosPorFechas} from '../API/APIFunctions'
import es from 'date-fns/locale/es';
import ReporteParosGraficoTabla from './ReporteParosGraficoTabla';

export default function ReporteParosxFechas()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)

    const [FechaInicial, setFechaInicial]                       = useState( DiaAnterior );
    const [FechaFinal, setFechaFinal]                           = useState( DiaAnterior );
    const [FechaMaxInicial, setFechaMaxInicial]                 = useState( DiaAnterior );
    const [FechaMaxFinal, setFechaMaxFinal]                     = useState( DiaAnterior );
    const [FechaMinInicial, setFechaMinInicial]                 = useState( "2022/06/01" );
    const [FechaMinFinal, setFechaMinFinal]                     = useState( "2022/06/01" );

    const [TiempoTotal,setTiempoTotal]                          = useState(0);
    const [TiempoFechas,setTiempoFechas]                        = useState([]);

    let dataRAW;
    let TiempoFechas_aux, objAux;
    let aux_fechainicial, aux_fechafinal;
    
    async function GetDataParos(FechaInicial, FechaFinal)
    {
        TiempoFechas_aux=[];
        objAux=[];

        if(FechaInicial!=null && FechaFinal!= null)
          {
            //    
              aux_fechainicial = (FechaInicial.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechafinal = (FechaFinal.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechainicial= (aux_fechainicial.split("/",3)[2])+"-"+(aux_fechainicial.split("/",3)[1])+"-"+(aux_fechainicial.split("/",3)[0])
              aux_fechafinal= (aux_fechafinal.split("/",3)[2])+"-"+(aux_fechafinal.split("/",3)[1])+"-"+(aux_fechafinal.split("/",3)[0])
            
              //Envia a la API las fechas seleccionadas en el FRONTEND
              dataRAW = await GetParosPorFechas(aux_fechainicial+'&'+aux_fechafinal);
            //   console.log(dataRAW)

            setTiempoTotal(dataRAW.TiempoTotal);

            for(let i=0; i<dataRAW.TiempoPorMaquina.length;i++)
            {
                objAux={
                    Maquina: dataRAW.TiempoPorMaquina[i].MAQUINA,
                    TiempoDeParo: dataRAW.TiempoPorMaquina[i].TOTAL_MINUTOS
                }

                TiempoFechas_aux.push(objAux);
            }
            setTiempoFechas(TiempoFechas_aux);
            
          }
    }

    const handleButtonClick = ( ) =>
    {
        GetDataParos(FechaInicial, FechaFinal)
    }; 

   
    return (  
        <>
        <Grid xs={12} sm={12} md={12}>
            <br />
                <h2>-- PAROS DE MÁQUINAS POR FECHAS --</h2>
            <br />
        </Grid>

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Grid width={'75%'} sx={{ boxSizing: 'content-box', margin: 'auto' }}>

                <Card sx={{ minWidth: '30%', borderRadius: "10px", boxShadow: "1px 1px 2px 3px rgba(0, 0, 0, 0.4)", padding: '20px 0' }}> 
                    <Grid container spacing={2} sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    
                                <Grid item xs={2.4} md={2.4} lg={2.4}>
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

                                <Grid item xs={2.4} md={2.4} lg={2.4}>
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
                         
                                <Grid item xs={2.4} md={2.4} lg={2.4}>
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
        
        <Grid item xs={12} md={12} lg={12}>
            <ReporteParosGraficoTabla  Titulo={"Tiempo por Fechas"} Serie={TiempoFechas} TiempoPTotal={TiempoTotal} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        </Grid>
    
  
  </>
  )
    
}