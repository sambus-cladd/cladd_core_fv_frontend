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
import {GetParosMaquinasTodas} from '../API/APIFunctions';
import { GetMaquinas } from '../API/APIFunctions';
import { GetParosXMaquinas } from '../API/APIFunctions';

import EqualizerIcon from '@mui/icons-material/Equalizer';

import es from 'date-fns/locale/es';
import ReporteParosGruposMaquinasTabla from './ReporteParosGruposMaquinasTabla';
import ReporteParosGruposMaquinasGrafico from './ReporteParosGruposMaquinasGrafico';
import ReporteParosXMaquinasGrafico from './ReporteParosXMaquinasGrafico';
import ReporteParosXMaquinasTabla from './ReporteParosXMaquinasTabla';

export default function ReporteParosGruposMaquinas()  {
    
    let Fecha = new Date(Date.now())
    let DiaAnterior= new Date(Fecha.getTime() - 1000 * 60 * 60 * 24)
    const mes=Fecha.getMonth()+1 

    const [FechaInicial, setFechaInicial]                       = useState( DiaAnterior );
    const [FechaFinal, setFechaFinal]                           = useState( DiaAnterior );
    const [FechaMaxInicial, setFechaMaxInicial]                 = useState( DiaAnterior );
    const [FechaMaxFinal, setFechaMaxFinal]                     = useState( DiaAnterior );
    const [FechaMinInicial, setFechaMinInicial]                 = useState( "2022/06/01" );
    const [FechaMinFinal, setFechaMinFinal]                     = useState( "2022/06/01" );

    const [ProduccionFechas, setProduccionFechas]               = useState([]);
    const [ParosXMaquinas, setParosXMaquinas]                   = useState([]);

    const [maquinas, setMaquinas]                               = useState([]);
    const [maquinaSeleccionada, setMaquinaSeleccionada]         = useState(0);

    let dataRAW; let dataRAW2;
    let ProduccionFechas_aux, objAux;
    let ParosPorMaquinas_aux, objAux2;
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
    
    async function GetParosTotal(FechaInicial, FechaFinal)
    {
        ProduccionFechas_aux=[];
        ParosPorMaquinas_aux=[];
        objAux=[]; objAux2=[];

        if(FechaInicial!=null && FechaFinal!= null)
          {    
              aux_fechainicial = (FechaInicial.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechafinal = (FechaFinal.toLocaleDateString('en-GB')).split("T", 2)[0]
              aux_fechainicial= (aux_fechainicial.split("/",3)[2])+"-"+(aux_fechainicial.split("/",3)[1])+"-"+(aux_fechainicial.split("/",3)[0])
              aux_fechafinal= (aux_fechafinal.split("/",3)[2])+"-"+(aux_fechafinal.split("/",3)[1])+"-"+(aux_fechafinal.split("/",3)[0])
          
              dataRAW = await GetParosMaquinasTodas(aux_fechainicial + '&' + aux_fechafinal);

                for(let i=0; i<dataRAW.Datos.length;i++)
                {
                    objAux={
                        IdMaquina: dataRAW.Datos[i].IDMAQUINA,
                        TiempoParos: dataRAW.Datos[i].TiempoParos,
  
                    }

                    ProduccionFechas_aux.push(objAux);
                }
                setProduccionFechas(ProduccionFechas_aux);

                dataRAW2 = await GetParosXMaquinas(aux_fechainicial + '&' + aux_fechafinal + '&' + maquinaSeleccionada);

                console.log(dataRAW2)

                for(let i=0; i<dataRAW2.Datos.length;i++)
                {
                    objAux2={
                        IdMaquina: dataRAW2.Datos[i].IDMAQUINA,
                        DESCRIPCION: dataRAW2.Datos[i].DESCRIPCION,
                        TiempoParos: dataRAW2.Datos[i].TiempoParos,
                    }

                    ParosPorMaquinas_aux.push(objAux2);
                }
                setParosXMaquinas(ParosPorMaquinas_aux);            
          }
    }

    const handleButtonClick = ( ) =>
    {
        GetParosTotal(FechaInicial, FechaFinal)
    }; 
   
    return (  
        <>

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
                    <span style={{ marginLeft: '5px' }}> <strong> Análisis de paros general </strong> </span>
                </p>
            </Card>
        </Grid>
        
        <Grid item xs={12} md={12} lg={12}>

            <ReporteParosGruposMaquinasGrafico Serie={ProduccionFechas} />

            <ReporteParosGruposMaquinasTabla  Serie={ProduccionFechas} Labels={[' ' ]} FechaIncio={FechaInicial} FechaFin={FechaFinal}/>
        
        </Grid>

        <br />

        <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card sx={{ width: '100%', boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)', padding: '15px 0', marginBottom: '20px' }}>
                <p style={{ backgroundColor: "#b4f863", padding: '0 15px', fontFamily: 'Poppins', fontSize: '25px', color: '#252624', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <EqualizerIcon></EqualizerIcon>
                    <span style={{ marginLeft: '5px' }}> <strong> Análisis de paros por máquina - {maquinas.find((maquina) => maquina.CDMAQUINA === maquinaSeleccionada)?.DESCRIPCION} </strong> </span>
                </p>
            </Card>
        </Grid>

        <br />

        <ReporteParosXMaquinasGrafico Serie={ParosXMaquinas} />

        <br />

        <ReporteParosXMaquinasTabla  Serie={ParosXMaquinas} />
    
  
  </>
  )
    
}

