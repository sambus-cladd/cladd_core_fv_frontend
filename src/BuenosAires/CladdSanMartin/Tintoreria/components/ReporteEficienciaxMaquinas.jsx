import {useEffect, useState, React} from 'react';
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker   }   from '@mui/x-date-pickers/DatePicker';
import {GetEficienciaMaquinas} from '../API/APIFunctions'
import { GetMaquinas } from '../API/APIFunctions';
import es from 'date-fns/locale/es';
import ReporteEficienciaxMaquinasTabla from './ReporteEficienciaxMaquinasTabla';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ReporteEficienciaxMaquinas()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)

    const [FechaInicial, setFechaInicial]                       = useState( DiaAnterior );
    const [FechaFinal, setFechaFinal]                           = useState( DiaAnterior );
    const [FechaMaxInicial, setFechaMaxInicial]                 = useState( DiaAnterior );
    const [FechaMaxFinal, setFechaMaxFinal]                     = useState( DiaAnterior );
    const [FechaMinInicial, setFechaMinInicial]                 = useState( "2022/06/01" );
    const [FechaMinFinal, setFechaMinFinal]                     = useState( "2022/06/01" );

    const [TiempoFechas,setTiempoFechas]                        = useState([]);

    const [maquinas, setMaquinas]                               = useState([]);
    const [maquinaSeleccionada, setMaquinaSeleccionada]         = useState('');

    let dataRAW;
    let TiempoFechas_aux, objAux;
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
    //Fin de la conexión con la API que corresponde al listado de Máquinas

    async function GetEficienciaxMaquinas(FechaInicial, FechaFinal)
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
            dataRAW = await GetEficienciaMaquinas(aux_fechainicial + '&' + aux_fechafinal + '&' + maquinaSeleccionada);

            //Aquí por medio del for recorro Eficiencia el cual contiene los datos que arme desde la API
            for(let i=0; i<dataRAW.Eficiencia.length;i++)
                {
                    objAux={
                        Barcada: dataRAW.Eficiencia[i].CDBARCADA,
                        TiempoTeorico: dataRAW.Eficiencia[i].TIEMPOTEORICO,
                        TiempoReal: dataRAW.Eficiencia[i].TIEMPOREAL,
                        TiempoParo: dataRAW.Eficiencia[i].TIEMPOPARO,
                        Eficiencia: dataRAW.Eficiencia[i].EFICIENCIA
                    }

                    TiempoFechas_aux.push(objAux);
                }
                setTiempoFechas(TiempoFechas_aux);
            }
        }
        
    const handleButtonClick = ( ) =>
    {
        GetEficienciaxMaquinas(FechaInicial, FechaFinal)
    }; 

   
    return (  
        <>
        <Grid xs={12} sm={12} md={12}>
            <br />
                <h2>-- EFICIENCIA POR MÁQUINAS --</h2>
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
                                <FormControl fullWidth>
                                        <InputLabel id="combo-box-label">Máquina</InputLabel>
                                            <Select
                                                label="Máquina"
                                                id="combo-box"
                                                value={maquinaSeleccionada}
                                                onChange={(event) => setMaquinaSeleccionada(event.target.value)}
                                                >
                                                {maquinas.map((maquina) => (
                                                    <MenuItem key={maquina.CDMAQUINA} value={maquina.CDMAQUINA}>
                                                    {maquina.CDMAQUINA}
                                                    </MenuItem> 
                                                ))}
                                            </Select>
                                </FormControl>
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

        <h2>{maquinas.find((maquina) => maquina.CDMAQUINA === maquinaSeleccionada)?.DESCRIPCION}</h2>

        <Grid item xs={12} md={12} lg={12}>
            <ReporteEficienciaxMaquinasTabla  Titulo={"Tiempo por Fechas"} Serie={TiempoFechas} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        </Grid>

  </>
  )
    
}